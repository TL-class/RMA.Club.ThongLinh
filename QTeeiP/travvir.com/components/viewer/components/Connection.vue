<template>
  <div class="hotspot link-hotspot" :class="{ hide: !isWayPointShow }">
    <div class="flex" @click="handleClick" @mouseover="active = true">
      <img
        v-if="pitchInDegree(data?.pitch) <= 10"
        :src="connectionIcon"
        class="link-hotspot-icon rotate-animation"
        alt="hotspot icon"
        loading="lazy"
        :class="{
          'inactive-hotspot':
            index !== viewerStore.activeHotspot || !canControl,
          'conference-viewer': isConferenceViewer,
        }"
      >
      <!-- <div class="information">
        <div
          class="link-name"
          :class="{ hide: index !== viewerStore.activeHotspot || !canControl }"
        >
          {{ target }}
        </div>
      </div> -->
      <div
        v-else
        class="main-high-light"
        :style="hotspotStyle"
        :class="{
          inactive: index !== viewerStore.activeHotspot || !canControl,
          'conference-viewer': isConferenceViewer,
        }"
      >
        <div class="circle-wrapper" />
        <div class="big-circle-wrapper" />
      </div>
    </div>
  </div>
</template>

<script setup>
import logger from "debug";
import { useMiraStore } from "~/store/mira";
import { useViewerStore } from "~/store/viewer";
import { usePropertyStore } from "~/store/property";

const debug = logger("travvir:debut-nuxt:viewer:Connection");
// Define props
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  scenes: {
    type: Array,
    default: () => [],
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  isMobile: Boolean,
  readyState: Boolean,
  isPortrait: Boolean,
  changeListener: {
    type: Function,
    default: null,
  },
  index: {
    type: Number,
    default: 0,
  },
  currentRoute: {
    type: Object,
    default: null,
  },
});

// variables
const active = ref(false);
const miraStore = useMiraStore();
const viewerStore = useViewerStore();
const propertyStore = usePropertyStore();
const responseHeightMeetsCondition = ref(true);
const viewerPitch = ref(0);
let viewPitchListener = null;

// computed
const isConferenceViewer = computed(() => viewerStore.isConferenceViewer);
const hotspotStyle = computed(() => {
  const hotspotPitch = props.data.pitch || 0;
  const relativePitch = hotspotPitch - viewerPitch.value;
  const pitchDeg = Math.max(-90, Math.min(90, relativePitch * (180 / Math.PI)));
  const rotateX = 70 - 70 * (pitchDeg / 90);

  let scale = Math.max(0.1, 0.9 + 1 * (pitchDeg / 90));
  if (props.isPortrait) {
    scale = Math.max(0.06, (0.9 + 1 * (pitchDeg / 90)) * 0.57);
  }
  return {
    transform: `rotateX(${rotateX}deg) scale(${scale})`,
  };
});

const isConnectionInActive = computed(
  () =>
    propertyStore.ensureEmbedTabInActive(props.currentRoute) ||
    propertyStore.ensureConferenceTabInActive(props.currentRoute),
);

const pitchInDegree = (pitch = 0) => {
  return pitch * (180 / Math.PI);
};

const isViewerReady = computed(() => {
  if (props.readyState) return true;
  return viewerStore.isReady;
});

const isWayPointShow = computed(() => {
  if (!isViewerReady.value || isConnectionInActive.value) return false;
  if (props.isPortrait)
    if (miraStore.options.length || miraStore.messages.length) {
      return responseHeightMeetsCondition.value;
    }
  return true;
});

const canControl = computed(() => {
  return true;
});

const targetId = computed(() => {
  // legacy support
  return typeof props.data.target == "string"
    ? props.data.target
    : props.data.target.id;
});

// const target = computed(() => {
//   return props.scenes?.find((s) => s.id == targetId.value)?.name;
// });

const connectionIcon = computed(() => {
  return props.config.public.NUXT_CDN_URL + "/static/icons/way.svg";
});

// Methods
const handleClick = (event, fromKeyboard = false) => {
  if (
    !canControl.value ||
    isConferenceViewer.value ||
    isConnectionInActive.value
  )
    return;
  let payload = { target: targetId.value };
  if (props.data.target.position)
    payload.position = {
      yaw: props.data.target.position.yaw,
      pitch: props.data.target.position.pitch,
    };
  payload.keyboardEvent = !!fromKeyboard;
  props.changeListener(payload);
};

