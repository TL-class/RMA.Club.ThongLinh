import browser from "debug";
export default defineNuxtPlugin((_nuxtApp) => {
  if (import.meta.client) {
    // browser.enable("travvir:*");
    return {
      provide: {
        debug: (namespace) => browser(namespace),
      },
    };
  }
});
