<template>
  <div class="dropdown-container">
    <ul class="dropdown-list">
      <DropdownItem
        v-for="item in listItems"
        :id="item.dataId"
        ref="dropdownItem"
        :key="item.dataId"
        v-bind="item"
        :selected-scene="selectedScene"
        :class="{
          active: selectedScene.id == item.dataId,
          isDisabled: !item.isActive,
        }"
        @select="handleSceneChange($event, item.isActive)"
      />
    </ul>
  </div>
</template>

<script setup>
import DropdownItem from "./DropdownItem.vue";
defineProps({
  listItems: {
    type: Array,
    default: () => [],
  },
  selectedScene: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["change"]);
const handleSceneChange = (event, isActive) => {
  if (!isActive) return;
  emit("change", event);
};
</script>

<style lang="scss" scoped>
.dropdown-container {
  padding: 0.3rem;
  position: absolute;
  z-index: 10;
  width: 100%;
  top: calc(100% + 4px);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0;
  border-radius: 4px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
}
.dropdown-list {
  $d-height: 15.62rem;
  font-size: calc(0.5rem + (10 - 8) * ((100vw - 300px) / (1260 - 300)));
  box-sizing: border-box;
  list-style: none;
  color: rgba(255, 255, 255, 0.9);
  flex-direction: column;
  justify-content: center;
  font-weight: 400;
  transition: all 0.3s ease-out;
  max-height: $d-height;
  overflow-y: scroll;
  @include custom-scroll-bar();
  text-decoration: none;
  padding: 1rem 0.8rem;
  li {
    &.selected-item {
      color: rgba(255, 255, 255, 1);
      background: rgba(255, 255, 255, 0.15);
      // border-left: 4px solid rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
