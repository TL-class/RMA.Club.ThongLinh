<script setup>
//import
import logger from "debug";
import { RiCheckFill } from "@remixicon/vue";
import { useSceneStore } from "~/store/scene";
import { useViewerStore } from "~/store/viewer";
import { usePropertyStore } from "~/store/property";
import { directive as vClickAway } from "vue3-click-away";

//variables
const sceneStore = useSceneStore();
const viewerStore = useViewerStore();
const isPortrait = inject("isPortrait");
const propertyStore = usePropertyStore();
const debug = logger(
  "travvir:debut-nuxt:components:actionQualityController:QualityDropdown",
);
const props = defineProps({
  custom: {
    type: Boolean,
    default: false,
  },
});

const isCustomUi = computed(() => {
  return props.custom || isPortrait.value;
});

//functions
function onClickAway() {
  if (isPortrait.value) return;
  viewerStore.isToggleQuality = false;
}

function handleQualityChange(resolution) {
  propertyStore.selectedLevels = resolution.value;
  changeLayer(propertyStore.selectedLevels);
  viewerStore.isToggleQuality = false;
}

const currentSceneData = computed(() => {
  return (
    sceneStore.getScene.find(
      (scene) => scene.sceneId === viewerStore.selectedSceneId,
    ) ?? []
  );
});

function changeLayer(newLevel) {
  if (!viewerStore.viewer || !viewerStore.currentScene) return;

  debug("Quality level changed to:", newLevel);

  const {
    $marzipano,
    $isAppleChrome,
    $isAppleWebview,
    $isMacSafari,
    $isIPhone,
  } = useNuxtApp();

  let sequence = "bdflru";
  if ($isAppleChrome || $isAppleWebview || $isMacSafari || $isIPhone) {
    sequence = "urlfdb";
  }

  const currentSceneId = viewerStore.selectedSceneId;
  const imagePath = propertyStore.propertyInfo.imagePath;

  Object.values(viewerStore.scenes).forEach((sceneData) => {
    const marzipanoScene = sceneData?._scene;
    if (!marzipanoScene || !sceneData.levels?.length) return;

    let levels = sceneData.levels;
    if (newLevel != null && levels.length) {
      levels = levels.slice(0, newLevel + 1);
    }

    const newGeometry = new $marzipano.CubeGeometry(levels);
    const imagePattern = `${imagePath}/${sceneData.id}/{z}/{f}/{y}/{x}.jpg`;
    const newSource = new $marzipano.ImageUrlSource.fromString(imagePattern, {
      cubeMapPreviewUrl: `${imagePath}/${sceneData.id}/preview.jpg`,
      cubeMapPreviewFaceOrder: sequence,
    });

    const oldLayers = marzipanoScene.listLayers();
    marzipanoScene.createLayer({
      source: newSource,
      geometry: newGeometry,
      pinFirstLevel: true,
    });

    if (sceneData.id === currentSceneId) {
      marzipanoScene.hotspotContainer().show();
      setTimeout(() => destroyOldLayers(oldLayers, marzipanoScene), 500);
    } else {
      destroyOldLayers(oldLayers, marzipanoScene);
    }
  });
}

function destroyOldLayers(oldLayers, marzipanoScene) {
  if (!oldLayers?.length || !marzipanoScene) return;

  oldLayers.forEach((layer) => {
    try {
      marzipanoScene.destroyLayer(layer);
    } catch (e) {
      debug("destroyLayer cleanup warning (safe to ignore):", e.message);
    }
  });
}

function setAccessLevel() {
  if (!propertyStore.levelsLimit) return;
  propertyStore.resolutionCategories.forEach((resolution) => {
    resolution.subscription = resolution.value <= propertyStore.levelsLimit;
  });
}

//computed
const qualityResoltuion = computed(() => {
  return propertyStore.resolutionCategories.filter(
    (res) => res.value != currentSceneData.value.levels.length,
  );
});

//onMounted
onMounted(() => {
  setAccessLevel();
});
</script>

