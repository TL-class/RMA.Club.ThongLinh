<template>
  <div
    class="dropdown"
    :class="{
      'is-open': isOpen,
      'is-portrait': isPortrait,
      'is-disabled': disabled,
    }"
    @click="handleOpen"
  >
    <Picked
      :disabled="disabled"
      :selected="selectedSceneName?.name"
      :is-open="isOpen"
      :is-down-arrow-active="isDropdownInteractable"
    />
    <DropdownMenu
      v-if="isDropdownInteractable"
      v-show="isOpen"
      ref="dropdownMenu"
      :list-items="listItems"
      :selected-scene="selectedSceneName"
      @change="handleSceneChange"
    />
  </div>
</template>

<script setup>
import logger from "debug";
import Picked from "./Picked.vue";
import { useSceneStore } from "~/store/scene";
import DropdownMenu from "./DropdownMenu.vue";
import { useViewerStore } from "~/store/viewer";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["change"]);
const debug = logger("travvir:debut-nuxt:components:dropdown:index");
// variables
const isOpen = ref(false);
const sceneStore = useSceneStore();
const viewerStore = useViewerStore();
const isPortrait = inject("isPortrait");

// Computed properties
const selectedSceneName = computed(() => {
  const scene = viewerStore.getSceneById(viewerStore.selectedSceneId);
  return scene ? scene : "";
});

const listItems = computed(() => {
  debug("listItems", sceneStore.getDropdownScene);
  return sceneStore.getDropdownScene;
});

// Methods
const handleOpen = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  scrollToView();
};

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) isOpen.value = false;
  },
);

const isDropdownInteractable = computed(() => {
  if (!listItems.value?.length) return false;
  else if (listItems.value?.length == 1)
    return listItems.value[0]?.items.length > 1;
  else return true;
});

const handleSceneChange = (event) => {
  debug("Selected scene:", event);
  emit("change", event);
  isOpen.value = false;
};

const scrollToView = () => {
  if (isOpen.value) {
    nextTick(() => {
      const element = document.getElementById(selectedSceneName.value?.id);
      if (element) {
        element.scrollIntoView({ behavior: "instant", block: "nearest" });
      }
    });
  }
};
</script>
<style lang="scss" scoped>
$d-width: 20vw;
.dropdown {
  pointer-events: all;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  width: $d-width;
  cursor: pointer;
  border-radius: 4px;
  @include respond-below(sm) {
    @media screen and (orientation: portrait) {
      .dropdown {
        width: 50%;
        left: 50%;
        transform: translateX(-50%);
        .dropdown {
          .picker {
            height: fit-content;
            font-size: 0.9rem;
            padding: 0.3rem 0.4rem;
          }
          .dropdown-list {
            top: 2.3rem;
            $d-height: 10.5rem;
            max-height: $d-height;
            padding: 0.5rem 0.4rem;
          }
        }
      }
    }
  }
  &.is-portrait {
    width: 55vw;
  }
  @include mq(landscape-1) {
    width: 28dvw;
  }
  &.is-disabled {
    pointer-events: none;
    cursor: default;
    // opacity: 0.7;
  }
}
</style>
