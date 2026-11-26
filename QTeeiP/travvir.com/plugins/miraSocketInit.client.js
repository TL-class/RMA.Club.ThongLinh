import MiraSocket from "~/socket/mira.js";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const miraSocket = new MiraSocket();
    // Inject miraSocket into nuxtApp
    return {
      provide: {
        miraSocket,
      },
    };
  }
});
