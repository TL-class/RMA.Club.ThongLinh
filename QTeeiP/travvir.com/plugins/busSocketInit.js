import BusSocket from "~/socket/bus.js";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const busSocket = new BusSocket();
    window.busSocket = busSocket;

    // Inject busSocket into nuxtApp
    return {
      provide: {
        busSocket,
      },
    };
  }
});
