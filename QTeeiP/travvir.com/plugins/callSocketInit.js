import CallSocket from "~/socket/call.js";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const callSocket = new CallSocket();
    window.callSocket = callSocket;
    return {
      provide: {
        callSocket,
      },
    };
  }
});

