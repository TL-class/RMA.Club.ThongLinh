<template>
  <div class="hotspot-wrapper">
    <!-- Tooltip -->
    <div
      class="tooltip-container"
      :class="{ visible: isHovered, 'video-preview': info.type === 'video' }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="tooltip-content">
        <div class="tooltip-body">
          <div v-if="['image', 'video'].includes(info.type)" class="tag-media">
            <img
              v-if="info.type === 'image'"
              src="https://images.pexels.com/photos/532568/pexels-photo-532568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
            >
            <iframe
              v-if="info.type === 'video'"
              :src="getEmbedUrl(info.value)"
              frameborder="0"
              allow="autoplay"
            />
          </div>
          <h3 v-if="info.title" class="tooltip-title">
            {{ info.title }}
          </h3>
          <p v-if="info.description" class="tooltip-description">
            {{ info.description }}
          </p>
        </div>
      </div>
      <!-- Triangle Pointer -->
      <div class="tooltip-arrow" />
    </div>

    <!-- Hotspot Chip -->
    <div
      class="hotspot-chip"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @touchmove="handleMouseEnter"
      @click="handleClick"
    >
      <div class="outer-ring">
        <div class="inner-dot" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports
import { ref } from "vue";
import { useViewerStore } from "~/store/viewer";

// Props
defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});

// State
const isHovered = ref(false);
const viewerStore = useViewerStore();

const handleMouseEnter = () => {
  isHovered.value = true;
  if (viewerStore.viewer) {
    viewerStore.viewer.stopMovement();
    viewerStore.viewer.setIdleMovement(Infinity);
  }
};

const handleMouseLeave = () => {
  isHovered.value = false;
  if (viewerStore.viewer) {
    viewerStore.viewer.setIdleMovement(5000, viewerStore.autorotate);
  }
};

function getEmbedUrl(url) {
  const regExp = /v=([^&]+)/;
  const match = url.match(regExp);
  return match
    ? `https://www.youtube.com/embed/${match[1]}?&mute=1&loop=1&playlist=${match[1]}`
    : "";
}

const handleClick = () => {
  // Toggle tooltip on click (for mobile)
  isHovered.value = !isHovered.value;
};
</script>

<style scoped lang="scss">
.hotspot-wrapper {
  position: absolute; /* Assuming parent positions this */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1; /* Default z-index for all hotspots */
  /* Ensure clicks pass through if not hitting the interactive parts */
  /* pointer-events: none; */

  /* Elevate entire wrapper when tooltip is visible */
  &:has(.tooltip-container.visible) {
    z-index: 3000;
  }
}

/* Hotspot Chip Styling */
.hotspot-chip {
  position: relative;
  width: 32px;
  height: 32px;
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  .outer-ring {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    /* Pulsing animation */
    animation: pulse 2s infinite;
  }

  .inner-dot {
    width: 22px;
    height: 22px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 3px solid rgba(255, 255, 255, 1); /* Bright border for contrast */
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    transform: scale(1.1);
  }
}

/* Tooltip Styling */
.tooltip-container {
  position: absolute;
  left: 100%; /* Position to the right of the chip */
  margin-left: 6px; /* Gap for the arrow */
  top: 50%;
  transform: translateY(-50%) translateX(-10px);
  width: fit-content;
  min-width: 338px;
  max-width: 481px;

  color: white;
  border-radius: 8px;
  padding: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none; /* Ignore events when hidden */
  z-index: 100;
  &.video-preview {
    max-width: 540px;
    min-width: 390px;
    @include respond-below(sm) {
      min-width: 280px;
    }
  }

  @include respond-below(sm) {
    min-width: 250px;
  }

  &.visible {
    opacity: 1;
    visibility: visible;
    z-index: 100;
    transform: translateY(-50%) translateX(0);
    pointer-events: auto;
  }
}

.tooltip-content {
  padding: 16px;
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 8px;
}

.tooltip-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 8px;
}

.tooltip-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.tooltip-description {
  margin-top: 0.5rem;
}

.tooltip-actions {
  display: flex;
  gap: 8px;
}

.action-icon {
  color: #a0a0a0;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
}

.tooltip-body {
  font-size: 14px;
  line-height: 1.4;
  color: #d0d0d0;
}

.tag-media {
  height: 240px;
  margin-bottom: 0.7rem;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  iframe {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
}

.link {
  margin-block: 0.6rem;
  width: 100%;
  button {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    gap: 0.4rem;
    align-items: center;
    transition: all 0.3s ease;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    svg {
      opacity: 0.5;
    }
  }
}

/* Arrow */
.tooltip-arrow {
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>
