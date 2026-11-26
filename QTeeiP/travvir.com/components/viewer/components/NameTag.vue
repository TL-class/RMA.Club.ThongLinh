<template>
  <div class="newSpot">
    <p class="link-hotspot-tooltip">
      {{ info.title }}
    </p>
    <div class="vertical-bar" :style="barStyle"/>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
  clickListener: {
    type: Function,
    default: null,
  },
});

const calculateHeight = (radian) => {
  const clampedRadian = Math.max(0, Math.min(1.5, radian));
  const minHeight = 1;
  const maxHeight = 5;
  const maxRadian = 1.5;

  const height =
    minHeight + (clampedRadian / maxRadian) * (maxHeight - minHeight);
  return height;
};

const barStyle = computed(() => {
  if (props.info.distance !== undefined) {
    const height = calculateHeight(props.info.distance);
    return {
      height: `${height}rem`,
    };
  }
  return {
    height: "5rem",
  };
});
</script>

<style lang="scss" scoped>
.newSpot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.link-hotspot-tooltip {
  position: absolute;
  background: rgba($color: #000, $alpha: 0.6);
  font-size: 0.9rem;
  max-width: 18.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 5px;
  margin-left: 0.75rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  opacity: 1;
  -ms-transform: translate(-60%, -51px);
  -webkit-transform: translate(-60%, -51px);
  transform: translate(-60%, -51px);
  -webkit-transition: -ms-transform 0.3s, -webkit-transform 0.3s, transform 0.3s,
    opacity 0.3s;
  transition: -ms-transform 0.3s, -webkit-transform 0.3s, transform 0.3s,
    opacity 0.3s;
  border-radius: 1rem;
}
.vertical-bar {
  transform: translateY(-30px);
  width: 0.125rem;
  background: #fff;
  margin: auto;
}
</style>
