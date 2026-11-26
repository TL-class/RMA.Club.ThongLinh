<template>
  <div class="tour">
    <div id="pano" />
    <ArrowControls
      v-if="viewerStore.isReady"
      :switching-scene="switchingScene"
      @switch-scene="handleSwitchScene"
    />
    <Loader v-if="!viewerStore.marzipanoReady" />
  </div>
</template>

<script setup>
import logger from "debug";
import useScene from "./scene/index.js";
import { useSceneStore } from "~/store/scene";
import { useViewerStore } from "~/store/viewer";
import { usePropertyStore } from "~/store/property";

// Replace debug function
const debug = logger("travvir:debut-nuxt:viewer:index");

// Props
const props = defineProps({
  ready: Boolean,
  inFocus: {
    type: Boolean,
    default: false,
  },
});
const isPortrait = inject("isPortrait");
const viewerScene = new useScene();
viewerScene.setInFocus(props.inFocus);
// Emits
const emit = defineEmits(["viewerReady"]);

// Store imports
const propertyStore = usePropertyStore();
const viewerStore = useViewerStore();
const sceneStore = useSceneStore();

// Reactive state
const viewerInterval = ref(null);
const switchingScene = ref(false);
const heartbeatInterval = ref(null);

// Route for query parameters
const route = useRoute();

// Computed properties
const scenesCount = computed(() => sceneStore.getScene.length);
const tourScenes = computed(() => sceneStore.getScene);

// Methods
const init = async () => {
  const { $marzipano } = useNuxtApp();
  try {
    debug("initializing scene");
    let panoElement = window.document.querySelector("#pano");
    let viewerOpts = {
      controls: {
        // scrollZoom: false
      },
    };
    debug(panoElement);

    // Initialize viewer
    viewerStore.viewer = new $marzipano.Viewer(panoElement, viewerOpts);

    viewerStore.viewer.controls().enableMethod("leftArrowKey");
    viewerStore.viewer.controls().enableMethod("rightArrowKey");
    viewerStore.viewer.controls().enableMethodGroup("plusMinusKeys");

    viewerInterval.value = setInterval(() => {
      // no checks if in between scene switching
      if (switchingScene.value) return;
      if (!viewerStore.currentScene) return;
      if (!viewerStore.viewer.view()) return;

      // check for closest connection
      let distances = viewerStore.currentScene._connections.map((el) => {
        let position = viewerStore.viewer
          .view()
          .coordinatesToScreen(el.connection.position());
        if (position) {
          let mid = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          };
          let distance = getLinearDistance(mid, position);
          return distance;
        } else {
          return 10000;
        }
      });

      // active shortest distance
      let lowest = Math.min.apply(null, distances);
      let index = distances.indexOf(lowest);
      viewerStore.activeHotspot = index;
      // viewerStore.currentScene._connections.forEach((el, i) => {
      //   if (
      //     el &&
      //     el.component &&
      //     el.component.component &&
      //     el.component.component.data
      //   ) {
      //     const newData = {
      //       ...el.component.component.data,
      //       active: i == index,
      //     };

      //     el.component.component.data = newData;
      //   }
      // });
    }, 100);

    emit("viewerReady");
    debug("viewer ready");
    debug("init complete");
  } catch (err) {
    debug(err, "init failed");
  }
};

const startSceneLoading = async () => {
  debug("start scene loading");
  if (!viewerStore.currentScene) {
    let filterScene = tourScenes.value[0];
    const sQuery = route.query?.s || route.query?.S;

    if (sQuery) {
      const [tourIndexStr, sceneIndexStr] = sQuery.split(".");
      const tourIndex = parseInt(tourIndexStr, 10) - 1;

      if (
        !isNaN(tourIndex) &&
        tourIndex >= 0 &&
        tourIndex < sceneStore.sceneList.length
      ) {
        let groupSequence = sceneStore.sceneList.filter(
          (s) => s.kind === "GroupSequence",
        );
        let sceneSequence = sceneStore.sceneList.filter(
          (s) => s.kind === "SceneSequence",
        );
        let sceneData;
        if (sceneIndexStr && groupSequence.length) {
          const sceneIndex = parseInt(sceneIndexStr, 10) - 1;
          let tour = groupSequence[tourIndex];
          if (tour.sceneIds.length && sceneIndex < tour.sceneIds.length) {
            sceneData = tour.sceneIds[sceneIndex];
          } else {
            sceneData = tour.sceneIds[0];
          }
        } else {
          let tour = sceneSequence[tourIndex];
          if (tour?.sceneId) {
            sceneData = tour.sceneId;
          }
        }
        if (sceneData) {
          filterScene = {
            id: sceneData.sceneId,
            ...sceneData,
          };
        }
      }
    }
    propertyStore.selectedLevels = propertyStore.getLevelsLimit;
    let scene = await viewerScene.createScene(filterScene);
    debug("first scene created", scene);
    viewerStore.addNewScene(scene.data.id, scene);
    switchingScene.value = true;
    await viewerStore.setCurrentScene(scene.data.id, null, true);
    debug("first scene set", viewerStore.currentScene);
    switchingScene.value = false;
  }
  await loadPriorityQueue();
  loadRemainingScenes();
};

