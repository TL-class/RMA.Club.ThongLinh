<template>
  <div class="private-protect">
    <NuxtImg
      v-if="thumbnail"
      :src="thumbnail"
      alt="property thumbnail"
      class="private-protect__bg"
      preload
    />
    <div class="private-protect__veil" />

    <main class="private-protect__panel">
      <div v-if="false" class="private-protect__lock" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </div>

      <header>
        <NuxtImg
          v-if="brandImage"
          format="avif"
          height="40"
          width="40"
          class="thumbnail"
          :src="brandImage"
          :alt="`${propertyInfo.name} logo`"
          loading="lazy"
        />
        <div class="header-title">{{ propertyInfo.name }}</div>
      </header>

      <section>
        <h1 class="title">This place is private</h1>
        <p class="subtitle">
          Sign in with your account to unlock and view this tour.
        </p>
        <p v-if="privateAuthError" class="error" role="alert">
          {{ privateAuthError }}
        </p>
        <button class="signin-btn" type="button" @click="handlePrivateSignIn">
          Sign in to view
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
const props = defineProps({
  propertyInfo: {
    type: Object,
    required: true,
  },
});

const { privateAuthError, handlePrivateSignIn } = useTourAccess();

const thumbnail = computed(() => props.propertyInfo?.previewImage || "");

const brandImage = computed(
  () =>
    props.propertyInfo?.owner?.image ||
    props.propertyInfo?.creator?.image ||
    "",
);
</script>

<style lang="scss" scoped>
.private-protect {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 1.25rem;
}

.private-protect__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  transform: scale(1.06);
  filter: blur(14px) saturate(0.85);
  z-index: 0;
}

.private-protect__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(
      ellipse 70% 55% at 50% 45%,
      rgba(0, 0, 0, 0.35) 0%,
      rgba(0, 0, 0, 0.72) 100%
    ),
    rgba(0, 0, 0, 0.45);
}

.private-protect__panel {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 24rem;
  padding: 2rem 1.75rem 1.75rem;
  background: rgba(18, 18, 18, 0.92);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.25rem;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
  text-align: center;
  animation: private-protect-in 0.35s ease-out;

  @include respond-below(sm) {
    padding: 1.5rem 1.15rem 1.25rem;
    max-width: calc(100% - 0.5rem);
  }
}

.private-protect__lock {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1.15rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);

  svg {
    width: 1.65rem;
    height: 1.65rem;
  }

  @include respond-below(sm) {
    width: 3rem;
    height: 3rem;
    margin-bottom: 0.95rem;

    svg {
      width: 1.4rem;
      height: 1.4rem;
    }
  }
}

header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  gap: 0.55rem;

  img {
    max-width: 4.25rem;
    max-height: 2.5rem;
    background: #fff;
    border-radius: 4px;
    object-fit: contain;
  }

  .header-title {
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.78);
    text-align: left;
    line-height: 1.3;

    @include respond-below(sm) {
      font-size: 0.9rem;
    }
  }
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;

  .title {
    margin: 0;
    font-size: 1.65rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.2;

    @include respond-below(sm) {
      font-size: 1.35rem;
    }
  }

  .subtitle {
    margin: 0;
    max-width: 20rem;
    font-size: 0.95rem;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.62);

    @include respond-below(sm) {
      font-size: 0.875rem;
    }
  }

  .error {
    margin: 0;
    width: 100%;
    padding: 0.65rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: #ffb4b4;
    background: rgba(255, 80, 80, 0.14);
    border: 1px solid rgba(255, 107, 107, 0.35);
    border-radius: 0.75rem;
  }

  .signin-btn {
    width: 100%;
    margin-top: 0.35rem;
    padding: 0.95rem 1rem;
    font-family: inherit;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: -0.02em;
    color: #111;
    background-color: #fff;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.15s;

    &:hover {
      background-color: #f0f0f0;
    }

    &:active {
      transform: scale(0.98);
    }

    @include respond-below(sm) {
      font-size: 0.95rem;
      padding: 0.85rem;
    }
  }
}

@keyframes private-protect-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
