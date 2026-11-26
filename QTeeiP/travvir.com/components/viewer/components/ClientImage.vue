<template>
  <div class="patch-wrapper" :style="dynamicWidth">
    <!-- Show image if available -->
    <img
      v-if="firmData.image"
      :src="firmData.image"
      alt="firm image"
      class="patch-image"
    >
    <!-- Avatar fallback when no image -->
    <div v-else class="avatar-fallback">
      <span class="captured-label">Scanned by</span>
      <span class="firm-name">{{ firmData.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSceneStore } from "~/store/scene";
import { useViewerStore } from "~/store/viewer";
import { usePropertyStore } from "~/store/property";
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object,
    default: () => ({}),
  },
});

const sceneStore = useSceneStore();
const viewerStore = useViewerStore();
const scene = computed(() => {
  if (!sceneStore.getScene) return {};
  return sceneStore.getScene.find(
    (scene) => scene.sceneId == viewerStore.selectedSceneId,
  );
});

const dynamicWidth = computed(() => {
  const radius =
    !scene.value ||
    scene.value?.circleRadius == 2048 ||
    scene.value?.circleRadius == 0 ||
    scene.value?.partialCapture
      ? 400
      : scene.value.circleRadius;
  const size = Math.min(Math.max(radius, 400), 1000);
  return {
    width: `${size}px`,
    height: `${size}px`,
    "--circle-size": size,
  };
});

const propertyStore = usePropertyStore();

const firmData = computed(() => {
  return {
    name:
      propertyStore.propertyInfo.owner?.name ||
      propertyStore.propertyInfo.creator?.name ||
      "",
    image: propertyStore.propertyInfo.owner?.nadirConfig?.image
      ? `${props.config.public.NUXT_CDN_URL}/` +
        propertyStore.propertyInfo.owner?.nadirConfig.image
      : null,
  };
});
</script>

<style lang="scss" scoped>
.patch-wrapper {
  min-width: 300px;
  min-height: 300px;
  max-width: 1000px;
  max-height: 1000px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  border-radius: 20px;
  // border-radius: 50%;
  // overflow: hidden;

  .patch-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    // mix-blend-mode: multiply;
    // background-color: rgba(255, 255, 255, 0.4);
    // border-radius: 50%;
  }

  .avatar-fallback {
    transform: rotate(17deg);
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    gap: calc(var(--circle-size) * 0.03px);

    .captured-label {
      font-size: clamp(1rem, calc(var(--circle-size) * 0.08px), 4rem);

      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      line-height: 1.1;
      user-select: none;
    }

    .firm-name {
      padding: calc(var(--circle-size) * 0.03px)
        calc(var(--circle-size) * 0.06px);

      // 400px => 48px
      font-size: clamp(1.5rem, calc(var(--circle-size) * 0.12px), 6rem);

      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      letter-spacing: 1px;
      text-align: center;
      line-height: 1.2;
      user-select: none;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
