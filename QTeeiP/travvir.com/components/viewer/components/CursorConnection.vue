<template>
  <div class="cursor-connection">
    <svg
      v-if="!isMe"
      width="18"
      height="18"
      viewBox="0 0 25 25"
      :fill="color"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g :clip-path="`url(#${uid})`">
        <path
          d="M4.07401 24.7337L4.0731 24.7334C3.96576 24.6936 3.89563 24.5923 3.89563 24.4793V0.520937C3.89563 0.411534 3.96186 0.312498 4.06249 0.270941C4.16623 0.228545 4.28168 0.252192 4.35845 0.328963L21.0245 16.995C21.0246 16.9951 21.0247 16.9952 21.0247 16.9953C21.1032 17.0744 21.1255 17.19 21.0836 17.2904L21.0832 17.2914C21.0417 17.3921 20.9426 17.4585 20.8331 17.4585H10.656H10.5411L10.4662 17.5457L4.37145 24.6551L4.37075 24.656C4.31939 24.7164 4.24388 24.7501 4.16648 24.7501C4.13444 24.7501 4.10288 24.7446 4.07401 24.7337Z"
          stroke="white"
          stroke-width="0.5"
        />
      </g>
      <defs>
        <clipPath :id="uid">
          <rect width="25" height="25" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <span class="cursor-label" :style="getNametagColor" :class="{ isMe: isMe }">
      {{ name }}
      <p
        v-if="isPresenter"
        class="presenter-badge"
        :class="{ 'me-presenter': isMe }"
      >
        Host
      </p>
    </span>
  </div>
</template>

<script setup>
import { useViewerStore } from "~/store/viewer";
const uid = `cursor-clip-${getCurrentInstance().uid}`;
const props = defineProps({
  name: { type: String, required: true },
  color: { type: String, default: "#309ef2" },
  isMe: { type: Boolean, default: false },
  userId: { type: String, required: true },
});

const getNametagColor = computed(() => {
  let bgColor = props.isMe ? "rgba(0,0,0,0.48)" : props.color;
  let mTop = props.isMe ? "0.925rem" : "-0.375rem";
  return {
    backgroundColor: bgColor,
    marginTop: mTop,
  };
});
const isPresenter = computed(() => {
  const viewerStore = useViewerStore();
  return props.userId === viewerStore.conferencePresenterId;
});
</script>

<style scoped lang="scss">
.cursor-connection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  pointer-events: none;
}
.cursor-label {
  font-size: 0.75rem;
  color: #fff;
  padding: 0.25rem 0.3rem;
  border-radius: 0.2rem;
  text-transform: capitalize;
  white-space: nowrap;
  display: flex;
  gap: 0.25rem;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 6.25rem;
  margin-top: -0.375rem;
  margin-left: 0.625rem;
}
.isMe {
  // border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  display: flex;
  padding: 0.25rem 0.55rem;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  transform: translateX(5px);
  // margin-right: 1.4rem;
  -webkit-backdrop-filter: blur(12px);
}

.you-badge,
.presenter-badge {
  flex-shrink: 0;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.04em;
  padding: 0.05rem 0.15rem;
  margin-left: auto;
  border-radius: 0.25rem;
}

.you-badge {
  color: rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.08);
}

.me-presenter {
  color: rgba(255, 255, 255, 0.45) !important;
  background: rgba(255, 255, 255, 0.14) !important;
}

.presenter-badge {
  color: rgba(255, 255, 255, 0.75);
  line-height: normal;
  font-size: 0.6rem;
  background: rgba(255, 255, 255, 0.3);
}
</style>