<template>
  <div
    v-click-away="onClickAway"
    class="quality-list"
    :class="{ portrait_mode: isCustomUi }"
  >
    <div class="quality-list__header">
      <div
        class="quality-list__back"
        @click="viewerStore.isToggleQuality = false"
      >
        <svg
          v-if="isCustomUi"
          style="transform: rotate(180deg)"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <svg
          v-else
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <span class="quality-list__title">Quality</span>
    </div>

    <ul class="quality-list__options">
      <li
        v-for="resolution in qualityResoltuion"
        :id="resolution.value"
        :key="resolution.value"
        :disabled="!resolution.subscription"
        :class="{
          'is-locked': !resolution.subscription,
        }"
        @click="resolution.subscription && handleQualityChange(resolution)"
      >
        <span class="quality-list__check">
          <RiCheckFill
            v-if="resolution.subscription"
            v-show="propertyStore.selectedLevels === resolution.value"
            size="14px"
            :style="isCustomUi ? 'padding-top: 0.05rem' : 'padding-top: 0.1rem'"
          />
        </span>
        <span class="quality-list__label"
          >{{ resolution.name }}
          <sup class="quality-list__badge">{{ resolution.subName }}</sup>
        </span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap");
.quality-list {
  position: absolute;
  z-index: 999999;
  right: 12.5%;
  bottom: 1rem;
  width: 8.5rem;
  padding: 0;
  margin: 0;
  color: rgba(255, 255, 255, 1);
  font-family: "Noto Sans", "Roboto", Arial, Helvetica, sans-serif;
  font-size: 0.875rem;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.48);
  background: rgba(0, 0, 0, 0.48);
  border-radius: 0.5rem;
  @extend %glass;

  @include respond-below(lg) {
    width: 8rem;
    font-size: 0.875rem;
    bottom: 1rem;
    right: 12%;
  }

  @include respond-below(sm) {
    width: 6.5rem;
    font-size: 0.8125rem;
    bottom: 0.75rem;
    right: 8%;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: calc(0.3rem + 2px);
    padding: 0.5rem 0.47rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    white-space: nowrap;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0.375rem 0.375rem 0 0;
  }

  &__back {
    display: grid;
    place-items: center;
    width: 14px;
    height: 14px;
    // padding: 0.5rem;
    cursor: pointer;

    svg {
      display: block;
      margin: 0;
    }
  }

  &__title {
    font-size: 9.5px;
    display: block;
    line-height: 1;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 0.09rem;
    width: 100%;
    padding: 0.2rem; // reduced from 0.25rem
    margin: 0;
    list-style: none;

    @include respond-below(lg) {
      padding: 0.2rem; // reduced from 0.3rem
    }

    @include respond-below(sm) {
      padding: 0.15rem; // tighter on small screens
    }
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.3rem; // reduced from 0.4rem
    padding: 0.4rem 0.6rem 0.4rem 0.4rem; // less left padding
    // margin-bottom: 0.2rem;
    font-size: 12px; // slightly smaller for better fit
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.15s ease;

    @include respond-below(lg) {
      padding: 0.4rem 0.55rem 0.4rem 0.35rem; // balanced, not inflated
      gap: 0.3rem;
    }

    @include respond-below(sm) {
      padding: 0.35rem 0.5rem 0.35rem 0.3rem;
      gap: 0.25rem;
    }
    // HOVER — only for subscribed items
    &:not(.is-locked):hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    // SELECTED — subscribed + currently active
    &.is-selected {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.08);
    }

    // LOCKED — non-subscribed, unclickable
    &.is-locked {
      color: #888;
      cursor: not-allowed;

      .quality-list__check {
        color: #888;
      }

      .quality-list__badge {
        color: #888;
      }
    }
  }

  &__check {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    line-height: 1;
    background: transparent; // prevent any bg color
    border: none; // prevent any border color
    overflow: hidden; // clip anything that overflows

    :deep(svg),
    :deep(i) {
      display: block;
      width: 14px !important;
      height: 14px !important;
      min-width: 14px;
      min-height: 14px;
      // fill: none; // force no fill color
      // stroke: currentColor; // use text color only
      color: currentColor;
    }
  }

  &__label {
    display: block;
    line-height: 1;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  &__badge {
    display: inline-flex;
    align-items: center;
    font-size: 9px;
    font-weight: 500;
    color: #ccc;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1;
    vertical-align: super;
    margin-left: 2px;

    @include respond-below(sm) {
      font-size: 8px;
    }
  }
}

.portrait_mode {
  top: 10%;
  right: 1rem;
  bottom: auto;

  @include respond-below(lg) {
    top: 12%;
    right: 1rem;
  }

  @include respond-below(sm) {
    top: 8%;
    right: 0.75rem;
  }
}
</style>
