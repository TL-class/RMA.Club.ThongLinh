<template>
  <div class="password-protect">
    <NuxtImg
      v-if="thumbnail"
      :src="thumbnail"
      alt="property thumbnail"
      class="password-protect__bg"
      preload
    />
    <div class="password-protect__veil" />

    <main>
      <header>
        <NuxtImg
          v-if="brandImage"
          format="avif"
          height="48"
          width="48"
          class="thumbnail"
          :src="brandImage"
          :alt="`${propertyInfo.name} logo`"
          loading="lazy"
        />
        <div class="header-title">{{ propertyInfo.name }}</div>
      </header>

      <section>
        <p v-if="false" class="subtitle">This place is password protected</p>
        <div class="wrapper">
          <input
            ref="passwordInputRef"
            v-model="password"
            type="password"
            placeholder="Enter password"
            class="password-input"
            autocomplete="current-password"
            :disabled="isSubmittingPassword"
            @input="clearPasswordError"
            @keydown.enter="handlePasswordSubmit"
          >
        </div>
        <p v-if="passwordError" class="error">{{ passwordError }}</p>
        <button
          class="unlock-btn"
          :disabled="!password.trim() || isSubmittingPassword"
          @click="handlePasswordSubmit"
        >
          {{ isSubmittingPassword ? "Unlocking…" : "View Tour" }}
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useTourAccess } from "~/composables/useTourAccess";
const props = defineProps({
  propertyInfo: {
    type: Object,
    required: true,
  },
});

const {
  password,
  passwordError,
  isSubmittingPassword,
  handlePasswordSubmit,
  clearPasswordError,
} = useTourAccess();

const passwordInputRef = ref(null);

const thumbnail = computed(() => props.propertyInfo?.previewImage || "");

const brandImage = computed(
  () =>
    props.propertyInfo?.owner?.image ||
    props.propertyInfo?.creator?.image ||
    "",
);

onMounted(() => {
  passwordInputRef.value?.focus();
});
</script>

<style lang="scss" scoped>
.password-protect {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.password-protect__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  transform: scale(1.04);
  filter: blur(10px);
  z-index: 0;
}

.password-protect__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
}

main {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 22rem;
  padding: 1.5rem;
  background-color: #212121;
  color: #fff;
  border-radius: 1rem;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);

  @include respond-below(sm) {
    padding: 1rem;
    max-width: calc(80% - 2rem);
  }

  header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.4rem;

    img {
      max-width: 4.75rem;
      max-height: 2.75rem;
      background: #fff;
      border-radius: 4px;

      @include respond-below(sm) {
        max-height: 2.5rem;
        max-width: 5.5rem;
      }
    }

    .header-title {
      font-size: 1.2rem;
      font-weight: 600;

      @include respond-below(sm) {
        font-size: 1rem;
      }
    }
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;

    .subtitle {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .wrapper {
      input.password-input {
        width: 100%;
        box-sizing: border-box;
        background-color: #0f0f0f;
        border-radius: 0.86rem;
        padding: 0.8rem;
        font-size: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        height: 3.525rem;
        color: #fff;
        outline: none;
        font-family: inherit;
        transition: border-color 0.2s;

        &::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        &:focus {
          border-color: rgba(255, 255, 255, 0.55);
        }

        &:disabled {
          opacity: 0.6;
        }

        @include respond-below(sm) {
          padding: 0.6rem;
          font-size: 0.875rem;
        }
      }
    }

    .error {
      margin: 0;
      font-size: 0.8rem;
      color: #ff6b6b;
    }

    .unlock-btn {
      width: 100%;
      padding: 0.75rem;
      font-family: inherit;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: -0.5px;
      color: #fff;
      background-color: #0f0f0f;
      border: none;
      border-radius: 1.4rem;
      cursor: pointer;
      transition: opacity 0.2s;

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        opacity: 0.88;
      }

      @include respond-below(sm) {
        font-size: 0.875rem;
        padding: 0.65rem;
      }
    }
  }
}
</style>
