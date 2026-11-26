import logger from "debug";
import { io } from "socket.io-client";
import { useRandomString } from "~/composables/useRandomString";

const debug = logger("travvir:debut-nuxt:socket:mira");
const { generateRandomString } = useRandomString();

class MiraSocket {
  constructor() {
    this.platform = "web";
    //   if (isAndroidApp()) this.platform = 'android'
    //   else if (isIosApp()) this.platform = 'ios'

    // Check if window and localStorage are available (for SSR compatibility)
    const hasStorage = typeof window !== "undefined" && window.localStorage;

    this.token =
      hasStorage && localStorage.getItem("token")
        ? localStorage.getItem("token")
        : "";

    this.deviceId =
      hasStorage && localStorage.getItem("deviceId")
        ? localStorage.getItem("deviceId")
        : hasStorage
        ? (localStorage.setItem("deviceId", generateRandomString(8)),
          generateRandomString(8))
        : generateRandomString(8);

    this.propertyId = null;
    this.pageviewId = null;

    this.socket = null;
    this._isConnected = false;
  }
  open(propertyId) {
    const config = useRuntimeConfig();
    const { $busSocket } = useNuxtApp();
    this.pageviewId = $busSocket.pageviewId;
    debug("connection for propertyId", this.deviceId, this.pageviewId);
    if (this._isConnected && this.socket) return this.socket;
    this.propertyId = propertyId;
    this.socket = io(`${config.public.NUXT_SOCKET_SERVER}/mira`, {
      forceNew: true,
      transports: ["websocket", "polling"],
      path: config.public.NUXT_SOCKET_PATH,
      query: {
        token: this.token,
        deviceId: this.deviceId,
        propertyId: this.propertyId,
        platform: this.platform,
        pageviewId: this.pageviewId,
      },
    });

    this.socket.on("connect", () => {
      debug(this.socket.id, "mira socket connected");
      this._isConnected = true;
    });
    debug(this.socket, "mira_socket_connected");
    return this.socket;
  }
  close() {
    debug("mira socket closed");
    this.socket.close();
    this._isConnected = false;
  }
  ask(text, inputMode = "chat") {
    debug("ASR ask => ", text, inputMode);
    this.socket.emit("speechRecognitionText", { text, mode: inputMode });
  }
  followUp() {
    this.socket.emit("follow-up");
  }
  reply(question, answer) {
    this.socket.emit("QUESTION_REPLY", {
      question,
      reply: answer,
    });
  }
  processAudio(payload) {
    this.socket.emit("STT_AUDIO_DATA", payload);
  }
  endAudio(reason) {
    debug("ASR end due to => ", reason);
    this.socket.emit("STT_AUDIO_END");
  }
  getVoice(text) {
    debug("ASR get voice => ", text.text, text.lang);
    this.socket.emit("GET_VOICE", {
      propertyId: this.propertyId,
      pageviewId: this.pageviewId,
      text: text.text,
      lang: text.lang,
    });
  }
  stopProcessingAudio() {}
}

export default MiraSocket;
