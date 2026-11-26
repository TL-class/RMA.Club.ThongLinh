<template>
  <div
    v-if="info.type == 'REGULAR'"
    class="hotspot info-hotspot"
    :class="{ visible: active, mobile: $device.isMobile }"
    @click="active = !active"
  >
    <div class="info-hotspot-header">
      <div class="info-hotspot-icon-wrapper">
        <img
          :src="connectionIcon"
          class="info-hotspot-icon link-hotspot-icon rotate-animation"
          alt="way connection"
          loading="lazy"
        >
      </div>
      <div class="info-hotspot-title-wrapper">
        <div class="info-hotspot-title">{{ info.title }}</div>
      </div>
      <div class="info-hotspot-close-wrapper">
        <img
          :src="cross"
          class="info-hotspot-close-icon"
          alt="cross"
          loading="lazy"
        >
      </div>
    </div>
    <div class="info-hotspot-text" v-text="info.text"/>
  </div>
  <NameTag v-else :info="info" />
</template>

<script setup>
const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
  clickListener: {
    type: Function,
    default: null,
  },
  config: {
    type: Object,
    required: true,
  },
});

//variables
const active = ref(false);

const connectionIcon = `${props.config.public.NUXT_CDN_URL}/static/images/new-hotspot.svg`;
const cross = `${props.config.public.NUXT_CDN_URL}/static/images/redcross.svg`;
</script>

<style lang="scss" scoped>
.link-hotspot-icon {
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 50%;
  animation: pulse-custom 2s infinite;
}
.link-hotspot {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: -0.5rem;
  margin-top: -0.25rem;
  opacity: 0.9;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;

  .link-hotspot-tooltip {
    position: absolute;
    left: 100%;
    left: 120%;
    top: 1.37rem;
    /* ( 60 - (16 + 2*8) ) / 2 */
    margin-left: 0.1875rem;
    font-size: 1rem;
    max-width: 18.75rem;
    padding: 0.5rem 0.675rem;
    border-radius: 5px;

    color: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    pointer-events: none;
    opacity: 1;
    -ms-transform: translateX(-0.5rem);
    -webkit-transform: translateX(-0.5rem);
    transform: translateX(-0.5rem);
    -webkit-transition: -ms-transform 0.3s, -webkit-transform 0.3s,
      transform 0.3s, opacity 0.3s;
    transition: -ms-transform 0.3s, -webkit-transform 0.3s, transform 0.3s,
      opacity 0.3s;
    font-family: $theme-font;
    border-radius: 1rem;
  }

  .annot-msg {
    margin: -0.5rem -0.675rem;
    padding: 0.5rem 0.675rem;
    border-radius: 8px;
    background-color: rgba(80, 50, 145, 0.35);
    color: #fff;
    font-size: 0.75rem;
    line-height: 1.2;
    font-weight: 400;
    .bold {
      font-weight: 600;
      text-decoration: unset;
      font-size: 1rem;
    }
    span {
      text-decoration: underline;
    }
  }
  // Touch Devices
  @media (hover: none) {
    opacity: 1;
    .link-hotspot-tooltip {
      pointer-events: all;
      opacity: 1;
      top: 1.87rem;
      left: 50%;
      margin: 0;
      transform: translateX(-50%);
      padding: 0.25rem 0.675rem;
      font-size: 0.75rem;
      border-radius: 1rem;
    }
  }
}

