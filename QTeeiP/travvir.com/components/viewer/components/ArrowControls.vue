<template>
  <div
    v-if="viewerStore.currentScene && !switchingScene && isVisible"
    class="arrow-controls"
    :style="arrowControlsStyle"
  >
    <div class="arrow-controls-container" :style="containerStyle">
      <svg :width="size" :height="size" viewBox="0 0 100 100">
        <g
          v-for="(hotspot, index) in activeLinkHotspots"
          :key="index"
          :transform="getArrowTransform(hotspot)"
        >
          <rect
            v-if="isMobile"
            x="-10"
            y="-10"
            width="25"
            height="20"
            fill="transparent"
            class="click-target"
            :class="{ 'rect-icon-inactive': !isHotspotActive(hotspot) }"
            @click="emitSwitchScene(hotspot)"
          />
          <RiArrowDownSLine
            color="white"
            :size="
              isHotspotActive(hotspot) ? `${arrowSize}` : `${arrowSize * 0.9}`
            "
            class="arrow-icon"
            :class="{
              'arrow-icon-inactive':
                !isHotspotActive(hotspot) || isUserActionActive,
            }"
            @click="emitSwitchScene(hotspot)"
          />
        </g>
      </svg>
    </div>
    <div class="target" :style="getTargetStyle()">
      <p
        class="target-name"
        :class="{ 'conference-viewer': viewerStore.isConferenceViewer }"
        @click="emitSwitchScene(nearestHotspot)"
      >
        {{ targetSceneName }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useNuxtApp } from "#app";
import { useViewerStore } from "~/store/viewer";
import { RiArrowDownSLine } from "@remixicon/vue";
import { useSceneStore } from "~/store/scene";
import { usePropertyStore } from "~/store/property";

