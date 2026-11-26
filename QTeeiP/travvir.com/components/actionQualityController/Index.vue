<script setup>
import { RiEqualizer2Line } from "@remixicon/vue";
import { usePropertyStore } from "~/store/property";
import { useViewerStore } from "~/store/viewer";

//variables
const isPortrait = inject("isPortrait");
const viewerStore = useViewerStore();
const propertyStore = usePropertyStore();

const props = defineProps({
  custom: {
    type: Boolean,
    default: false,
  },
});

const isCustomUi = computed(() => {
  return props.custom || isPortrait.value;
});

//computed
const label = computed(() => {
  const resolution = propertyStore.resolutionCategories.find(
    (item) => item.value === propertyStore.selectedLevels,
  );

  if (!resolution || resolution.value === 1) return "";
  else return resolution.subName;
});

const cssClasses = computed(() => {
  return {
    buttonWrapperClass: isCustomUi.value ? "wrapper" : "icon-wrapper",
    buttonClass: isCustomUi.value ? "quality" : "share",
    iconClass: isCustomUi.value ? "icon" : "shareIcon qualityIcon",
    badgeContainerClass: isCustomUi.value
      ? "hd-mobile-badge_container"
      : "hd-badge_container",
  };
});

//functions
function handleToggle() {
  viewerStore.isToggleQuality = !viewerStore.isToggleQuality;
}
</script>

<template>
  <button :class="cssClasses.buttonClass" @click="handleToggle">
    <p v-if="!isCustomUi">Quality</p>
    <div :class="cssClasses.buttonWrapperClass">
      <RiEqualizer2Line :class="cssClasses.iconClass" />
      <div v-if="label" :class="cssClasses.badgeContainerClass">
        <p class="hd-badge">{{ label }}</p>
      </div>
    </div>
  </button>
</template>
<style lang="scss" scoped>
.hd-mobile-badge_container {
  position: absolute;
  height: 10px;
  width: 13px;
  background-color: #e1002d;
  border-radius: 1px;
  line-height: normal;
  top: 3px;
  right: 1px;
}
.wrapper {
  border: none;
  outline: none;
}

.quality {
  @extend %flex-center;

  border: none;
  outline: none;
  background: transparent;

  position: relative;
  width: fit-content;
  height: fit-content;
  padding: 0.4rem;
  margin: 1rem 0 0;
  border-radius: 4px;

  align-items: center;
  gap: 0.5rem;

  font-family: $theme-font;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: 0.025em;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.48);

  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  @include mq(landscape) {
    display: none;
  }
}
.share {
  position: relative;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 22px;
  padding: 0.3rem 0.9rem;
  font-size: 1rem;
  text-transform: capitalize;
  font-weight: 400;
  background-color: transparent;
  color: rgba(255, 255, 255, 1);
  @extend %flex-center;
  align-items: center;
  gap: 0.5rem;
  @include respond-below(sm) {
    position: absolute;
    top: 3rem;
    right: 1%;
    padding: 0.12rem 0.6rem;
    gap: 0.3rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-size: 0.875rem;
    color: #ffff;
  }
  .shareIcon {
    margin-bottom: unset;
    width: 16px;
    height: 16px;
    @include respond-below(sm) {
      width: 1.125rem;
      height: 1.125rem;
    }
  }
  .qualityIcon {
    width: 16px;
    height: 16px;
    margin-bottom: unset;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.1s ease-in;
    color: rgba($color: #fff, $alpha: 0.6);
  }
}

.icon-wrapper {
  position: relative;
  width: 16px;
  height: 16px;
  display: inline-block;
  .hd-badge_container {
    position: absolute;
    height: 10px;
    width: 13px;
    background-color: #e1002d;
    border-radius: 1px;
    line-height: normal;
    top: -2px;
    right: -5px;
  }

  .hd-badge {
    color: white;
    font-size: 7px;
    padding: 1.5px;
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: 0.5px;
  }

  .icon {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    width: 1.5rem;
    height: 1.5rem;
    // &:not(:last-child) {
    //   margin-right: 0.8rem;
    // }
    .enter-fullscreen {
      transform: scale(0.8);
    }
    @include respond-below(sm) {
      width: 1.2rem;
      height: 1.2rem;
      .enter-fullscreen {
        transform: scale(0.7);
      }
    }
    @include mq(landscape) {
      width: 1.2rem;
      height: 1.2rem;
      .enter-fullscreen {
        transform: scale(0.7);
      }
    }
  }
}
</style>
