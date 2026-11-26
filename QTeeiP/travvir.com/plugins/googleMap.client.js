import { Loader } from "@googlemaps/js-api-loader";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      googleMap: Loader,
    },
  };
});
