import Marzipano from "marzipano";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      marzipano: Marzipano,
    },
  };
});
