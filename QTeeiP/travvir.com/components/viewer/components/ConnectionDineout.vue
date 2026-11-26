<template>
  <div class="hotspot link-hotspot">
    <div class="flex" @click="handleClick" @mouseover="active = true">
      <img
        src="./way.svg"
        class="link-hotspot-icon rotate-animation"
        alt="hotspot icon"
        loading="lazy"
      >
      <div class="information">
        <div class="link-name">{{ target }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  scenes: {
    type: Array,
    default: () => [],
  },
  changeListener: {
    type: Function,
    default: null,
  },
});
//variables
const active = ref(true);

//computed
const canControl = computed(() => {
  return true;
});

const targetId = computed(() => {
  return typeof props.data.target === "string"
    ? props.data.target
    : props.data.target.id;
});

const target = computed(() => {
  return props.scenes?.find((s) => s.id === targetId.value)?.name;
});

function handleClick(event, fromKeyboard = false) {
  if (!canControl.value) return;
  let payload = { target: targetId.value };
  if (props.data.target.position) {
    payload.position = {
      yaw: props.data.target.position.yaw,
      pitch: props.data.target.position.pitch,
    };
  }
  payload.keyboardEvent = !!fromKeyboard;
  props.changeListener(payload);
}
</script>

<style lang="scss" scoped>
.link-hotspot {
  position: relative;
  width: fit-content;
  height: fit-content;
  @extend %v-center;
  opacity: 0.9;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
  gap: 4px;
  @include respond-below(sm) {
    height: fit-content;
    width: fit-content;
  }
  .flex {
    //transform on x and y to center the hotspot properly by their hotspot height
    transform: translate(-21px, -21px);
    position: relative;
    display: flex;
    align-items: center;
    // justify-content: center;
    width: 120%;
    gap: 0.3rem;
    padding: 0.5rem;
    cursor: pointer;
  }
  .link-hotspot-icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
    border-radius: 50%;
    animation: pulse-custom 2s infinite;
    @include respond-below(sm) {
      height: 22px;
      width: 22px;
    }
  }
  .information {
    color: #ffff;
    -webkit-transition: -ms-transform 0.3s, -webkit-transform 0.3s,
      transform 0.3s, opacity 0.3s;
    transition: -ms-transform 0.3s, -webkit-transform 0.3s, transform 0.3s,
      opacity 0.3s;
    padding: 2px 3px;
    @include respond-below(sm) {
    }
    @include mq(landscape) {
      margin: -29px 28px;
    }
    .link-name {
      flex: 1;
      font-family: "Gilroy-bold-swiggy";
      padding: 2px 6px;
      border-radius: 4px;
      width: fit-content;
      background: rgba(0, 0, 0, 0.6);
      --webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
      font-size: 14px;
      line-height: 17px;
      @include Elipsis(350px);
      @include respond-below(sm) {
        letter-spacing: 0.3px;
      }
      @include mq(landscape) {
        letter-spacing: -0.3px;
      }
    }
  }
}
</style>
