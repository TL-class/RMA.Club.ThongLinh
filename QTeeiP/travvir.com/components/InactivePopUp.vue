<template>
  <div
    class="inactive-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="inactive-title"
    :class="{ isPortrait: isPortrait }"
  >
    <div class="inactive-popup">
      <p id="inactive-title" class="inactive-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-triangle-alert-icon lucide-triangle-alert"
        >
          <path
            d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
          />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        {{ title }}
      </p>
      <p v-if="description" class="inactive-message">
        {{ description }}
      </p>
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    default: "Plan Expired",
  },
  description: {
    type: String,
    default: "",
  },
});
const isPortrait = inject("isPortrait");
</script>
<style lang="scss" scoped>
.inactive-overlay {
  font-family: $system-font;
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  // width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  // pointer-events: none;
  &.isPortrait {
    width: 100%;
    .inactive-popup {
      width: 70%;
    }
  }
}

.inactive-popup {
  width: 100%;
  max-width: 32rem;
  padding: 1.1rem 1.15rem 0.85rem;
  text-align: left;
  border-radius: 4px;
  @extend %glass;
  color: rgba(255, 255, 255, 0.9);
}

.inactive-header {
  margin-bottom: 0.85rem;
}

.inactive-brand {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.inactive-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  svg {
    color: red;
    height: 14px;
    width: 14px;
  }
}

.inactive-message {
  margin-top: 0.5rem;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.inactive-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 0.15rem;
}

.inactive-ok-btn {
  min-width: 4.5rem;
  padding: 0.35rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
