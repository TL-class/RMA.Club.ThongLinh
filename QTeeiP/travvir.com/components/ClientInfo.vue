<template>
  <div v-if="showFirmImage" class="client">
    <NuxtImg :src="showFirmImage" alt="firmImage" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePropertyStore } from "~/store/property";

const propertyStore = usePropertyStore();
const showFirmImage = computed(() => {
  if (propertyStore.propertyInfo?.owner?.squareImage)
    return propertyStore.propertyInfo.owner?.squareImage;
  return (
    propertyStore.propertyInfo.owner?.image ||
    propertyStore.propertyInfo?.creator?.image
  );
});
</script>

<style lang="scss" scoped>
.client {
  width: fit-content;
  left: 0.8%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 50%;
    @include respond-below(sm) {
      height: 2.5rem;
      width: 2.5rem;
    }
  }
}
</style>
