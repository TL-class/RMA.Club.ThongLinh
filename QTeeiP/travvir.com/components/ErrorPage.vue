<template>
  <div class="error-page">
    <div v-if="!hideLogo" class="logo" @click="goToHomePage">Travvir</div>
    <div class="half-moon">
      <p class="error-code">{{ error.statusCode }}</p>
      <p class="error-message">{{ error.message }}</p>
      <button @click="goToHomePage">Back to Home</button>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({
      statusCode: 404,
      message: "Page not found!",
    }),
  },
  hideLogo: {
    type: Boolean,
    default: false,
  },
});
const goToHomePage = () => clearError({ redirect: "/" });

useHead({
  title: `${props.error.statusCode} — Page Not Found | Travvir`,
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>
<style lang="scss" scoped>
.error-page {
  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: aliceblue;
  overflow: hidden;
  .logo {
    position: absolute;
    left: 1%;
    top: 1%;
    font-size: 2.4rem;
    font-weight: 600;
  }
  .half-moon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 800px;
    width: 800px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    box-shadow:
      rgba(255, 255, 255, 0.25) 0px 60px 120px -24px inset,
      rgba(0, 0, 0, 0.3) 0px 36px 72px -36px inset;
    @include respond-below(sm) {
      height: 400px;
      width: 400px;
    }
    .error-code {
      margin-top: 4rem;
      font-size: 21rem;
      font-weight: 700;
      color: gray;
      line-height: normal;
      background: inear-gradient(
        35.95deg,
        hsla(0, 0%, 100%, 0.02) 21.76%,
        hsla(0, 0%, 100%, 0.1) 80.12%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: rgba(255, 255, 255, 0.4);
      background-clip: text;
      line-height: normal;
      @include respond-below(sm) {
        font-size: 10rem;
      }
    }
    .error-message {
      margin-top: -19rem;
      font-size: 4.2rem;
      opacity: 0.6;
      line-height: normal;
      letter-spacing: -0.2px;
      @include respond-below(sm) {
        font-size: 1.7rem;
        margin-top: -7rem;
      }
    }
    button {
      z-index: 2;
      margin-top: -10rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      outline: none;
      background: transparent;
      color: aliceblue;
      font-size: 1rem;
      font-weight: 500;
      padding: 0.9rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      background: linear-gradient(
        35.95deg,
        hsla(0, 0%, 100%, 0.05) 21.76%,
        hsla(0, 0%, 100%, 0) 80.12%
      );
      &:hover {
        transition: 0.5s ease-in-out;
        background: linear-gradient(
          35.95deg,
          hsla(0, 0%, 100%, 0.05) 21.76%,
          hsla(0, 0%, 100%, 0) 80.12%
        );
        box-shadow: 0 0 3px 0 #fff;
      }
      @include respond-below(sm) {
        margin-top: -5rem;
        font-size: 0.8rem;
        padding: 0.6rem 1rem;
      }
    }
  }
}
</style>
