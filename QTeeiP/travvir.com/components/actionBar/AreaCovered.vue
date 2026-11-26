<template>
  <div class="area-covered" :style="areaCovered">
    <p>{{ percentage }}%</p>
    <p>Viewed</p>
  </div>
</template>

<script setup>
import { useSceneStore } from "~/store/scene";
import { useViewerStore } from "~/store/viewer";

const viewerStore = useViewerStore();
const sceneStore = useSceneStore();

const areaCovered = computed(() => "");
const percentage = computed(() => {
  let totalScenes = sceneStore.getScene.length;
  let visitedScenes = Object.values(viewerStore.scenes)?.filter(
    (scene) => scene.visited,
  );
  return Math.round((visitedScenes.length / totalScenes) * 100);
});
</script>

<style lang="scss" scoped>
.area-covered {
  height: 100%;
  background: rgba($color: #000, $alpha: 0.6);
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.04em;
  display: flex;
  text-align: center;
  padding: 0.4rem;
  gap: 0.2rem;
  border-radius: 0.2rem;
  transition: all 0.3s ease-out;

  & > p {
    font-size: 1rem;
    line-height: 1;
    &:first-child {
      font-weight: 500;
    }
    &:last-child {
      font-size: 0.9rem;
      // margin-top: 0.rem;
    }
  }
  @include mq(landscape) {
    p:first-child {
      font-size: 0.9rem;
    }
  }
}
</style>
