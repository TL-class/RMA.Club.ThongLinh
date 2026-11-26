import Aos from "aos";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      Aos: Aos,
    },
  };
});
