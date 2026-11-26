<template>
  <div class="embed-pano-watermark">
    <!-- <span v-for="i in 100" :key="i" class="watermark-text"> Travvir </span> -->
  </div>
</template>

<style scoped lang="scss">
.embed-pano-watermark {
  position: absolute;
  inset: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-content: space-evenly;
  justify-content: space-evenly;
  pointer-events: none;
  overflow: hidden;
  @extend %glass;
}

.watermark-text {
  color: rgba(255, 255, 255, 0.05);
  font-size: 24px;
  font-weight: 700;
  transform: rotate(-30deg);
  user-select: none;
}
</style>
