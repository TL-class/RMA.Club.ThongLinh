import logger from "debug";
import { inject, ref } from "vue";
import { useRoute } from "vue-router";
import {
  createConnectionsForScene,
  createInfoSpotsForScene,
  createPitchCoverBadge,
} from "./HotspotManager";
import textureLoader from "./TextuteLoader";
import { useViewerStore } from "~/store/viewer";
import { useSceneStore } from "~/store/scene";
import { usePropertyStore } from "~/store/property";
const debug = logger("travvir:debut-nuxt:viewer:scene:index");
class useScene {
  constructor() {
    this.scenes = {};
    this.memberCount = 0;
    this.inFocus = false;
    this.minFov = ref(15);
    this.autofollow = true;
    this.maxFov = ref(180);
    this.route = useRoute();
    this.textureLoader = null;
    this.defaultFov = ref(90);
    this.autoFollowLocalState = true;
    this.timerToSetAutoFollowOn = null;
    this.viewerStore = useViewerStore();
    this.propertyStore = usePropertyStore();
    this.loader = new textureLoader(this.propertyStore.propertyInfo.imagePath);
    this.isPortrait = inject("isPortrait");
  }
  setInFocus(value) {
    this.inFocus = value;
  }

  createScene(data, position, priority = false) {
    const {
      $isAppleChrome,
      $isAppleWebview,
      $isIPhone,
      $isMacSafari,
      $marzipano,
    } = useNuxtApp();
    return new Promise((resolve, reject) => {
      try {
        if (!data) return;
        if (this.scenes[data.id])
          return resolve({ ...this.scenes[data.id], position });
        debug("creating scene ", this.scenes, data.id, data.name);

        // Safari workaround for rotated preview images
        let sequence = "bdflru";
        if ($isAppleChrome || $isAppleWebview || $isMacSafari || $isIPhone) {
          sequence = "urlfdb";
        }
        debug("sequence", sequence);
        let levels;
        let levelsLimit = this.propertyStore.getLevelsLimit;
        if (levelsLimit && data.levels.length) {
          debug("Applying levels limit:", levelsLimit);
          levels = data.levels.slice(0, levelsLimit + 1); // +1 because levels are 0 indexed
        } else {
          levels = data.levels;
        }
        debug("Using levels:", levels);
        let geometry = new $marzipano.CubeGeometry(levels);
        let imagePattern = `${this.propertyStore.propertyInfo.imagePath}/${data.id}/{z}/{f}/{y}/{x}.jpg`; // z -> zoom, f -> face, y,x -> address of images tile in 2d array
        let source = new $marzipano.ImageUrlSource.fromString(imagePattern, {
          cubeMapPreviewUrl: `${this.propertyStore.propertyInfo.imagePath}/${data.id}/preview.jpg`,
          cubeMapPreviewFaceOrder: sequence,
        });
        if (data.autoTour)
          this.loader.loadImages(imagePattern, priority, levelsLimit);
        let minFov = this.minFov.value;
        if (levels && levels.length <= 4) minFov = 75;
        // let ulimit = (this.maxFov.value * Math.PI) / 180;
        let llimit = (minFov * Math.PI) / 180;
        let pitchLimitUp = data.upperLimit || 0;
        let pitchLimitDown = data.lowerLimit || 0;

        // Create proper limiter for the view
        let limiter = $marzipano.util.compose(
          $marzipano.RectilinearView.limit.vfov(llimit, 2.0),
          $marzipano.RectilinearView.limit.pitch(
            -Math.PI / 2 + pitchLimitUp,
            Math.PI / 2 + pitchLimitDown,
          ),
        );
        // Calculate initial FOV
        let fov = this.defaultFov.value;
        if (this.isPortrait.value) {
          fov = 105;
        }
        // Create the view with the limiter
        let view = new $marzipano.RectilinearView(
          {
            yaw: 0,
            pitch: 0,
            fov: (fov * Math.PI) / 180,
          },
          limiter,
        );

        let scene = this.viewerStore.viewer.createScene({
          source,
          geometry,
          view: view,
          pinFirstLevel: true,
        });
        let pitchCoverBadge;
        // create connections
        let connections;
        if (import.meta.client) {
          const activeLinkHotspots =
            data.linkHotspots?.filter((hs) => hs.active !== false) || [];
          let activeHotspots = activeLinkHotspots.map((hs) => {
            const scene = useSceneStore().getScene.find(
              (scene) => scene.sceneId === hs.target.id,
            );

            if (scene) {
              return {
                ...hs,
                active: scene.isActive,
              };
            }
            return hs;
          });

          let filteredActiveHotspots = activeHotspots.filter((hs) => hs.active);
          connections = createConnectionsForScene(
            scene,
            filteredActiveHotspots,
            this.inFocus,
          );
          if (
            this.propertyStore.propertyInfo?.owner?.nadirConfig?.active &&
            this.route?.name !== "embed-do-propertyId"
          ) {
            pitchCoverBadge = createPitchCoverBadge(
              scene,
              this.inFocus,
              data.initialViewParameters,
            );
          }
        }

        // create infospots
        let spots;
        if (import.meta.client) {
          spots = createInfoSpotsForScene(scene, data.infoHotspots);
        }

        let layer = scene.layer();
        let ts = layer.textureStore();
        let sceneCounter = 0;
        ts.addEventListener("textureLoad", () => {
          sceneCounter++;
          if (sceneCounter == 6) {
            // to encounter just the preview image cube
            debug("loaded => ", data.id);
            this.loader.loadSceneWithConnected(data, levelsLimit);
            resolve({
              data,
              scene,
              pitchCoverBadge,
              connections,
              position,
              spots,
            });
          }
        });
      } catch (error) {
        debug(error);
        reject(error);
      }
    });
  }
}
export default useScene;
