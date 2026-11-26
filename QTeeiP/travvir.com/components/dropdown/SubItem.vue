<template>
  <div class="wrapper" @click="active = !active">
    <div
      :style="{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
      }"
    >
      <p :class="{ unseen: !visited }">{{ label }}</p>
      <RiArrowDownSLine
        v-if="items.length"
        class="caret"
        alt="caret"
        :class="{ rotate: active }"
      />
    </div>
    <ul v-show="items.length && active" class="sub-menu">
      <li
        v-for="item in items"
        :id="item.dataId"
        :key="item.dataId"
        :class="{
          'is-active': selectedScene == item.dataId,
          isDisabled: !item.isActive,
        }"
        :data-id="item.dataId"
        @click.stop="handleClick(item.dataId, item.isActive)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { RiArrowDownSLine } from "@remixicon/vue";

//varibale
const active = ref(false);
const emit = defineEmits(["change"]);

//props
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  visited: {
    type: Boolean,
    default: false,
  },
  selectedScene: {
    type: String,
    default: "",
  },
});

const handleClick = (dataId, isActive) => {
  if (!isActive) return;
  emit("change", dataId);
};

const checkAndSetActive = () => {
  if (props.selectedScene && props.items.length) {
    const hasMatchingItem = props.items.some(
      (item) => item.dataId === props.selectedScene,
    );
    if (hasMatchingItem) {
      active.value = true;
    }
  }
};

watch(
  [() => props.selectedScene, () => props.items],
  () => {
    checkAndSetActive();
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
li {
  opacity: 0.9;
  $padding: 0.6rem;
  font-size: inherit;
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
  border-radius: 6px;

  &:hover,
  .active,
  &.is-active {
    color: rgba(255, 255, 255, 1);
    // background: rgba(255, 255, 255, 0.1);
    // border-left: 4px solid rgba(255, 255, 255, 0.8);
    // box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.1);
  }

  &:not(:last-child) {
    margin-bottom: 0.6rem;
    @include mq(landscape) {
      margin-bottom: 0.4rem;
    }
  }

  @include respond-below(sm) {
    height: fit-content;
    font-size: 0.9rem;
    padding: 0.3rem 0.4rem;
  }

  @include mq(landscape) {
    padding: 0.2rem;
    font-size: 0.875rem;
  }
}
.wrapper {
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-direction: column;
  p {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;

    &.unseen {
      opacity: 0.7;
    }
  }
}

ul.sub-menu {
  margin-top: 0.6rem;
  background: transparent;
  border-radius: 8px;
  li {
    color: rgba(255, 255, 255, 0.9);
    background: transparent;

    &:hover,
    &.is-active {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
.caret {
  width: 2.3rem;
  height: 2.3rem;
  margin: -0.675rem -0.5rem;
  color: rgba(255, 255, 255, 0.8);
  vertical-align: bottom;
  cursor: pointer;
  transition: all 0.2s ease-out;
  opacity: 0.8;
  &.rotate {
    transform: rotate(180deg);
  }
  @include respond-below(sm) {
    width: 1.5rem;
    height: 1.5rem;
  }
  @include mq(landscape) {
    margin: 0rem;
    width: 1rem;
    height: 1rem;
  }
}
.isDisabled {
  opacity: 0.5;
  // pointer-events: none;
  cursor: not-allowed;
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: transparent;
  }
}
</style>
