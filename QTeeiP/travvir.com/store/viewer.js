import logger from "debug";
import { nextTick } from "vue";
import { defineStore } from "pinia";
import screenfull from "screenfull";
import { useMiraStore } from "./mira";
import { useNuxtApp } from "nuxt/app";
import { useSceneStore } from "./scene";
import { usePropertyStore } from "./property";
import { syncCursorHotspots } from "~/components/viewer/scene/HotspotManager";
const debug = logger("travvir:debut-nuxt:store:viewer");

const PRESENTER_CURSOR_LOOKTO_THRESHOLD_DEG = 40;
const PRESENTER_CURSOR_LOOKTO_THRESHOLD_RAD =
  (PRESENTER_CURSOR_LOOKTO_THRESHOLD_DEG * Math.PI) / 180;

function getAngularDistance(pos1, pos2) {
  const deltaYaw = pos2.yaw - pos1.yaw;
  const deltaPitch = pos2.pitch - pos1.pitch;
  return Math.sqrt(deltaYaw * deltaYaw + deltaPitch * deltaPitch);
}

export const useViewerStore = defineStore("viewer", {
  state: () => {
    return {
      viewer: null,
      isReady: false,
      isFullscreen: false,
      selectedSceneId: null,
      interruptSignal: null,
      landscape: 0,
      scenes: {},
      isToggleQuality: false,
      isPortrait: false,
      activeHotspot: null,
      marzipanoReady: false,
      isFirstScene: true,
      conferenceMembers: {},
      conferencePresenterId: null,
      isCallConnected: false,
      conferenceDeviceId: null,
      pendingViewSync: null,
      isApplyingViewSync: false,
      presenterCursorPos: null,
      lastViewSyncCoords: null,
      lastViewSyncAt: 0,
      conferenceDeferPresenterSync: false,
      cursorHotspots: {},
    };
  },
  getters: {
    currentScene() {
      return this.scenes[this.selectedSceneId];
    },
    autorotate() {
      if (import.meta.server || !window) return;
      const { $marzipano } = useNuxtApp();
      if (!$marzipano) return;
      return $marzipano.autorotate({
        yawSpeed: 0.1,
        targetPitch: 0,
      });
    },
    // nextScene() {
    //   const propertyStore = usepaymentModePropertyStore()
    //   const leftScenes = propertyStore.autoTourScenes.filter(
    //     (scene) => !this.getSceneById(scene.id)?.visited
    //   )
    //   debug(leftScenes, 'leftScenes')
    //   return leftScenes.length > 0 ? leftScenes[0] : null
    // },
    // functional getters
    getSceneById: (state) => (id) => {
      return state.scenes[id];
    },
    isConferencePresenter(state) {
      return (
        state.isCallConnected &&
        !!state.conferencePresenterId &&
        state.conferencePresenterId === state.conferenceDeviceId
      );
    },
    isConferenceViewer(state) {
      return (
        state.isCallConnected &&
        !(
          state.conferencePresenterId &&
          state.conferencePresenterId === state.conferenceDeviceId
        )
      );
    },
  },
  actions: {
    resetCurrentScene() {
      this.viewer = null;
      this.isReady = false;
      this.selectedSceneId = null;
    },
    setLandscape(value) {
      this.landscape = value;
    },
    nextScene() {
      const sceneStore = useSceneStore();
      const leftScenes = sceneStore.getAutoTourScenes.map((scene) => {
        return { ...scene, visited: this.getSceneById(scene.id)?.visited };
      });
      // debug(leftScenes, 'leftScenes')
      let filterScenes = leftScenes?.filter((scene) => !scene.visited);
      // debug(filterScenes, 'filterScenes')
      return filterScenes.length > 0 ? filterScenes[0] : null;
    },
    setIsReady(state) {
      if (import.meta.server || !window) return;
      window.busSocket.sendEvent({ name: "INTERACTED", state });
      this.isReady = state;
      nextTick(() => {
        window.dispatchEvent(new Event("resize"));
      });
    },
    addNewScene(id, data) {
      this.scenes[id] = { ...data.data };
      this.scenes[id]._scene = data.scene;
      this.scenes[id]._connections = data.connections;
      if (data.cursorHotspots) {
        this.storeCursorHotspots(id, data.cursorHotspots);
      }
      debug("added new scene", this.scenes);
      if (Object.keys(this.conferenceMembers).length) {
        syncCursorHotspots();
      }
    },
    storeCursorHotspots(sceneId, hotspots) {
      if (!this.cursorHotspots[sceneId]) this.cursorHotspots[sceneId] = {};
      Object.assign(this.cursorHotspots[sceneId], hotspots);
    },
    colorFromId(id) {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      return (
        "#" +
        Math.abs(hash % 0xffffff)
          .toString(16)
          .padStart(6, "0")
      );
    },
    setConferenceMembers(payload, selfUserId = null) {
      if (!payload) return;
      const members = payload?.members || [];
      const presenterId = payload.presenterId;
      const result = {};
      debug(members, presenterId, selfUserId, "user");
      for (const m of members) {
        result[m.userId] = {
          ...m,
          color: this.colorFromId(m.userId),
        };
      }
      this.conferenceMembers = result;
      if (presenterId) {
        this.setConferencePresenter(presenterId);
      }
      debug("conferenceMembers updated", this.conferenceMembers);
    },
    setConferencePresenter(presenterId) {
      const propertyStore = usePropertyStore();
      if (!propertyStore.isConferenceActive) {
        this.conferencePresenterId = null;
        return;
      }
      this.conferencePresenterId = presenterId || null;
      debug("conference presenter updated", presenterId);
    },
    removeConferenceMember(userId) {
      if (!userId) return;
      if (this.conferenceMembers[userId]) {
        delete this.conferenceMembers[userId];
      }
      if (this.conferencePresenterId === userId) {
        this.conferencePresenterId = null;
      }
      debug("conference member removed", userId);
    },
    setConferenceCallState({ connected, deviceId } = {}) {
      if (connected !== undefined) this.isCallConnected = connected;
      if (deviceId !== undefined) this.conferenceDeviceId = deviceId;
    },
    resetConferenceCallState() {
      this.isCallConnected = false;
      this.conferencePresenterId = null;
      this.conferenceMembers = {};
      this.conferenceDeviceId = null;
      this.pendingViewSync = null;
      this.isApplyingViewSync = false;
      this.presenterCursorPos = null;
      this.lastViewSyncCoords = null;
      this.lastViewSyncAt = 0;
      this.conferenceDeferPresenterSync = false;
    },
    syncPresenterView({ yaw, pitch, fov, sceneId, force = false } = {}) {
      if (this.isConferencePresenter) return false;
      if (!Number.isFinite(yaw) || !Number.isFinite(pitch)) return false;

      if (sceneId && this.selectedSceneId !== sceneId) {
        this.pendingViewSync = { yaw, pitch, fov, sceneId };
        return false;
      }
      if (!this.viewer?.view() || !this.marzipanoReady) {
        this.pendingViewSync = {
          yaw,
          pitch,
          fov,
          sceneId: sceneId || this.selectedSceneId,
        };
        return false;
      }

      const view = this.viewer.view();
      const currentView = { yaw: view.yaw(), pitch: view.pitch() };
      const cursorView = { yaw, pitch };
      const cursorDistance = getAngularDistance(currentView, cursorView);

      this.presenterCursorPos = { yaw, pitch };

      const presenterHotspot =
        this.cursorHotspots[this.selectedSceneId]?.[this.conferencePresenterId];
      if (presenterHotspot) {
        presenterHotspot.setPosition({ yaw, pitch });
      }

      if (cursorDistance < PRESENTER_CURSOR_LOOKTO_THRESHOLD_RAD) {
        return false;
      }

      const now = Date.now();
      const positionThreshold = 0.006;
      const minIntervalMs = 90;
      if (
        !force &&
        this.lastViewSyncCoords &&
        now - this.lastViewSyncAt < minIntervalMs &&
        Math.abs(yaw - this.lastViewSyncCoords.yaw) < positionThreshold &&
        Math.abs(pitch - this.lastViewSyncCoords.pitch) < positionThreshold
      ) {
        return false;
      }

      this.lastViewSyncCoords = { yaw, pitch };
      this.lastViewSyncAt = now;
      this.isApplyingViewSync = true;

      const coords = { yaw, pitch };
      if (fov != null && Number.isFinite(fov)) coords.fov = fov;

      const transitionDuration = 100;
      this.viewer.lookTo(coords, { transitionDuration });
      this.pendingViewSync = null;

      setTimeout(() => {
        this.isApplyingViewSync = false;
      }, transitionDuration + 20);

      return true;
    },
    applyPendingViewSync() {
      if (!this.pendingViewSync) return;
      const { sceneId, ...view } = this.pendingViewSync;
      if (sceneId && this.selectedSceneId !== sceneId) return;
      this.syncPresenterView({ ...view, sceneId });
    },
    setConferenceViewerControls(enabled) {
      debug(enabled);
      if (!this.viewer) return;
      if (!this.currentScene?.lockScreen) {
        this.viewer.controls().enable();
      }
    },
    updateMemberCursor(userId, yaw, pitch) {
      const hotspot = this.cursorHotspots[this.selectedSceneId]?.[userId];
      if (hotspot) hotspot.setPosition({ yaw, pitch });

      if (
        userId === this.conferencePresenterId &&
        Number.isFinite(yaw) &&
        Number.isFinite(pitch)
      ) {
        this.presenterCursorPos = { yaw, pitch };
      }
    },
    async setCurrentScene(id, hotspot = null, isFirst = false, source) {
      try {
        debug("setting current scene", id, hotspot, isFirst, source);
        const propertyStore = usePropertyStore();
        const route = useRoute();
        const miraStore = useMiraStore();
        //reset mira messages on mobile.
        if (this.marzipanoReady && this.isPortrait) {
          miraStore.resetChat("click");
        }
        this.resetOldScene(hotspot);
        const previouslyVisited = this.getSceneById(id)?.visited;
        debug("previously visited", previouslyVisited);
        let promise = await this.setNewScene(id, hotspot);
        // miraStore.messages.push({ text: 'Scene changed to ' + promise.name, type: 'user' })

        // post scene switch actions
        if (promise.lockScreen) {
          this.viewer.stopMovement();
          this.viewer.setIdleMovement(Infinity);
          this.viewer.controls().disable();
        } else {
          this.viewer.controls().enable();
          if (route.name === "conference-conferenceKey") return;
          if (this.isFirstScene) this.viewer.startMovement(this.autorotate);
          if (this.$router?.currentRoute.value.name == "embed-do") {
            debug("5 sec rotate");
            this.viewer.setIdleMovement(5000, this.autorotate);
          } else {
            debug("15 sec rotate");
            this.viewer.setIdleMovement(15000, this.autorotate);
          }
        }

        // mira post scene switch actions
        if (
          this.isReady &&
          promise.sceneInfo &&
          !previouslyVisited &&
          !propertyStore.isExpiredMiraConfig
        ) {
          miraStore.options = [];
          miraStore.pushAndPlay(promise.sceneInfo);
        }
        // analytics
        // window.busSocket.sendEvent({
        //   name: "SCENE_CHANGE",
        //   target: id,
        //   sceneName: promise.name,
        //   hotspot: hotspot ? hotspot : null,
        //   source: source ? source : null,
        // });

        if (this.isConferenceViewer) {
          nextTick(() => this.applyPendingViewSync());
        }

        return promise;
      } catch (e) {
        debug("error setting scene", e);
      }
    },
    setNewScene(id, hotspot = null) {
      debug("setting new scene", id, hotspot);
      return new Promise((resolve, reject) => {
        let scene = this.getSceneById(id);
        debug("setting new scene", scene);
        if (this.selectedSceneId === id) return resolve(scene);
        if (scene) {
          let fov = Math.PI / 2;
          if (this.isPortrait) {
            fov = (115 * Math.PI) / 180;
          }
          let cords = {
            yaw: scene.initialViewParameters.yaw,
            pitch: 0,
            fov: fov,
          };

          // if (this.$router.currentRoute.name == "embed-do") {
          //   if (window.screen.orientation.type.includes("landscape"))
          //     cords.fov = (90 * Math.PI) / 180;
          //   else cords.fov = (120 * Math.PI) / 180;
          // }
          if (hotspot) {
            debug("clicked from hotspot");
            cords.yaw = hotspot.target.position.yaw;
          }
          debug("setting new scene with inital view params", scene.id, cords);
          if (hotspot) cords.yaw = hotspot.target.position.yaw;

          scene._scene.lookTo(cords, { transitionDuration: 10 }, () => {
            // debug('complete lookto')
            scene._scene.switchTo({ transitionDuration: 1000 }, (e) => {
              debug(e, "switch to");
              scene._scene.hotspotContainer().show();
              this.selectedSceneId = id;
              scene.visited = true;
              debug("scene change complete:", this.currentScene.id);
              resolve(scene);
            });
            this.marzipanoReady = true;
          });
        } else {
          this.interruptSignal = { id, hotspot };
          debug("Scene not found");
          reject("scene not found");
        }
      });
    },
    resetOldScene(hotspot = null) {
      debug(hotspot, "reset old scene");
      if (this.currentScene) {
        debug("resetting old scene", this.currentScene.id);
        // this.activeHotspot = null;
        this.currentScene._connections.forEach((c) => {
          debug(c);
          this.activeHotspot = null;
          // c.component.component.data.active = false;
        });

        // TODO
        // pointer removal
        // lookto clicked hotspot (animatebeforeleave)
      }
    },
    changeFullscreen() {
      this.isFullscreen = screenfull.isFullscreen;
      nextTick(() => {
        window.dispatchEvent(new Event("resize"));
      });
    },
    async toggleFullScreen() {
      debug("toggle fullscreen", screenfull.isEnabled, screenfull.isFullscreen);
      if (!screenfull.isFullscreen) {
        window.busSocket.sendEvent("FULLSCREEN");
        await screenfull.request(document.documentElement, {
          navigationUI: "hide",
        });
        screenfull.on("change", this.changeFullscreen);
        if (window.screen.orientation?.lock)
          window.screen.orientation.lock("landscape");
      } else {
        window.busSocket.sendEvent("EXIT_FULLSCREEN");
        await screenfull.exit();
      }
    },
  },
});