// Props
const props = defineProps({
  size: {
    type: Number,
    default: 300,
  },
  arrowSize: {
    type: Number,
    default: 36,
  },
  switchingScene: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["switchScene"]);

// variables
const route = useRoute();
let nearestHotspot = null;
const currentYaw = ref(0);
const currentPitch = ref(0);
let yawUpdateInterval = null;
const { $device } = useNuxtApp();
const sceneStore = useSceneStore();
const viewerStore = useViewerStore();
const propertyStore = usePropertyStore();
const isPortrait = inject("isPortrait");

//computed

const activeLinkHotspots = computed(() => {
  let linkHotspot =
    viewerStore?.currentScene?.linkHotspots
      ?.filter((hs) => hs.active !== false)
      ?.filter((hs) => hs.target?.id !== undefined) || [];

  let activeHotspots = linkHotspot.map((hs) => {
    const scene = sceneStore.getScene.find(
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
  return activeHotspots.filter((hs) => hs.active);
});

const closestHotspot = computed(() => {
  const hotspots = activeLinkHotspots.value;
  if (!hotspots.length) return null;

  let closest = null;
  let minAngleDiff = Number.MAX_VALUE;

  hotspots.forEach((hotspot) => {
    const distance = getAngularDistance(hotspot.yaw, currentYaw.value);
    if (distance < minAngleDiff) {
      minAngleDiff = distance;
      closest = hotspot;
    }
  });
  nearestHotspot = closest;
  return closest;
});

const targetSceneName = computed(() => {
  if (!closestHotspot.value) return null;
  return viewerStore.getSceneById(closestHotspot.value.target?.id)?.name;
});

const isMobile = computed(() => {
  return $device.isMobile;
});

const isVisible = computed(() => {
  return currentPitch.value >= -0.262; // -15 degrees in radians
});

const containerStyle = computed(() => {
  if (currentPitch.value >= 1.309) {
    return 0;
  }
  let tilt = 50 * (1 - Math.max(0, currentPitch.value) / 1.309);
  return {
    transform: `rotateX(${tilt}deg)`,
  };
});

const arrowControlsStyle = computed(() => {
  let i = 0.325;
  if (window.innerHeight <= 460 && !isPortrait.value) i = 0.45;
  if (isPortrait.value) i = -0.01;
  if (route.name == "embed-propertyId")
    i = window.innerHeight <= 500 ? 0.42 : 0.36;

  return {
    bottom: `${-i * props.size}px`,
  };
});

//methods
const getAngularDistance = (angle1, angle2) => {
  // Normalize angles to [0, 2π]
  const a1 = ((angle1 % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const a2 = ((angle2 % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // Find the smallest angular distance
  let diff = Math.abs(a1 - a2);
  if (diff > Math.PI) {
    diff = 2 * Math.PI - diff;
  }

  return diff;
};

const getRelativeYaw = (hotspot) => {
  return hotspot.yaw - currentYaw.value;
};

const polarToCartesian = (angle, radius, centerX = 50, centerY = 50) => {
  return {
    x: centerX + radius * Math.sin(angle),
    y: centerY - radius * Math.cos(angle),
  };
};

const getArrowTransform = (hotspot) => {
  const relativeYaw = getRelativeYaw(hotspot);
  const { x, y } = polarToCartesian(relativeYaw, 20);
  const rotation = relativeYaw * (180 / Math.PI) + 180;
  const offsetX = -props.arrowSize / 2;
  const offsetY = -props.arrowSize / 2;

  return `translate(${x}, ${y}) rotate(${rotation}) translate(${offsetX}, ${offsetY})`;
};

const getTargetStyle = () => {
  if (!closestHotspot.value) {
    return {
      opacity: 0,
      pointerEvents: "none",
    };
  }

  const relativeYaw = getRelativeYaw(closestHotspot.value);

  // Calculate position outside the SVG circle
  const radiusSvg = 20;
  const gapPx = 4;
  const pixelsPerUnit = props.size / 100;
  const radiusPx = radiusSvg * pixelsPerUnit;
  const totalDist = radiusPx + gapPx;

  const dx = totalDist * Math.sin(relativeYaw);
  const dy = -totalDist * Math.cos(relativeYaw);

  const centerX = props.size / 2;
  const centerY = props.size / 2;

  return {
    position: "absolute",
    left: `${centerX}px`,
    top: `${centerY}px`,
    transformOrigin: "0 0",
    transform: `rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(${dx}px) translateY(${dy}px) translate(-50%, -50%)`,
    zIndex: 15,
    opacity: 1,
    // transition: "all 0.05s linear",
    pointerEvents: "none",
  };
};

const updateCurrentYaw = () => {
  if (viewerStore.viewer && viewerStore.viewer.view()) {
    currentYaw.value = viewerStore.viewer.view().yaw() || 0;
    currentPitch.value = viewerStore.viewer.view().pitch() || 0;
  }
};

const startYawTracking = () => {
  updateCurrentYaw();
  yawUpdateInterval = setInterval(updateCurrentYaw, 25);
};

const stopYawTracking = () => {
  if (yawUpdateInterval) {
    clearInterval(yawUpdateInterval);
    yawUpdateInterval = null;
  }
};

const findHotspotInDirection = (targetAngle, tolerance) => {
  const hotspots = activeLinkHotspots.value;
  if (!hotspots.length) return null;

  let closestHotspot = null;
  let minAngleDiff = Number.MAX_VALUE;

  hotspots.forEach((hotspot) => {
    let diffYaw = hotspot.yaw - currentYaw.value;

    // Normalize angle to [-π, π]
    while (diffYaw > Math.PI) diffYaw -= 2 * Math.PI;
    while (diffYaw < -Math.PI) diffYaw += 2 * Math.PI;

    // Calculate the absolute difference from the target angle
    const angleDiff = Math.min(
      Math.abs(diffYaw - targetAngle),
      Math.abs(Math.abs(diffYaw - targetAngle) - 2 * Math.PI),
    );

    // Check if this hotspot is within tolerance and has a smaller angle difference
    if (angleDiff < tolerance && angleDiff < minAngleDiff) {
      minAngleDiff = angleDiff;
      closestHotspot = hotspot;
    }
  });

  return closestHotspot;
};

const handleKeyPress = (event) => {
  if (event.key === "ArrowUp") {
    const forwardHotspot = findHotspotInDirection(0, Math.PI / 2);
    if (forwardHotspot) {
      emitSwitchScene(forwardHotspot);
    }
  } else if (event.key === "ArrowDown") {
    const backwardHotspot = findHotspotInDirection(Math.PI, Math.PI / 2);
    if (backwardHotspot) {
      emitSwitchScene(backwardHotspot);
    }
  }
};

const isHotspotActive = (hotspot) => {
  const hotspotComponent = viewerStore?.currentScene?._connections?.find(
    (el) => el.data?.target?.id == hotspot.target?.id,
  );
  return hotspotComponent
    ? viewerStore.activeHotspot === hotspotComponent.component.props.index
    : false;
};

const isUserActionActive = computed(
  () =>
    viewerStore.isConferenceViewer ||
    propertyStore.ensureEmbedTabInActive(route) ||
    propertyStore.ensureConferenceTabInActive(route),
);

const emitSwitchScene = (hotspot) => {
  if (isUserActionActive.value) return;
  if (isMobile.value) {
    if (isHotspotActive(hotspot)) {
      emit("switchScene", hotspot);
    }
  } else {
    emit("switchScene", hotspot);
  }
};

// Lifecycle hooks
onMounted(() => {
  startYawTracking();
  window.addEventListener("keyup", handleKeyPress);
});

onBeforeUnmount(() => {
  stopYawTracking();
  window.removeEventListener("keyup", handleKeyPress);
});
</script>

<style scoped lang="scss">
.target-name {
  font-size: 16px;
  color: #f3f4f4;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: -0.02px;
  white-space: nowrap;
  pointer-events: auto;
  cursor: pointer;
  @include Elipsis(270px);
  text-shadow: 1px 1px black;
  pointer-events: none;
  line-height: 120%;
  // 2px 2px black,
  // 3px 3px black;
  // text-shadow: rgba(0, 0, 0) 2px 2px 4px;
  &.conference-viewer {
    pointer-events: none;
    opacity: 0.5;
  }
}
.arrow-controls {
  z-index: 10;
  position: absolute;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  perspective: 500px;
  margin-bottom: 20px;
  pointer-events: none;
}

.arrow-controls-container {
  border-radius: 50%;
  transform-style: preserve-3d;
  pointer-events: none;
}

.arrow-icon {
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5));
  transform-origin: center;
  pointer-events: auto;
  cursor: pointer;
  &.isMobile {
    padding: 0.5rem;
  }
}

.arrow-icon-inactive {
  opacity: 0.25;
}
.click-target {
  pointer-events: auto;
  cursor: pointer;
  transform: translate(16px, 18px);
  &.rect-icon-inactive {
    z-index: 112;
    pointer-events: none;
  }
}
.embed-do {
  position: fixed;
  bottom: 0px !important;
  @include mq(landscape-1) {
    bottom: -110px !important;
  }
}
</style>
