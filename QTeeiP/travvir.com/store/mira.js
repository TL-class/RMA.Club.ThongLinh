import logger from "debug";
import { nextTick } from "vue";
import { defineStore } from "pinia";
import { useViewerStore } from "./viewer";
import { usePropertyStore } from "./property";
const debug = logger("travvir:debut-nuxt:store:mira");

export const useMiraStore = defineStore("mira", {
  state: () => {
    return {
      country: "US",
      userTraining:
        typeof window !== "undefined" && window.localStorage
          ? JSON.parse(window.localStorage.getItem("training") || "null")
          : null,
      messages: [],
      options: [],
      conversing: false,
      audioQueue: [],
      playing: false,
      muted: true,
      hideMiraMessageCount: 0,
      hideMira: false,
      activatedModal: "",
      nextSceneInterrupt: false,
      isUserTyping: false,
      isMiraFocus: false,
      idleSeconds: 0,
      idleCount: 0,
      isMicReady: false,
      isMicChecked: false,
      thinking: false,
      miraSocket: null,
      inputInFocus: false,
    };
  },
  getters: {
    listeningStartAudio() {
      const config = useRuntimeConfig();
      return `${config.public.NUXT_CDN_URL}/static/sound/start.wav`;
    },
    listeningStopAudio() {
      const config = useRuntimeConfig();
      return `${config.public.NUXT_CDN_URL}/static/sound/end.wav`;
    },
  },
  actions: {
    setCountry(code) {
      this.country = code;
    },
    setThinking(value) {
      this.thinking = value;
    },
    resetChat(type) {
      const viewerStore = useViewerStore();
      if (!viewerStore.isPortrait) return;
      if (!this.options.length) this.messages = [];
      if (type == "click") {
        this.options = [];
        this.messages = [];
      }
      window.dispatchEvent(new Event("resize"));
    },
    resetMiraChat() {
      this.messages = [];
      this.options = [];
      this.conversing = false;
      this.audioQueue = [];
      this.playing = false;
      this.muted = true;
      this.hideMiraMessageCount = 0;
      this.hideMira = false;
      this.activatedModal = "";
      this.nextSceneInterrupt = false;
      this.isUserTyping = false;
      this.isMiraFocus = false;
      this.idleSeconds = 0;
      this.idleCount = 0;
      this.isMicReady = false;
      this.isMicChecked = false;
    },
    textAnimation(text) {
      let words = text.split(" ");
      let currentMessage = this.messages[this.messages.length - 1];

      let interval = setInterval(() => {
        if (words.length == 0) {
          clearInterval(interval);
          return;
        }

        currentMessage.text += words.shift() + " ";

        if (this.messages[this.messages.length - 1] !== currentMessage) {
          currentMessage.text += words.join(" ");
          clearInterval(interval);
        }
      }, 50);
    },
    sendAnalyticsEvent(event) {
      const viewerStore = useViewerStore();
      window.busSocket.sendEvent({
        name: event.type == "mira" ? "MIRA_MESSAGE" : "USER_MESSAGE",
        text: event.text,
        sceneId: viewerStore.selectedSceneId,
        options: this.options.length ? this.options : [],
      });
    },
    checkForMic() {
      return new Promise((resolve, reject) => {
        if (!navigator.permissions?.query) {
          this.isMicChecked = true;
          return reject("Not Supported");
        }
        if (this.isMicReady) return resolve();
        navigator.permissions.query({ name: "microphone" }).then((result) => {
          this.isMicChecked = true;
          if (result.state == "granted") {
            this.isMicReady = true;
            return resolve();
          } else if (result.state == "prompt") return resolve();
          else resolve();
        });
      });
    },
    askForMic() {
      return new Promise((resolve, reject) => {
        if (this.isMicReady) return resolve();
        this.pushAndPlay(
          `Kindly grant your mic's permission to start interacting with me.`,
        );
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((r) => {
            window.busSocket.sendEvent({ name: "MIRA_MIC_READY" });
            this.isMicReady = true;
            r.getTracks().forEach((track) => track.stop());
            debug("You've got the mic permission but not stream");
            resolve();
          })
          .catch((e) => {
            window.busSocket.sendEvent({ name: "MIRA_MIC_DENIED" });
            debug("Error getting mic permission", e);
            this.pushAndPlay(
              `Mic's permission denied. But, you can still interact with me via the chat window.`,
            );
            reject(e);
          });
      });
    },
    toggleMira() {
      this.hideMira = !this.hideMira;
      this.muted = this.hideMira;
      if (!this.hideMira) {
        this.hideMiraMessageCount = 0;
      }
    },
    muteMira() {
      debug("muted mira");
      window.busSocket.sendEvent({ name: "MIRA_MUTED" });
      this.muted = true;
    },
    unmuteMira() {
      window.busSocket.sendEvent({ name: "MIRA_UNMUTED" });
      debug("unmuted mira");
      this.muted = false;
    },
    startFollowUp() {
      const { $miraSocket } = useNuxtApp();
      $miraSocket.followUp();
    },
    handleIdle() {
      if (!document.hasFocus() || this.playing || this.options.length) return;
      this.idleSeconds = 0;
      this.idleCount++;
      if (this.idleCount == 1) this.autoTourPrompt();
      if (this.idleCount >= 2) this.startFollowUp();
    },
    autoTourPrompt() {
      this.options = [
        { name: "Yes", id: "yes", command: "TOUR" },
        { name: "No", id: "no", command: "TOUR" },
      ];
      this.pushAndPlay("Would you like to take a tour?");
    },
    async coversationFollowUp(data) {
      this.options = [
        {
          name: "Yes",
          id: "yes",
          question: data.question,
          command: "CONVERSATION-REPLY",
        },
        {
          name: "No",
          id: "no",
          question: data.question,
          command: "CONVERSATION-REPLY",
        },
      ];
      await this.pushAndPlay(data.question);
    },
    async goFollowUp(data) {
      let scenes = [];
      for (let s of data.scenes) {
        scenes.push({ name: s.name, id: s.id, command: "GO" });
      }
      scenes.push({ name: "No", id: "no", command: "GO" });
      this.options = scenes;
      await this.pushAndPlay(data.text);
    },
    async marketingFollowUp(data) {
      let files = [];
      for (let f of data.files) {
        files.push({ name: f.name, id: f.id, command: "MARKETING" });
      }
      files.push({ name: "No", id: "no", command: "MARKETING" });
      this.options = files;
      await this.pushAndPlay(data.text);
    },
    async mapFollowUp(data) {
      let options = [];
      for (let s of data.categories) {
        options.push({ name: s.name, id: s.value, command: "MAP" });
      }
      options.push({ name: "No", id: "no", command: "MAP" });
      this.options = options;
      await this.pushAndPlay(data.text);
    },
    activateModal(modal) {
      window.busSocket.sendEvent({ name: "MODAL_OPEN", modal });
      this.activatedModal = modal;
    },
    closeModal() {
      this.activatedModal = "";
    },
    activeUserTyping(text) {
      this.isUserTyping = text.length ? true : false;
      this.isMiraFocus = true;
    },
    closeUserTyping() {
      this.isUserTyping = false;
      setTimeout(() => {
        this.isMiraFocus = false;
      }, 500);
    },
    addUserMessage(text) {
      const { $miraSocket } = useNuxtApp();
      this.idleSeconds = 0;
      this.options = [];
      const audioElement = document.getElementById("miraVocalCord");
      if (audioElement && audioElement.interruptAudio) {
        audioElement.interruptAudio();
      }
      this.sendAnalyticsEvent({ text, type: "user" });
      this.messages.push({ text, type: "user" });
      $miraSocket.ask(text);
    },
    processResponse(data) {
      debug("processing response", data);
      try {
        const viewerStore = useViewerStore();
        const propertyStore = usePropertyStore();
        let options = [];
        if (data.intent == "GO" && !data.params) {
          for (let s of data.scenes) {
            options.push({ name: s.name, id: s.id, command: "GO" });
          }
        }
        this.options = options;
        this.sendAnalyticsEvent({ text: data.text, type: "mira" });
        this.messages.push({ text: "", type: "mira" });
        this.textAnimation(data.text);
        if (data.audio) this.playAudio(data.audio);
        else if (data.text) this.playText(data.text);
        if (data.intent == "MARKETING") {
          debug("open marketing material", data.params);
          if (!data.params) return;
          this.openMarketingMaterial(data.params);
        } else if (data.intent == "GO") {
          if (data.params?.sceneId)
            viewerStore.setCurrentScene(
              data.params.sceneId,
              null,
              false,
              "Mira",
            );
        } else if (data.intent == "TOUR") {
          this.startTour();
        }
        if (data.intent == "MAP") {
          debug("open map category", data);
          const filterCategory = propertyStore.mapCategories.find((categores) =>
            data.data[0].types.includes(categores.value),
          );
          this.openMapCategory({
            id: filterCategory.value,
            name: filterCategory.name,
          });
        }
        this.idleSeconds = 0;
      } catch (error) {
        debug("error processing response", error);
      }
    },
    openMarketingMaterial(fileId) {
      this.activateModal("info");
      let propertyStore = usePropertyStore();
      propertyStore.setSelectedFile(fileId);
      propertyStore.isInformationOverlayModalOpen = true;
      nextTick(() => {
        if (fileId) {
          let el = document.querySelector(
            `.modal-content .thumbnail[data-id="${fileId}"]`,
          );
          debug(el);
          if (el) el.click();
        }
      });
    },
    openMapCategory(command) {
      let propertyStore = usePropertyStore();
      propertyStore.setMapCategory({ value: command.id, name: command.name });
      this.activateModal("map");
    },
    processMiraCommand(command) {
      const { $miraSocket } = useNuxtApp();
      debug(command);
      this.idleSeconds = 0;
      this.options = [];
      if (command.command == "PAUSE") {
        this.stopTour();
      }
      if (command.command == "NEXT") {
        this.nextSceneInterrupt = true;
        this.playing = false;
      }
      if (command.command == "GO") {
        this.sendAnalyticsEvent({ text: command.name, type: "user" });
        this.messages.push({ text: command.name, type: "user" });
        if (command.id == "no") return;
        this.goTo(command);
      }

      // follow ups
      if (command.command == "CONVERSATION-REPLY") {
        if (command.id == "yes")
          $miraSocket.reply(command.question, command.name);
        this.sendAnalyticsEvent({ text: command.name, type: "user" });
        this.messages.push({ text: command.name, type: "user" });
      }
      if (command.command == "MARKETING") {
        if (command.id == "no") return;
        // $miraSocket.reply(command.text, command.name)

        this.sendAnalyticsEvent({ text: command.name, type: "user" });
        this.messages.push({ text: command.name, type: "user" });
        this.openMarketingMaterial(command.id);
      }
      if (command.command == "MAP") {
        if (command.id == "no") return;
        this.sendAnalyticsEvent({ text: command.name, type: "user" });
        this.messages.push({ text: command.name, type: "user" });
        this.openMapCategory(command);
      }
      if (command.command == "TOUR") {
        if (command.id == "no") return;
        if (command.id == "yes") this.startTour();
      }
      this.idleSeconds = 0;
    },
    async goTo(command) {
      const viewerStore = useViewerStore();
      let text = "Sure";
      viewerStore.setCurrentScene(command.id, null, false, "Mira");
      await this.pushAndPlay(text);
    },
    converse(response) {
      this.idleSeconds = 0;
      this.options = [];
      if (response.partial) {
        if (this.messages[this.messages.length - 1]?.partial)
          this.messages[this.messages.length - 1].text = response.text;
        else {
          this.sendAnalyticsEvent({ text: response.text, type: "mira" });
          this.messages.push({
            text: response.text,
            type: "mira",
            partial: true,
          });
        }
      } else {
        this.audioQueue.push({ ...response, finish: false });
        this.processAudioQueue();
      }
      if (response.finish)
        this.messages[this.messages.length - 1].partial = false;
    },
    processAudioQueue() {
      if (this.conversing) return;
      this.playFromQueue()
        .then((res) => {
          this.conversing = false;
          if (!res.finish) this.processAudioQueue();
          // else this.$emit('complete')
        })
        .catch((err) => {
          debug(err);
          this.conversing = false;
        });
    },
    async playFromQueue() {
      if (this.audioQueue.length == 0) {
        throw { finish: false, message: "Queue is empty" };
      }
      let { text, audio, lang, finish } = this.audioQueue.shift();
      if (finish) {
        return { finish: true, message: "Conversation finished" };
      }
      try {
        this.conversing = true;
        if (audio) await this.playVoice(audio);
        else await this.playText(text, lang);
        return {
          finish: false,
          message: "Fetch next item from queue",
        };
      } catch (error) {
        throw { finish: false, message: error.message };
      }
    },
    async startTour() {
      this.playing = true;
      window.busSocket.sendEvent({ name: "AUTOTOUR_START" });
      let options = [
        { name: "Pause Tour", command: "PAUSE", id: "pause-tour" },
        // { name: 'Next Scene', command: 'NEXT', id: 'next-scene' }
      ];
      this.options = options;
      await this.pushAndPlay(
        `Let's go for a quick walk & I'll show you around`,
      );
      this.goToNextScene();
    },
    async stopTour() {
      window.busSocket.sendEvent({ name: "AUTOTOUR_STOP" });
      this.options = [];
      this.playing = false;
    },
    createBeforeSceneText(sceneName) {
      let texts = [
        "Moving ahead to the",
        "Taking you to the",
        "Let's now go to the",
        "Going next to the",
      ];
      let random = texts[Math.floor(Math.random() * texts.length)];
      if (sceneName.slice(0, 3).toLowerCase() == "the")
        random = random.slice(0, -3);
      return `${random} ${sceneName}`;
    },
    async goToNextScene() {
      try {
        this.options = [];
        if (!this.playing) throw new Error("Tour stopped");
        const viewerStore = useViewerStore();
        const nextScene = viewerStore.nextScene();
        if (nextScene) {
          window.busSocket.sendEvent({
            name: "AUTOTOUR_NEXT_SCENE",
            nextScene,
          });
          let text = this.createBeforeSceneText(nextScene.name);
          debug("nextScene => ", nextScene);
          await this.pushAndPlay(text);
          if (!this.playing) throw new Error("Tour stopped");
          await this.setSceneForAutoTour(nextScene.id);
          if (!this.playing) throw new Error("Tour stopped");
          this.goToNextScene();
        } else {
          this.endWithNearBy();
          this.playing = false;
        }
      } catch (e) {
        debug("error going to next scene", e);
        if (this.nextSceneInterrupt) {
          this.nextSceneInterrupt = false;
          this.playing = true;
          this.goToNextScene();
        }
      }
    },
    endWithNearBy() {
      try {
        // const propertyStore = usePropertyStore()
        this.pushAndPlay(
          "You can now explore this place around. If you need any assistance, feel free to interact with me.",
        );
        this.stopTour();
        // this.pushAndPlay('Details on how we are located from some important places are as follows')
        // let options = []
        // for (let place of propertyStore.nearByMira) {
        //   options.push({ name: `${place.heading} - ${place.place} (${place.distance.text})` })
        // }
        // this.options = options
      } catch (error) {
        debug("error ending tour", error);
      }
    },
    async setSceneForAutoTour(id) {
      try {
        const viewerStore = useViewerStore();
        viewerStore.resetOldScene();
        let promise = await viewerStore.setNewScene(id);
        if (!this.playing) return Promise.reject("Tour stopped");
        let options = [
          { name: "Pause Tour", command: "PAUSE", id: "pause-tour" },
          { name: "Next Scene", command: "NEXT", id: "next-scene" },
        ];
        let p1;
        if (promise.sceneInfo) p1 = this.pushAndPlay(promise.sceneInfo);
        else p1 = this.pushAndPlay("Showing you around.");
        this.options = options;
        let p2 = this.fullRotate();
        if (!this.playing) return Promise.reject("Tour stopped");
        await Promise.all([p1, p2]);
        this.options = [];
      } catch (e) {
        debug("error setting scene for autotour", e);
      }
    },
    setTrainingComplete() {
      let date = new Date();
      let training = { trainedOn: date.toDateString() };
      window.localStorage.setItem("training", JSON.stringify(training));
      this.userTraining = true;
    },
    async startMiraIntro() {
      this.setTrainingComplete();
      let propertyStore = usePropertyStore();
      let text = `Hi! Welcome ${
        propertyStore.propertyInfo.name
          ? "to " + propertyStore.propertyInfo.name
          : ""
      }. I'm Mira and I will help you explore this place.${propertyStore.isBasicMiraConfig ? "" : " Please feel free to talk to me."}`;
      await this.pushAndPlay(text);
    },
    async startMiraShortIntro() {
      this.setTrainingComplete();

      let greetings = [
        // "I'm here to assist you in exploring this place.",
        "Please feel free to inquire about this place",
        "Please feel free to talk to me for more information here",
        "Kindly interact with me for more information",
        "Kindly speak with me for more details",
      ];
      let greet = greetings[Math.floor(Math.random() * greetings.length)];
      let text = `Hi! Welcome back. ${greet}.`;
      await this.pushAndPlay(text);
    },
    async pushAndPlay(text) {
      this.idleSeconds = 0;
      this.sendAnalyticsEvent({ text, type: "mira" });
      this.messages.push({ text: "", type: "mira" });
      this.textAnimation(text);
      if (this.hideMira) this.hideMiraMessageCount++;
      await this.playText(text);
      this.idleSeconds = 0;
    },

    // AUDIO FUNCTIONS
    async getAudio({ text, lang }) {
      const { $miraSocket } = useNuxtApp();
      if (!$miraSocket || !$miraSocket.socket) {
        debug("Mira socket not initialized");
        return Promise.reject("Mira socket not initialized");
      }
      return new Promise((resolve) => {
        $miraSocket.socket.once("VOICE", (response) => {
          resolve(response);
        });
        $miraSocket.getVoice({ text, lang });
      });
    },
    async fetchAudio(text, lang) {
      try {
        if (!text || !text.length) return Promise.resolve();
        let response = await this.getAudio({ text, lang });
        if (response) return response.audio;
        return Promise.reject();
      } catch (error) {
        debug(error);
        throw error;
      }
    },
    async playAudio(stream) {
      let audioElement = document.getElementById("miraVocalCord");
      audioElement.src = "data:audio/wav;base64," + stream;

      return new Promise((resolve) => {
        const handleInterruption = () => {
          audioElement.pause();
          audioElement.src = "";
          resolve();
        };

        audioElement.interruptAudio = handleInterruption;

        audioElement.onended = () => {
          audioElement.src = "";
          this.resetChat("auto");
          window.dispatchEvent(new Event("resize"));
          resolve();
        };

        audioElement.onpause = () => {
          debug("audio was paused");
          this.resetChat("auto");
          window.dispatchEvent(new Event("resize"));
          resolve();
        };

        audioElement.play();
      });
    },
    async playText(text, lang = "en") {
      try {
        let stream = await this.fetchAudio(text, lang);
        if (stream) {
          return await this.playAudio(stream);
        }
      } catch (error) {
        debug(error);
        throw error;
      }
    },
    stopAudio() {
      let audioElement = document.getElementById("miraVocalCord");
      if (audioElement) {
        audioElement.pause();
        audioElement.src = null;
      }
    },
    muteAudio() {
      let audioElement = document.getElementById("miraVocalCord");
      audioElement.muted = true;
    },
    unmuteAudio() {
      let audioElement = document.getElementById("miraVocalCord");
      audioElement.muted = false;
    },
    async fullRotate() {
      try {
        const viewerStore = useViewerStore();
        await this.delay(1500);
        if (!this.playing) return Promise.reject("Tour stopped");
        let initialPosition = {
          yaw: viewerStore.currentScene._scene.view()._yaw,
          pitch: 0,
        };
        debug("full rotation started from ", initialPosition);
        let directions = [-1, 1];
        let direction =
          directions[Math.floor(Math.random() * directions.length)];
        let nextPosition = {
          yaw: initialPosition.yaw + (120 / 180) * Math.PI * direction,
          pitch: initialPosition.pitch,
        };
        await this.rotate(nextPosition);
        if (!this.playing) return Promise.reject("Tour stopped");
        await this.delay(200);
        if (!this.playing) return Promise.reject("Tour stopped");
        nextPosition = {
          yaw: nextPosition.yaw + (120 / 180) * Math.PI * direction,
          pitch: nextPosition.pitch,
        };
        await this.rotate(nextPosition);
        if (!this.playing) return Promise.reject("Tour stopped");
        await this.delay(200);
        if (!this.playing) return Promise.reject("Tour stopped");
        nextPosition = {
          yaw: nextPosition.yaw + (125 / 180) * Math.PI * direction,
          pitch: nextPosition.pitch,
        };
        await this.rotate(nextPosition);
        debug("full rotation complete");
      } catch (error) {
        return Promise.reject(error);
      }
    },
    rotate(position) {
      return new Promise((resolve) => {
        const viewerStore = useViewerStore();
        debug("Rotating to", position);
        viewerStore.currentScene._scene.lookTo(
          position,
          {
            transitionDuration: 6500,
            controlsInterrupt: true,
          },
          () => {
            debug("rotation complete");
            resolve();
          },
        );
      });
    },
    delay(time = 2000) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
  },
});