const getResponseHeight = async () => {
  return new Promise((resolve, reject) => {
    nextTick(() => {
      try {
        const responseContainer = document.getElementById("response");
        const height = responseContainer ? responseContainer.clientHeight : 0;
        resolve(height);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const checkResponseHeight = async () => {
  try {
    const height = await getResponseHeight();
    responseHeightMeetsCondition.value = height < window.innerHeight / 3;
  } catch (error) {
    debug("error", error);
  }
};

function bindViewerPitchListener() {
  unbindViewerPitchListener();
  const view = viewerStore.viewer?.view();
  if (!view) return;

  viewerPitch.value = view.pitch() || 0;
  viewPitchListener = () => {
    viewerPitch.value = view.pitch() || 0;
  };
  view.addEventListener("viewchange", viewPitchListener);
}

function unbindViewerPitchListener() {
  const view = viewerStore.viewer?.view();
  if (view && viewPitchListener) {
    view.removeEventListener("viewchange", viewPitchListener);
  }
  viewPitchListener = null;
}

// Watchers
watch(() => miraStore.options, checkResponseHeight, { immediate: true });
watch(() => miraStore.messages, checkResponseHeight, { immediate: true });
watch(
  () => [
    viewerStore.viewer,
    viewerStore.marzipanoReady,
    viewerStore.selectedSceneId,
  ],
  () => {
    if (viewerStore.viewer && viewerStore.marzipanoReady) {
      bindViewerPitchListener();
    } else {
      unbindViewerPitchListener();
    }
  },
  { immediate: true },
);

// Lifecycle hooks
onMounted(() => {
  checkResponseHeight();
});

onUnmounted(() => {
  unbindViewerPitchListener();
});
</script>

<style lang="scss" scoped>
.inactive-hotspot {
  opacity: 0.4;
  &:hover {
    opacity: 0.9;
  }
}
.link-hotspot {
  position: relative;
  width: fit-content;
  height: fit-content;
  @extend %v-center;
  opacity: 0.9;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
  gap: 4px;
  @include respond-below(sm) {
    height: fit-content;
    width: fit-content;
  }
  .flex {
    //transform on x and y to center the hotspot properly by their hotspot height
    transform: translate(-21px, -21px);
    position: relative;
    display: flex;
    align-items: center;
    // justify-content: center;
    width: 120%;
    gap: 0rem;
    padding: 0.5rem;
    cursor: pointer;
  }
  .link-hotspot-icon {
    width: 22px;
    height: 22px;
    min-width: 22px;
    cursor: pointer;
    border-radius: 50%;
    animation: pulse-custom 2s infinite;
    @include respond-below(sm) {
      height: 22px;
      width: 22px;
    }
  }
  .hide {
    display: none;
  }
  .information {
    color: #ffff;
    -webkit-transition:
      -ms-transform 0.3s,
      -webkit-transform 0.3s,
      transform 0.3s,
      opacity 0.3s;
    transition:
      -ms-transform 0.3s,
      -webkit-transform 0.3s,
      transform 0.3s,
      opacity 0.3s;
    padding: 2px 3px;
    @include respond-below(sm) {
    }
    @include mq(landscape) {
      margin: -29px 28px;
    }
    .link-name {
      flex: 1;
      font-family:
        ui-sans-serif,
        -apple-system,
        system-ui,
        Segoe UI,
        Helvetica,
        Apple Color Emoji,
        Arial,
        sans-serif,
        Segoe UI Emoji,
        Segoe UI Symbol;
      padding: 2px 6px;
      border-radius: 4px;
      width: fit-content;
      background: rgba(0, 0, 0, 0.6);
      --webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
      font-size: 14px;
      line-height: 17px;
      @include Elipsis(350px);
      @include respond-below(sm) {
        letter-spacing: 0.3px;
      }
      @include mq(landscape) {
        letter-spacing: -0.3px;
      }
    }
  }
}
.hide {
  opacity: 0;
}

.main-high-light {
  width: 45px;
  height: 45px;
  opacity: 0.85;
  border-radius: 50%;
  background: transparent;
  border: 6px solid rgb(243, 238, 238);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.8);
  transform-style: preserve-3d;
  transition: opacity 0.3s ease;
  position: relative;
  &:hover {
    box-shadow: 0 0 40px rgba(255, 255, 255, 1);
    // border-color: #fff;
  }
  .circle-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
      rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
    // border: 1px solid rgb(0, 0, 0);
    border-radius: 50%;
  }
  .big-circle-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45px;
    height: 45px;
    box-shadow:
      rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px,
      rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px,
      rgba(0, 0, 0, 0.09) 0px -3px 5px;
    // box-shadow: rgba(0, 0, 0) 10px 10px 10px;
    // background-color: red;
    // border: 1px solid rgb(0, 0, 0);
    border-radius: 50%;
  }
}
.inactive {
  opacity: 0.25;
  &:hover {
    opacity: 0.85;
  }
}
.conference-viewer {
  opacity: 0.35;
  &:hover {
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
    //   opacity: 0.85;
  }
}
</style>
