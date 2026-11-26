<template>
  <div :class="isParent ? 'loading-container' : 'is-parent'">
    <div class="loading-spinner">
      <div class="spinner"/>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isParent: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
}
.is-parent {
  top: 0%;
  left: 0%;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-spinner {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spinner {
  width: 40px;
  height: 40px;
  border-bottom: 4px solid gray;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
