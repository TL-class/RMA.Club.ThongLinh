import logger from "debug";
import { io } from "socket.io-client";
import { useRandomString } from "~/composables/useRandomString";
const { generateRandomString } = useRandomString();
const debug = logger("travvir:debut-nuxt:socket:bus");

class BusSocket {
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

  open() {
    this.pageviewId = generateRandomString(8);
    const config = useRuntimeConfig();

    debug("connection for propertyId", this.deviceId);
    if (this._isConnected && this.socket) return this.socket;

    this.socket = io(`${config.public.NUXT_SOCKET_SERVER}/bus`, {
      forceNew: true,
      transports: ["websocket", "polling"],
      path: config.public.NUXT_SOCKET_PATH,
      query: {
        token: this.token,
        deviceId: this.deviceId,
        platform: this.platform,
      },
    });

    this.socket.on("connect", () => {
      debug(this.socket.id, "bus socket connected");
      this._isConnected = true;
    });

    return this.socket;
  }

  sendView(customId, propertyName, metadata = {}) {
    this.propertyId = customId;
    const refererCookie = useCookie("visitor_referer");
    const referer = refererCookie.value || "";
    this.socket.emit("PAGEVIEW", {
      pageviewId: this.pageviewId,
      propertyId: this.propertyId,
      propertyName: propertyName,
      referer: referer,
      metadata: metadata,
    });

    if (refererCookie.value) {
      refererCookie.value = null;
    }
  }

  sendEvent(eventPayload) {
    debug("sending event", eventPayload);
    this.socket.emit("EVENT", {
      version: "3",
      data: eventPayload,
      pageviewId: this.pageviewId,
    });
  }
  getTour(customId, password, token) {
    debug("getting tour", customId, this.pageviewId);
    const payload = {
      propertyId: customId,
      pageviewId: this.pageviewId,
    };
    if (password) payload.password = password;
    if (token) payload.token = token;
    this.socket.emit("GET_TOUR", payload);
  }
}

export default BusSocket;
