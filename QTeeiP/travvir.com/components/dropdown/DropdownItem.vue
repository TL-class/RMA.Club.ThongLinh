<template>
  <li
    :id="dataId"
    :data-id="dataId"
    class="dropdown-item"
    :class="{
      isMobile: isMobile,
      'selected-item': selectedScene?.id == dataId,
    }"
    @click.stop="handleClick(dataId)"
  >
    <SubItem
      :selected-scene="selectedScene?.id"
      :items="items || []"
      :label="label"
      :is-active="isActive"
      :visited="visited"
      @change="handleClick($event)"
    />
  </li>
</template>

<script setup>
import SubItem from "./SubItem.vue";

//emits and props
const emit = defineEmits(["select"]);
defineProps({
  dataId: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  selectedScene: {
    type: Object,
    default: null,
  },
  visited: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

//variables
const { $device } = useNuxtApp();

//computed
const isMobile = computed(() => $device.isMobile);

//methods
function handleClick(dataId) {
  if (dataId) emit("select", dataId);
}
</script>

<style lang="scss" scoped>
li {
  $li-fs: 0.875rem;
  $padding: 0.5rem 1rem;
  font-size: $li-fs;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: $padding;
  background: transparent;
  font-family: $theme-font;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  transition: all 0.2s ease;
  border-radius: 0;
  position: relative;

  &:hover {
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.1);
  }

  &.selected-item {
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.15);
    &::before {
      content: "";
      position: absolute;
      left: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      display: inline-block;
      width: 0.1875rem;
      height: 1.25rem;
      // background-color: rgba(255, 255, 255, 0.8);
      border-radius: 1px;
    }
  }
  &.isDisabled {
    opacity: 0.5;
    // pointer-events: none;
    cursor: not-allowed;
    &:hover {
      color: rgba(255, 255, 255, 0.9);
      background: transparent;
    }
  }

  &:not(:last-child) {
    margin-bottom: 0;
  }
}
.isMobile {
  li {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    height: fit-content;
  }
  .caret {
    margin: 0;
    height: 1rem;
    width: 1rem;
  }
}
</style>
