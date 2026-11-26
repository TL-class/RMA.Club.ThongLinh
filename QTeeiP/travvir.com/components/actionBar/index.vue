<template>
  <div
    class="action-controller"
    :class="{
      'drawer-open': drawerOverlay,
      'top-shift': $device.isIOS && false,
      tutorial: isTutorialOn,
      isIPhone: $isIPhone,
    }"
  >
    <div class="top-bar" :class="{ isPortrait: isPortrait }">
      <div class="left" :class="{ hidden: isTutorialOn }">
        <a
          v-if="isEmbedRequest ? isFullScreen : true"
          :href="baseUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="~/public/favicon.ico" alt="travvir icon" >
        </a>
        <AreaCovered
          :class="{
            isEmbedRequest: !isEmbedRequest,
            isEmebdRequestAndFullScreen: isEmbedRequest && isFullScreen,
          }"
        />
      </div>
      <Dropdown
        id="Dropdown"
        :scenes="tourScenes"
        :class="{
          isEmbedRequest: isEmbedRequest,
        }"
        :groups="sceneGroups"
        @change="changeSceneFromDropdown($event)"
      />
      <div class="group-icons-container">
        <div class="group-icons quality-controller">
          <QualityController v-click-away="onClickAway" :custom="true" />
        </div>
        <div
          v-if="shouldShowButtons"
          class="group-icons"
          :class="{ hidden: isTutorialOn }"
        >
          <div class="fullscreen icon" @click="fullScreenToggle">
            <RiFullscreenExitLine v-if="isFullScreen" size="3em" />
            <RiFullscreenLine v-else size="3em" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logger from "debug";
import { mapState } from "pinia";
import screenfull from "screenfull";
import AreaCovered from "./AreaCovered.vue";
import { useViewerStore } from "~/store/viewer";
import { usePropertyStore } from "~/store/property";
import Dropdown from "~/components/dropdown/index.vue";
import { directive as vClickAway } from "vue3-click-away";
import QualityController from "~/components/actionQualityController/Index.vue";
import { RiFullscreenExitLine, RiFullscreenLine } from "@remixicon/vue";
const debug = logger("travvir:debut-nuxt:components:actionBar:index");
const { $isIPhone } = useNuxtApp();
export default {
  name: "ActionBar",
  components: {
    RiFullscreenExitLine,
    RiFullscreenLine,
    Dropdown,
    QualityController,
    AreaCovered,
  },
  directives: {
    clickAway: vClickAway,
  },
  props: {
    autoOpenDropdown: {
      type: Boolean,
      default: false,
    },
    ready: {
      type: Boolean,
      default: false,
    },
    isEmbedRequest: {
      type: Boolean,
      default: false,
    },
    isPortrait: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isTutorialOn: false,
      isFullScreen: false,
      drawerOverlay: false,
      viewerStore: useViewerStore(),
      config: useRuntimeConfig(),
    };
  },
  computed: {
    baseUrl() {
      return this.config.public.NUXT_BASE_URL;
    },
    isMobile() {
      const { $device } = useNuxtApp();
      return $device.isMobile;
    },
    shouldShowButtons() {
      if ($isIPhone || this.isPortrait) return false;
      if (this.owner?.firm?.id == "66518a972841394ce7b28d57") return false;
      return true;
    },
    ...mapState(usePropertyStore, [
      "owner",
      "extraResources",
      "tourScenes",
      "sceneGroups",
    ]),
  },
  mounted() {
    screenfull.on("change", () => {
      this.isFullScreen = screenfull.isFullscreen;
    });
  },
  methods: {
    onClickAway() {
      if (this.isPortrait) {
        this.viewerStore.isToggleQuality = false;
      }
    },
    async fullScreenToggle() {
      await this.viewerStore.toggleFullScreen();
    },
    async changeSceneFromDropdown(id) {
      debug("changing scene from dropdown", id);
      this.viewerStore.setCurrentScene(id);
      // this.markUserForDropdown()
    },
  },
};
</script>

<style lang="scss" scoped>
.action-controller {
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.6rem;
  pointer-events: visible;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  // &.isIPhone {
  //   @include mq(portrait) {
  //     top: 16px;
  //   }
  // }
  &.tutorial {
    z-index: 111;
    .dropdown {
      pointer-events: none;
    }
  }
  .hidden {
    display: none !important;
  }
  .top-bar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include respond-below(sm) {
      justify-content: space-between;
      &:deep(.isEmbedRequest) {
        top: 0.2rem;
      }
      &:deep(.dropdown) {
        width: 43vw;
      }
    }
    @include mq(landscape-1) {
      justify-content: space-between;
      &:deep(.dropdown) {
        width: 33vw;
      }
    }

    &.isPortrait {
      // justify-content: flex-start;
    }
  }
  .left {
    display: flex;
    align-items: center;
    .area-covered {
      margin-left: calc(0.6rem + 28.8px);
      @include respond-below(sm) {
        display: none;
      }
    }
    .isEmebdRequestAndFullScreen {
      margin-left: 0.6rem;
    }
    .isEmbedRequest {
      margin-left: 0.6rem;
    }
    // @include respond-below(sm) {
    //   display: none;
    // }
    a {
      width: fit-content;
      height: fit-content;
      display: grid;
      place-items: center;
      img {
        cursor: pointer;
        width: 1.8rem;
        height: calc(0.8rem + 1rem);
        object-fit: contain;
        border-radius: 4px;
        @include mq(landscape) {
          height: calc(0.8rem + 0.9rem);
        }
      }
    }
  }
  .modal {
    background-color: rgba(0, 0, 0, 0.4);
  }
  .group-icons-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .group-icons {
    display: flex;
    align-items: center;
    padding: 0.4rem 0.4rem;
    border-radius: 0.2rem;
    gap: 0.5rem;
    width: fit-content;
    background: rgba($color: #000, $alpha: 0.4);
    &.quality-controller {
      @include mq(portrait) {
        margin-left: auto;
        background: transparent;
      }
      &:deep(.quality) {
        padding: 0rem;
        margin: 0rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .wrapper {
          height: 24px;
        }
        .hd-mobile-badge_container {
          top: -4px;
          right: -4px;
        }
        .hd-badge {
          font-size: 0.4rem;
          @include respond-below(sm) {
            font-size: 7px;
          }
        }
      }
    }
    @include respond-below(sm) {
      background: rgba($color: #000, $alpha: 0.4);
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
      &:not(:last-child) {
        margin-right: 0.8rem;
      }
      .enter-fullscreen {
        transform: scale(0.8);
      }
    }
  }
  &.drawer-open::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.5);
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
