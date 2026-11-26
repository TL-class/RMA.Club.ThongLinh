import logger from "debug";
import { io } from "socket.io-client";
import { useRandomString } from "~/composables/useRandomString";
const debug = logger("travvir:debut-nuxt:socket:call");
const { generateRandomString } = useRandomString();

class CallSocket {
  constructor() {
    const hasStorage = typeof window !== "undefined" && window.localStorage;
    this.deviceId =
      hasStorage && localStorage.getItem("deviceId")
        ? localStorage.getItem("deviceId")
        : hasStorage
          ? (localStorage.setItem("deviceId", generateRandomString(8)),
            generateRandomString(8))
          : generateRandomString(8);

    this.socket = null;
    this._isConnected = false;
  }

  open(name, propertyId) {
    if (this._isConnected && this.socket) return this.socket;
    const config = useRuntimeConfig();
    debug("call socket connecting", name, this.deviceId, propertyId);
    this.socket = io(`${config.public.NUXT_SOCKET_SERVER}/call`, {
      forceNew: true,
      transports: ["websocket", "polling"],
      path: config.public.NUXT_SOCKET_PATH,
      query: { name, deviceId: this.deviceId, propertyId },
    });

    this.socket.on("connect", () => {
      debug(this.deviceId, "call socket connected");
      this._isConnected = true;
    });
    this.socket.on("disconnect", () => {
      debug("call socket disconnected");
      this._isConnected = false;
    });
    this.socket.on("error", (err) => {
      debug("call socket error", err);
    });
    return this.socket;
  }

  sendCursorPosition(cordinates) {
    this.socket.emit("CUR_POS", cordinates);
  }

  sendSceneChange(sceneId) {
    this.socket.emit("SCENE_CHANGE", sceneId);
  }

  sendViewSync({ yaw, pitch, fov, sceneId }) {
    this.socket?.emit("VIEW_SYNC", { yaw, pitch, fov, sceneId });
  }

  getMembers() {
    this.socket?.emit("GET_MEMBERS");
  }

  setPresenter(userId) {
    this.socket?.emit("SET_PRESENTER", { userId });
  }

  leave() {
    this.socket?.emit("LEAVE_CONFERENCE");
  }

  on(event, cb) {
    this.socket?.on(event, cb);
  }

  off(event, cb) {
    this.socket?.off(event, cb);
  }
}

export default CallSocket;