.info-hotspot {
  line-height: 1.2em;
  opacity: 0.9;
  -webkit-transition: opacity 0.2s 0.2s;
  transition: opacity 0.2s 0.2s;
  .info-hotspot-header {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 20px;
    font-family: $theme-font;
    color: #000;
    // background-color: rgb(103, 115, 131);
    // background-color: #fff;
    cursor: pointer;
    -webkit-transition: width 0.3s ease-in-out 0.5s,
      border-radius 0.3s ease-in-out 0.5s;
    transition: width 0.3s ease-in-out 0.5s, border-radius 0.3s ease-in-out 0.5s;
    .info-hotspot-title-wrapper {
      visibility: hidden;
    }
    @media (hover: hover) {
      &:hover {
        width: 16.25rem;
        border-radius: 5px;
        -webkit-transition: width 0.3s ease-in-out,
          border-radius 0.3s ease-in-out;
        transition: width 0.3s ease-in-out, border-radius 0.3s ease-in-out;
        background-color: #ffffff;
        .info-hotspot-title-wrapper {
          visibility: visible;
          width: 13.75rem;
          padding: 0 0.3125rem;
          -webkit-transition: width 0s 0.4s, padding 0s 0.4s;
          transition: width 0s 0.4s, padding 0s 0.4s;
        }
      }
    }
  }
  .info-hotspot-icon-wrapper {
    width: 1.87rem;
    height: 1.87rem;
  }
  .info-hotspot-icon {
    width: 90%;
    height: 90%;
    margin: 5%;
    margin-top: 0.625rem;
    margin-left: 0.625rem;
  }
  .info-hotspot-title-wrapper {
    position: absolute;
    left: 2.5rem;
    top: 0;
    width: 0;
    height: 2.5rem;
    padding: 0;
    overflow: hidden;
    -webkit-transition: width 0s 0.4s, padding 0s 0.4s;
    transition: width 0s 0.4s, padding 0s 0.4s;
    &:before {
      content: "";
      display: inline-block;
      vertical-align: middle;
      height: 100%;
    }
  }
  .info-hotspot-title {
    display: inline-block;
    vertical-align: middle;
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    span {
      font-size: 1.125rem !important;
      line-height: unset !important;
      font-family: unset !important;
      color: #309ef2;
      font-weight: 500;
    }
  }
  .info-hotspot-close-wrapper {
    display: none;
    position: absolute;
    left: 16.25rem;
    top: 0;
    height: 2.5rem;
    width: 2.5rem;
    border-top-right-radius: 5px;
    background-color: #fff;
    visibility: hidden;
    -ms-transform: perspective(12.5rem) rotateY(90deg);
    -webkit-transform: perspective(12.5rem) rotateY(90deg);
    transform: perspective(12.5rem) rotateY(90deg);
    -ms-transform-origin: 0 50% 0;
    -webkit-transform-origin: 0 50% 0;
    transform-origin: 0 50% 0;
    -webkit-transition: -ms-transform 0.3s 0.3s, -webkit-transform 0.3s 0.3s,
      transform 0.3s 0.3s, visibility 0s 0.6s;
    transition: -ms-transform 0.3s 0.3s, -webkit-transform 0.3s 0.3s,
      transform 0.3s 0.3s, visibility 0s 0.6s;
  }
  .info-hotspot-close-icon {
    width: 35%;
    // height: 70%;
    margin: 30%;
  }
  .info-hotspot-text {
    font-family: $theme-font;
    position: absolute;
    width: 18.75rem;
    height: auto;
    max-height: 12.5rem;
    top: 2.5rem;
    left: 0;
    padding: 0.625rem;
    // background-color: rgb(58, 68, 84);
    background-color: #f2f6fa;
    color: rgba(#000000, 0.8);
    font-size: 1rem;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow-y: auto;
    visibility: hidden;
    -ms-transform: perspective(12.5rem) rotateX(-89.999deg);
    -webkit-transform: perspective(12.5rem) rotateX(-89.999deg);
    transform: perspective(12.5rem) rotateX(-89.999deg);
    -ms-transform-origin: 50% 0 0;
    -webkit-transform-origin: 50% 0 0;
    transform-origin: 50% 0 0;
    -webkit-transition: -ms-transform 0.3s, -webkit-transform 0.3s,
      transform 0.3s, visibility 0s 0.3s;
    transition: -ms-transform 0.3s, -webkit-transform 0.3s, transform 0.3s,
      visibility 0s 0.3s;
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
    span {
      font-size: 0.875rem !important;
      line-height: unset !important;
      font-family: unset !important;
    }
  }
  // Click/touch class added
  &.visible {
    opacity: 1;
    .info-hotspot-header {
      width: 16.43rem !important;
      border-radius: 5px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      -webkit-transition: width 0.3s ease-in-out, border-radius 0.3s ease-in-out;
      transition: width 0.3s ease-in-out, border-radius 0.3s ease-in-out;
      background-color: #ffffff;
      // &:hover {
      //   width: 16.25rem;
      //   border-radius: 5px;
      //   border-top-right-radius: 0;
      //   border-bottom-right-radius: 0;
      //   border-bottom-left-radius: 0;
      //   -webkit-transition: width 0.3s ease-in-out,
      //     border-radius 0.3s ease-in-out;
      //   transition: width 0.3s ease-in-out, border-radius 0.3s ease-in-out;
      // }
    }
    .info-hotspot-title-wrapper {
      visibility: visible;
      width: 13.75rem;
      padding: 0 0.3125rem;
      -webkit-transition: width 0s 0.4s, padding 0s 0.4s;
      transition: width 0s 0.4s, padding 0s 0.4s;
    }
    .info-hotspot-close-wrapper {
      display: block;
      visibility: visible;
      -ms-transform: perspective(12.5rem) rotateY(0deg);
      -webkit-transform: perspective(12.5rem) rotateY(0deg);
      transform: perspective(12.5rem) rotateY(0deg);
      -webkit-transition: -ms-transform 0.3s, -webkit-transform 0.3s,
        transform 0.3s, visibility 0s 0s;
      transition: -ms-transform 0.3s, -webkit-transform 0.3s, transform 0.3s,
        visibility 0s 0s;
    }
    .info-hotspot-text {
      width: 17.5rem;
      visibility: visible;
      -ms-transform: perspective(12.5rem) rotateX(0deg);
      -webkit-transform: perspective(12.5rem) rotateX(0deg);
      transform: perspective(12.5rem) rotateX(0deg);
      -webkit-transition: -ms-transform 0.3s 0.3s, -webkit-transform 0.3s 0.3s,
        transform 0.3s 0.3s, visibility 0s 0s;
      transition: -ms-transform 0.3s 0.3s, -webkit-transform 0.3s 0.3s,
        transform 0.3s 0.3s, visibility 0s 0s;
      @include custom-scroll-bar();
      // }

      // @include mq(landscape) {
      //   .info-hotspot-header {
      //     width: 12.5rem !important;
      //     display: flex;
      //     align-items: center;
      //   }
      //   .info-hotspot-title-wrapper {
      //     width: 180px !important;
      //     padding: 0;
      //     height: 100%;
      //   }

      //   .info-hotspot-icon-wrapper {
      //     width: 1.87rem;
      //     height: 1.87rem;
      //     margin-left: 0.3rem;
      //     .info-hotspot-icon {
      //       width: 80%;
      //       height: 80%;
      //     }
      //   }

      .info-hotspot-close-wrapper {
        left: 11.25rem;
        display: flex;
        height: 1.87rem;
      }
      .info-hotspot-text {
        width: 13.75rem;
        top: unset;
      }
      .info-hotspot-close-icon {
        margin: auto;
      }
    }
  }
  // Only For show-title
  &.show-title {
    .info-hotspot-header {
      width: 16.25rem;
      border-radius: 5px;
      -webkit-transition: width 0.3s ease-in-out, border-radius 0.3s ease-in-out;
      transition: width 0.3s ease-in-out, border-radius 0.3s ease-in-out;
      background-color: #ffffff;
      .info-hotspot-title-wrapper {
        visibility: visible;
        width: 13.75rem;
        padding: 0 0.3125rem;
        -webkit-transition: width 0s 0.4s, padding 0s 0.4s;
        transition: width 0s 0.4s, padding 0s 0.4s;
      }
    }
    @include mq(landscape) {
      .info-hotspot-header {
        width: 11.5rem !important;
        display: flex;
        align-items: center;
        .info-hotspot-icon-wrapper {
          width: 1.87rem;
          height: 1.87rem;
          margin-left: 0.3rem;
          .info-hotspot-icon {
            width: 80%;
            height: 80%;
          }
        }
        .info-hotspot-title-wrapper {
          width: 12.5rem !important;
          padding: 0;
          height: 100%;
        }
      }
    }
  }
  @include mq(landscape) {
    .info-hotspot-header {
      display: flex;
      align-items: center;
      height: unset;
    }
    .info-hotspot-icon-wrapper {
      width: 1.87rem;
      height: 1.87rem;
      margin-left: 0.3rem;
    }
    .info-hotspot-text {
      width: 13.75rem;
    }
  }
}
// Tag Style
::v-deep .hotspot.info-hotspot-tag {
  .tag {
    // display: flex;
    // align-items: center;
    // flex-direction: column;
    position: absolute;
    width: 3.125rem;
    @media (hover: hover) {
      &:hover .info-marker:hover + span {
        opacity: 1;
      }
    }
  }
  .info-marker {
    width: 1.87rem;
    cursor: pointer;
    @include mq(landscape) {
      position: absolute;
      margin-top: -1.2rem;
      width: 1.25rem;
    }
  }
  span {
    opacity: 0;
    color: rgb(255 255 255);
    white-space: nowrap;
    text-transform: capitalize;
    font-weight: 300;
    border-radius: 8px;
    border: 2px solid rgba($color: #503291, $alpha: 0.8);
    padding: 0.2rem 0.6rem;
    margin-top: 1rem;
    margin-left: 1.5rem;
    font-size: 1rem;
    background: rgba($color: #000000, $alpha: 0.3);
    transition: all 0.2s ease-out;
    // position: relative;
    // left: 60px;
    // top: -14px;
    @include mq(landscape) {
      font-size: 0.75rem;
      margin-top: 0;
    }
  }
  &.show-title,
  &.visible {
    span {
      opacity: 1;
    }
  }
}
</style>
