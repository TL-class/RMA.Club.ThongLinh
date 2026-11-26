import logger from "debug";
import { defineStore } from "pinia";
import { useViewerStore } from "./viewer";
import { usePropertyStore } from "./property";
const debug = logger("travvir:debut-nuxt:store:scene");

export const useSceneStore = defineStore("scene", {
  state: () => {
    return {
      sceneList: [],
      noSceneFound: false,
    };
  },
  getters: {
    getProcessedSceneList() {
      return () => {
        const propertyStore = usePropertyStore();
        const maxActiveScenes = 3;
        const hasLimitedAccess = propertyStore.isPlanExpired;
        let globalActiveCount = 0;

        return this.sceneList.map((el, index) => {
          const isAccessible = propertyStore.isSceneAccessible(index);

          if (el.sceneIds?.length) {
            // For items with sceneIds, limit to 3 active scenes per group
            let itemActiveCount = 0;
            const processedScenes = el.sceneIds.map((scene) => {
              const shouldBeActive =
                isAccessible &&
                (!hasLimitedAccess || itemActiveCount < maxActiveScenes);
              if (shouldBeActive && hasLimitedAccess) {
                itemActiveCount++;
                globalActiveCount++;
              }
              return {
                ...scene,
                isActive: shouldBeActive,
              };
            });
            return {
              ...el,
              isAccessible,
              processedScenes,
            };
          } else {
            // For normal scenes, only activate if within global limit
            let shouldBeActive =
              isAccessible &&
              (!hasLimitedAccess || globalActiveCount < maxActiveScenes);
            if (shouldBeActive && hasLimitedAccess) {
              globalActiveCount++;
            }
            return {
              ...el,
              isAccessible,
              isActive: shouldBeActive,
              processedScenes: null,
            };
          }
        });
      };
    },
    getDropdownScene() {
      debug("getDropdownScene", this.sceneList);
      const processedList = this.getProcessedSceneList();

      return processedList.map((el) => {
        if (el.processedScenes) {
          return {
            label: el.title,
            dataId: el._id,
            isActive: el.isAccessible,
            items: el.processedScenes.map((scene) => ({
              label: scene.name,
              dataId: scene.sceneId,
              isActive: scene.isActive,
            })),
          };
        } else {
          return {
            label: el.sceneId.name,
            dataId: el.sceneId.sceneId,
            isActive: el.isActive,
            items: [],
          };
        }
      });
    },
    getScene() {
      const processedList = this.getProcessedSceneList();
      const sceneData = [];

      processedList.forEach((el) => {
        if (el.processedScenes) {
          el.processedScenes.forEach((scene) => {
            sceneData.push({
              id: scene.sceneId,
              ...scene,
            });
          });
        } else {
          sceneData.push({
            id: el.sceneId.sceneId,
            ...el.sceneId,
            isActive: el.isActive,
          });
        }
      });
      return sceneData;
    },
    getAutoTourScenes() {
      return this.getScene.filter(
        (scene, i) => i != 0 && scene.autoTour && scene.active !== false,
      );
    },
  },
  actions: {
    setSceneList(scene) {
      const viewerStore = useViewerStore();
      debug(scene);
      if (this.sceneList.length) {
        this.sceneList = [];
      }
      if (!scene.length) {
        this.noSceneFound = true;
        viewerStore.marzipanoReady = true;
        return;
      }

      this.sceneList = scene;
    },
    getSceneDataById(id) {
      debug("getSceneDataById", id);
      return this.getScene.find((scene) => scene.id === id);
    },

    async getSceneUrl(customId, sceneId) {
      try {
        const config = useRuntimeConfig();
        if (!customId || !sceneId) return null;
        const data = await $fetch(
          `${config.public.NUXT_API_URL}/place/${customId}/scene/url`,
          {
            method: "POST",
            body: { sceneId },
          },
        );
        if (data && data.data) return data.data.url;
        return null;
      } catch (error) {
        debug("Fetching signed URL for scene:", { customId, sceneId, error });
        if (error?.status === 404 || error?.statusCode === 404) {
          throw createError({
            statusCode: 404,
            statusMessage: "Property not found",
          });
        }
      }
    },
  },
});

