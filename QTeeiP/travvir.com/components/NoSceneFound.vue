<template>
  <div class="no-scene-page">
    <div v-if="isPortrait" class="nav">
      <NuxtLink to="/" class="logo" external aria-label="go to home"
        >Travvir</NuxtLink
      >
    </div>
    <div class="scene-container">
      <div class="content">
        <!-- <h1 class="scene-code">360°</h1> -->
        <p class="scene-message">No Scan Available</p>
        <p class="scene-description">
          Create your first 360° scan using our mobile app.
        </p>

        <div class="app-links-container">
          <a
            href="https://play.google.com/store/apps/details?id=com.travvir.studio"
            class="app-link"
            target="_blank"
            aria-label="Download from Google Play Store"
          >
            <NuxtImg
              src="https://d19e0oo8ox6zs5.cloudfront.net/static/images/play-store.png"
              alt="Google Play Store"
              class="play-store-img"
              width="135"
              height="40"
            />
          </a>
          <a
            href="https://apps.apple.com/in/app/travvir-360-views-from-phone/id6443536819"
            class="app-link"
            target="_blank"
            aria-label="Download from App Store"
          >
            <NuxtImg
              src="https://d19e0oo8ox6zs5.cloudfront.net/static/images/AppStore.png"
              alt="Apple App Store"
              class="app-store-img"
              width="135"
              height="40"
            />
          </a>
        </div>
        <a v-if="false" href="/" class="action-button" @click="goBack">
          <span class="button-text">Go Back</span>
          <!-- <div class="button-glow"></div> -->
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const isPortrait = inject("isPortrait");
</script>

<style lang="scss" scoped>
.no-scene-page {
  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  color: aliceblue;
  overflow: hidden;
  width: 100%;
  box-shadow: rgba(255, 255, 255, 0.1) 0px 7px 29px 0px;
  border-radius: 8px;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.02) 0%,
    transparent 50%
  );
  .nav {
    position: absolute;
    top: 2%;
    left: 3%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .logo {
      color: white;
      text-decoration: none;
      @extend %v-center;
      text-decoration: none;
      height: auto;
      letter-spacing: -0.02rem;
      font-size: 1.8rem;
      font-weight: 600;
      background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }

      @include respond-below(sm) {
        font-size: 1.4rem;
        font-weight: 600;
      }
    }
  }
  .scene-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 600px;
    z-index: 2;

    .scene-icon {
      margin-bottom: 3rem;
      position: relative;

      .sphere {
        position: relative;
        width: 200px;
        height: 200px;
        margin: 0 auto;

        @include respond-below(sm) {
          width: 150px;
          height: 150px;
        }

        .sphere-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.02) 50%,
            rgba(0, 0, 0, 0.1) 100%
          );
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow:
            inset 0 0 40px rgba(255, 255, 255, 0.1),
            0 0 60px rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;

          &::before {
            content: "";
            position: absolute;
            top: 20%;
            left: 20%;
            width: 30%;
            height: 30%;
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.3) 0%,
              transparent 70%
            );
            animation: float 3s ease-in-out infinite;
          }
        }

        .sphere-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;

          .ring {
            position: absolute;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            animation: rotate 20s linear infinite;

            &.ring-1 {
              width: 120%;
              height: 120%;
              top: -10%;
              left: -10%;
              animation-duration: 25s;
            }

            &.ring-2 {
              width: 140%;
              height: 140%;
              top: -20%;
              left: -20%;
              animation-duration: 30s;
              animation-direction: reverse;
            }

            &.ring-3 {
              width: 160%;
              height: 160%;
              top: -30%;
              left: -30%;
              animation-duration: 35s;
              opacity: 0.5;
            }
          }
        }
      }
    }

    .content {
      .scene-code {
        font-size: 8rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.8) 0%,
          rgba(255, 255, 255, 0.3) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
        line-height: 1;

        @include respond-below(sm) {
          font-size: 4rem;
        }
      }

      .scene-message {
        font-size: 2.5rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        opacity: 0.9;
        letter-spacing: -0.5px;

        @include respond-below(sm) {
          font-size: 1.8rem;
        }
      }

      .scene-description {
        font-size: 1.1rem;
        opacity: 0.6;
        margin: 0 0 1rem 0;
        line-height: 1.5;
        max-width: 400px;

        @include respond-below(sm) {
          font-size: 1rem;
          margin: 0 0 2rem 0;
        }
      }

      .app-links-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.1rem;
      }

      .app-link {
        opacity: 0.8;
        transition: all 200ms;
        &:hover {
          opacity: 1;
          transform: scale(1.05);
        }
      }

      .play-store-img {
        height: 37.9px;
        object-fit: contain;
        filter: brightness(1.1);
      }

      .app-store-img {
        height: 2.5rem; /* 40px */
        object-fit: contain;
        filter: brightness(1.1);
      }

      .action-button {
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.25);
        outline: none;
        background: transparent;
        color: aliceblue;
        font-size: 1rem;
        font-weight: 600;
        padding: 1rem 2rem;
        border-radius: 50px;
        cursor: pointer;
        text-decoration: none;
        overflow: hidden;
        transition: all 0.3s ease;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.08) 0%,
          rgba(255, 255, 255, 0.02) 100%
        );

        .button-text {
          color: inherit;
          text-decoration: none;
          position: relative;
          z-index: 2;
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow:
            0 10px 25px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);

          .button-glow {
            left: 100%;
          }
        }

        &:active {
          transform: translateY(0);
        }

        @include respond-below(sm) {
          font-size: 0.9rem;
          padding: 0.8rem 1.5rem;
        }
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px);
    opacity: 0.6;
  }
}
</style>
