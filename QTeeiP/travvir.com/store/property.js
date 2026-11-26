import logger from "debug";
import { useRuntimeConfig } from "#app";
const debug = logger("travvir:debut-nuxt:store:property");
export const usePropertyStore = defineStore("property", {
  state: () => {
    return {
      map: null,
      google: null,
      property: [],
      hoverPlace: null,
      allMapMarkers: [],
      propertyInfo: null,
      clickedPlace: null,
      leadSubmited: false,
      selectedFile: null,
      isInformationOverlayModalOpen: false,
      associatedFiles: [],
      selectedLevels: null,
      selectedMapCategory: null,
      resolutionCategories: [
        { value: 4, name: "Ultra", subName: "16K", subscription: false },
        { value: 3, name: "High", subName: "8K", subscription: false },
        { value: 2, name: "Standard", subName: "4K", subscription: false },
        { value: 1, name: "Basic", subName: "2K", subscription: false },
      ],
      mapCategories: [
        {
          value: "restaurant",
          name: "Restaurants",
        },
        {
          value: "shopping_mall",
          name: "Malls",
        },
        {
          value: "subway_station",
          name: "Metro",
        },
        {
          value: "supermarket",
          name: "Market",
        },
        {
          value: "hospital",
          name: "Hospital",
        },
        {
          value: "train_station",
          name: "Railway Stations",
        },
        {
          value: "bus_station",
          name: "Bus Stop",
        },
        {
          value: "airport",
          name: "Airport",
        },
        {
          value: "school",
          name: "School",
        },
        {
          value: "bank",
          name: "Banks",
        },
        {
          value: "place",
          name: "Places",
        },
      ],
    };
  },
  getters: {
    propertyOrigin() {
      if (
        this.propertyInfo.location.latitude &&
        this.propertyInfo.location.longitude
      ) {
        return {
          lat: this.propertyInfo.location.latitude,
          lng: this.propertyInfo.location.longitude,
        };
      }
      return null;
    },
    destinationPlace() {
      if (this.selectedMapPlaces.length && !this.clickedPlace)
        return this.selectedMapPlaces[0];
      return this.selectedMapPlaces.find((p) => p.placeId == this.clickedPlace);
    },
    selectedMapPlaces() {
      return this.propertyInfo.googlePlaces?.filter((place) =>
        place.types.includes(this.selectedMapCategory?.value),
      );
    },
    isPlanExpired() {
      if (!this.propertyInfo || !this.propertyInfo.config) return false;
      return this.propertyInfo?.config.planExpiredBadge;
    },
    levelsLimit() {
      if (!this.propertyInfo || !this.propertyInfo.config) return null;
      return this.propertyInfo?.config.maxSceneLevels;
    },
    isSceneAccessible() {
      return (index) => !this.isPlanExpired || index < 3;
    },
    miraConfig() {
      if (!this.propertyInfo || !this.propertyInfo.config) return null;
      return this.propertyInfo?.config.mira;
    },
    isBasicMiraConfig() {
      const config = this.miraConfig;
      return config === "basic";
    },
    isExpiredMiraConfig() {
      const config = this.miraConfig;
      return config === "expired";
    },
    isEmbedActive() {
      if (!this.propertyInfo || !this.propertyInfo.config) return false;
      return this.propertyInfo?.config.embed;
    },
    isConferenceActive() {
      if (!this.propertyInfo || !this.propertyInfo.config) return false;
      return this.propertyInfo?.config.conference;
    },
    ensureConferenceTabInActive: (state) => (route) => {
      return (
        !state.isConferenceActive && route.name === "conference-conferenceKey"
      );
    },
    ensureEmbedTabInActive: (state) => (route) => {
      return !state.isEmbedActive && route.name === "embed-propertyId";
    },
    getLevelsLimit() {
      if (this.selectedLevels) return this.selectedLevels;
      else return this.levelsLimit;
    },
  },
  actions: {
    resetPropertyState() {
      this.propertyInfo = null;
      this.selectedLevels = null;
      this.associatedFiles = [];
      this.clickedPlace = null;
      this.leadSubmited = false;
      this.selectedMapCategory = null;
    },
    setSelectedFile(file) {
      this.selectedFile = file;
    },
    setProperties(value) {
      this.property = value;
    },
    setPlaceIsReady(value) {
      this.placeIsReady = value;
    },
    getReady() {
      return new Promise((resolve) => setTimeout(() => resolve(), 4000));
    },
    setLeadSubmited(value) {
      this.leadSubmited = value;
    },
    async getProperty(customId, { softFail = false } = {}) {
      if (!customId) {
        if (softFail) {
          this.propertyInfo = null;
          return { notFound: true };
        }
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }

      if (this.propertyInfo && this.propertyInfo.id === customId) {
        debug("Property data already fetched, returning cached data.");
        return { data: this.propertyInfo };
      }

      try {
        const config = useRuntimeConfig();
        const data = await $fetch(
          `${config.public.NUXT_API_URL}/place/${customId}`,
        );
        this.propertyInfo = data.data || {}; // scene data are come this variable after hit the api
        return data;
      } catch (err) {
        if (err?.status === 404 || err?.statusCode === 404) {
          if (softFail) {
            this.propertyInfo = null;
            return { notFound: true };
          }
          throw createError({
            statusCode: 404,
            statusMessage: "Property not found",
          });
        }
        if (softFail) {
          this.propertyInfo = null;
          return { error: true };
        }
        throw createError({
          statusCode: 500,
          statusMessage: "Server Error",
        });
      }
    },
    async getPopertyAssociatedFiles(customId) {
      try {
        if (!customId)
          return debug("Cannot fetch property: customId is undefined");
        if (this.associatedFiles.length) return;
        const config = useRuntimeConfig();
        const data = await $fetch(
          `${config.public.NUXT_API_URL}/place/${customId}/files`,
        );
        if (data && data.data) {
          this.associatedFiles = data.data;
          return data.data;
        }
        return [];
      } catch (err) {
        if (err?.status === 404 || err?.statusCode === 404) {
          throw createError({
            statusCode: 404,
            statusMessage: "Property not found",
          });
        }
        throw createError({
          statusCode: 500,
          statusMessage: "Server Error",
        });
      }
    },
    setMapCategory(category) {
      this.selectedMapCategory = category;
    },
    async saveLeadForm({ name, mobile, email, propertyId }) {
      try {
        const config = useRuntimeConfig();
        let response = await $fetch(`${config.public.NUXT_API_URL}/lead`, {
          method: "POST",
          body: {
            name,
            mobile,
            email,
            propertyId,
          },
          onResponseError({ request, response, options }) {
            debug(request, response, options, "save lead form");
            return { response: null, error: response._data };
          },
        });
        return { response, error: null };
      } catch (error) {
        debug(error, "Error saving lead form:");
        return { response: null, error };
      }
    },
  },
});
