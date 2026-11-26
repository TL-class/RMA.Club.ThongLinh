import logger from "debug";
import { createVNode, render } from "vue";
import Spot from "./../components/Spot.vue";
import { useViewerStore } from "~/store/viewer";
import { useSceneStore } from "../../../store/scene";
import Connection from "./../components/Connection.vue";
import InfoHotspot from "../components/InfoHotspot.vue";
import ClientImage from "../components/ClientImage.vue";
import CursorConnection from "../components/CursorConnection.vue";
import Connection2 from "./../components/ConnectionDineout.vue";

const debug = logger("travvir:debut-nuxt:viewer:scene:HotspotManager");

export const createConnectionComponent = (
  hotspot,
  inFocus = false,
  index = 0,
  connectionComponent,
) => {
  const route = useRoute();
  const { $device } = useNuxtApp();
  const config = useRuntimeConfig();
  const sceneStore = useSceneStore();
  const viewerStore = useViewerStore();
  debug("creating connection component for hotspot", hotspot);
  let instance = createVNode(connectionComponent, {
    data: hotspot,
    scenes: sceneStore.getScene,
    readyState: route.name === "embed-propertyId",
    changeListener: async ({ target, position, keyboardEvent }) => {
      if (!inFocus) return;
      await sceneChange(target, hotspot, position, keyboardEvent, inFocus);
    },
    isMobile: $device.isMobile,
    isPortrait: viewerStore.isPortrait,
    config: config,
    index: index,
    currentRoute: route,
  });
  render(instance, document.createElement("div"));
  return instance;
};

async function sceneChange(target, hotspot) {
  const viewerStore = useViewerStore();
  const { $callSocket } = useNuxtApp();
  if (viewerStore.isConferenceViewer) return;
  try {
    if (viewerStore.switchingScene) return;
    viewerStore.switchingScene = true;
    viewerStore.isFirstScene = false;
    debug("switching scene true", target, hotspot);
    await viewerStore.setCurrentScene(target, hotspot, false, "Hotspot");
    debug("finally switching false");
    viewerStore.switchingScene = false;
    if (viewerStore.isConferencePresenter) {
      $callSocket.sendSceneChange(target);
      window.busSocket.sendEvent({
        name: "CONFERENCE_SCENE_CHANGE",
        sceneId: target,
      });
    }
  } catch (e) {
    debug("switching scene failed", e);
  }
}

const createInfoHotspotComponent = (hotspot) => {
  const config = useRuntimeConfig();

  let instance = createVNode(InfoHotspot, {
    info: hotspot,
    clickListener: async ({ target, position, keyboardEvent }) => {
      debug("spot clicked", target, position, keyboardEvent);
    },
    config: config,
  });
  render(instance, document.createElement("div"));
  return instance;
};

const createRegularSpotComponent = (hotspot) => {
  const config = useRuntimeConfig();

  let instance = createVNode(Spot, {
    info: hotspot,
    clickListener: async ({ target, position, keyboardEvent }) => {
      debug("spot clicked", target, position, keyboardEvent);
    },
    config: config,
  });
  render(instance, document.createElement("div"));
  return instance;
};

export const createConnectionsForScene = (scene, hotspots, inFocus) => {
  const route = useRoute();
  let connectionComponent = Connection;
  if (route?.name === "embed-do-propertyId") connectionComponent = Connection2;
  return hotspots
    ?.filter((hs) => hs.active !== false)
    .map((hotspot, index) => {
      let component = createConnectionComponent(
        hotspot,
        inFocus,
        index,
        connectionComponent,
      );
      let connection = scene.hotspotContainer().createHotspot(component.el, {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch,
      });
      return { component, connection, data: hotspot };
    });
};
export const createPitchCoverBadge = (
  scene,
  inFocus,
  initialViewParameters = {},
) => {
  const initialYaw = initialViewParameters.yaw || 0;

  let component = createConnectionComponent(
    { type: "pitch-cover" },
    inFocus,
    0,
    ClientImage,
  );
  let connection = scene.hotspotContainer().createHotspot(
    component.el,
    {
      yaw: initialYaw,
      pitch: Math.PI / 2,
    },
    {
      perspective: {
        radius: 700, // for better visual Effect
        extraTransforms: "",
      },
    },
  );
  return { component, connection };
};
const createCursorConnectionComponent = (name, color, isMe, userId) => {
  const instance = createVNode(CursorConnection, {
    name,
    color,
    isMe,
    userId,
  });
  render(instance, document.createElement("div"));
  return instance;
};

export const syncCursorHotspots = () => {
  const { $callSocket } = useNuxtApp();
  const viewerStore = useViewerStore();
  const { conferenceMembers, scenes } = viewerStore;

  for (const sceneId of Object.keys(scenes)) {
    const sceneRef = scenes[sceneId]._scene;
    if (!sceneRef) continue;
    const existing = viewerStore.cursorHotspots[sceneId] || {};
    const toAdd = {};

    for (const userId of Object.keys(existing)) {
      if (!conferenceMembers[userId]) {
        existing[userId]?.destroy?.();
        delete existing[userId];
      }
    }

    for (const [userId, member] of Object.entries(conferenceMembers)) {
      if (userId == $callSocket.deviceId && viewerStore.isPortrait) continue;
      if (!existing[userId]) {
        const component = createCursorConnectionComponent(
          member.name,
          member.color,
          userId === $callSocket.deviceId,
          userId,
        );
        toAdd[userId] = sceneRef
          .hotspotContainer()
          .createHotspot(component.el, { yaw: 0, pitch: 0 });
      }
    }
    if (Object.keys(toAdd).length) {
      viewerStore.storeCursorHotspots(sceneId, toAdd);
    }
  }
};

export function calculateAngularDistance(pos1, pos2) {
  const deltaYaw = pos2.yaw - pos1.yaw;
  const deltaPitch = pos2.pitch - pos1.pitch;

  const angularDistance = Math.sqrt(
    deltaYaw * deltaYaw + deltaPitch * deltaPitch,
  );

  return angularDistance;
}

export const createInfoSpotsForScene = (scene, spots) => {
  if (!spots || spots.length === 0) return [];

  const filteredSpots = spots;

  return filteredSpots.map((hotspot, index) => {
    let nextHotspot;
    if (index === filteredSpots.length - 1) {
      nextHotspot = filteredSpots[0];
    } else {
      nextHotspot = filteredSpots[index + 1];
    }
    const distance = calculateAngularDistance(hotspot, nextHotspot);

    const hotspotWithDistance = { ...hotspot, distance };
    const type = String(hotspot?.type || "").toLowerCase();
    const isInfoHotspot = type === "image" || type === "video";
    let component = isInfoHotspot
      ? createInfoHotspotComponent(hotspotWithDistance)
      : createRegularSpotComponent(hotspotWithDistance);
    let spot = scene.hotspotContainer().createHotspot(component.el, {
      yaw: hotspot.yaw,
      pitch: hotspot.pitch,
    });
    return { component, spot, data: hotspotWithDistance };
  });
};
