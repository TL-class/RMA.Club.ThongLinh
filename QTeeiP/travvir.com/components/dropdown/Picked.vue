<template>
  <div v-show="selected" class="picker" :class="{ 'is-open': isOpen }">
    <span class="sceneName" v-text="selected"/>
    <RiArrowDownSLine
      v-if="isDownArrowActive"
      class="caret"
      size="1.5em"
      :class="{ rotate: isOpen, disabled: disabled }"
    />
  </div>
</template>

<script setup>
import { RiArrowDownSLine } from "@remixicon/vue";
defineProps({
  selected: {
    type: String,
    default: "",
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  isDownArrowActive: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.picker {
  $fs: 1rem;
  box-sizing: border-box;
  padding: 0.4rem 0.75rem;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 4px;
  outline: none;
  @extend %chat-text;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.48);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.6),
      0 2px 6px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }
  .caret {
    color: rgba(255, 255, 255, 1);
    vertical-align: bottom;
    cursor: pointer;
    transition: all 0.2s ease-out;
    &.rotate {
      transform: rotate(180deg);
    }
  }
  span {
    flex: 1;
    text-align: center;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: rgba(255, 255, 255, 1);
    opacity: 1;
    width: 100%;
  }
  &.is-open {
    .caret {
      transform: rotate(180deg);
    }
  }
}
.disabled {
  opacity: 0;
}
</style>