const loadPriorityQueue = async () => {
  // load autotour scenes
  let autoTourScenes = sceneStore.getAutoTourScenes;
  await runLoadingQueue(autoTourScenes);
};

const loadRemainingScenes = async () => {
  let chunks = remainingSceneChunks(2);
  debug("remaining chunks => ", chunks);
  for (let i = 0; i < chunks.length; i++) {
    await runLoadingQueue(chunks[i]);
  }
};

const runLoadingQueue = async (scenes) => {
  for (let i = 0; i < scenes.length; i++) {
    try {
      if (viewerStore.interruptSignal) {
        debug(
          "interrupt signal found. Let's create scene",
          viewerStore.interruptSignal.id,
        );
        let interruptScene = sceneStore.getSceneDataById(
          viewerStore.interruptSignal.id,
        );
        let createdScene = await viewerScene.createScene(interruptScene);
        debug("interrupt scene created", interruptScene, createdScene);
        viewerStore.addNewScene(createdScene.data.id, createdScene);
        viewerStore.setCurrentScene(
          createdScene.data.id,
          viewerStore.interruptSignal.hotspot,
        );
        viewerStore.interruptSignal = null;
      }
      debug("creating normal scene", scenes[i]);
      let createdScene = await viewerScene.createScene(scenes[i]);
      viewerStore.addNewScene(createdScene.data.id, createdScene);
      debug("normal scene created", createdScene);
    } catch (err) {
      debug("scene creation failed", err);
    }
  }
};

const remainingSceneChunks = (size) => {
  let xs = tourScenes.value?.filter((s) => !viewerStore.scenes[s.id]);
  return xs
    .map((_, i) => (i % size === 0 ? xs.slice(i, i + size) : null))
    .filter(Boolean);
};

const getLinearDistance = (start, end) => {
  return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
};

const heartbeat = () => {
  if (viewerStore.viewer && viewerStore.isReady) {
    debug("heartbeat", viewerStore.currentScene);
    let currentView = viewerStore.viewer.view();
    let beat = {
      name: "HEARTBEAT",
      yaw: currentView?._yaw,
      pitch: currentView?._pitch,
      roll: currentView?._roll,
      fov: currentView?._fov,
      width: currentView?._width,
      height: currentView?._height,
      sceneId: viewerStore.currentScene?.data?.sceneId || "123",
      sceneName: viewerStore.currentScene?.data?.name,
      propertyId: propertyStore.propertyId,
      conferenceKey: propertyStore.conferenceKey,
      pageviewId: propertyStore.pvid,
    };
    window.busSocket.sendEvent(beat);
  }
};

const handleSwitchScene = async (hotspot) => {
  const { $callSocket } = useNuxtApp();
  if (
    viewerStore.isConferenceViewer ||
    propertyStore.ensureEmbedTabInActive(route) ||
    propertyStore.ensureConferenceTabInActive(route)
  )
    return;
  switchingScene.value = true;
  viewerStore.isFirstScene = false;
  await viewerStore.setCurrentScene(hotspot.target.id, hotspot);
  if (viewerStore.isConferencePresenter) {
    $callSocket.sendSceneChange(hotspot.target.id);
    window.busSocket.sendEvent({
      name: "CONFERENCE_SCENE_CHANGE",
      sceneId: hotspot.target.id,
    });
  }
  switchingScene.value = false;
};

// Lifecycle hooks
onMounted(async () => {
  await init();
  if (scenesCount.value > 0) startSceneLoading();

  window.addEventListener("orientationchange", () => {
    if (viewerStore.currentScene) {
      const view = viewerStore.viewer.view();
      let cords = { yaw: view.yaw(), pitch: view.pitch() };
      if (!isPortrait.value) cords.fov = (90 * Math.PI) / 180;
      else cords.fov = (120 * Math.PI) / 180;
      viewerStore.viewer.lookTo(cords, { transitionDuration: 10 });
    }
  });

  heartbeatInterval.value = setInterval(heartbeat, 20000);
});

onBeforeUnmount(() => {
  clearInterval(viewerInterval.value);
  clearInterval(heartbeatInterval.value);
  viewerStore.resetCurrentScene();
});

// Watchers
watch(scenesCount, () => {
  if (!viewerStore.currentScene) startSceneLoading();
});

watch(
  () => props.inFocus,
  (newValue) => {
    if (!viewerStore.viewer) return;
    if (newValue) {
      viewerStore.viewer.controls().enableMethod("leftArrowKey");
      viewerStore.viewer.controls().enableMethod("rightArrowKey");
      viewerStore.viewer.controls().enableMethodGroup("plusMinusKeys");
    } else {
      viewerStore.viewer.controls().disableMethod("leftArrowKey");
      viewerStore.viewer.controls().disableMethod("rightArrowKey");
      viewerStore.viewer.controls().disableMethodGroup("plusMinusKeys");
    }
  },
);
</script>
<style scoped>
.tour {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#pano {
  position: absolute;
  top: 0;
  left: 0%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
}
</style>

