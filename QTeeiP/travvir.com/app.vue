<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import logger from "debug";
import "./assets/styles/index.scss";
import "./assets/styles/animation.scss";
import { useMiraStore } from "./store/mira";
import { useViewerStore } from "./store/viewer";
//variables

const debug = logger("travvir:debut-nuxt:app");
const isPortrait = ref(null);
const miraStore = useMiraStore();
const { $busSocket } = useNuxtApp();
const viewerStore = useViewerStore();
const headers = useRequestHeaders(["referer"]);

//head config

//provide
provide("isPortrait", isPortrait);

//methods
const updateOrientation = () => {
  if (miraStore.inputInFocus) return;
  isPortrait.value = window.innerHeight > window.innerWidth;
  viewerStore.isPortrait = isPortrait.value;
};

function checkServerOrientation() {
  if (import.meta.client) return;
  const headers = useRequestHeaders();
  const userAgent = headers["user-agent"] || "";
  const isMobile =
    /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );
  isPortrait.value = isMobile ? true : false;
  viewerStore.isPortrait = isPortrait.value;
}

function resolveRobotsIndexing() {
  if (import.meta.client) return;
  const host = useRequestHeaders().host || "";
  if (host.includes("uranus.travvir.com")) {
    useHead({
      meta: [{ name: "robots", content: "noindex, nofollow" }],
    });
  }
}

// set referer cookie
if (import.meta.server) {
  resolveRobotsIndexing();
  checkServerOrientation();
  const referer = headers.referer || "";
  const prevReferer = useCookie("visitor_referer");
  if (
    referer &&
    (!prevReferer.value || prevReferer.value.includes("travvir.com"))
  ) {
    const refererCookie = useCookie("visitor_referer", {
      maxAge: 15 * 60,
      path: "/",
    });
    refererCookie.value = referer;
  }
}

if (import.meta.client) {
  updateOrientation();
  let busSocket = $busSocket.open();
  provide("busSocket", busSocket);
}

onMounted(() => {
  debug("App mounted");

  if (window.location.hash) {
    const element = document.querySelector(window.location.hash);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "instant" });
      }, 500);
    }
  }

  const wrapper = document.getElementById("wrapper");
  if (wrapper) {
    if (isPortrait.value) {
      wrapper.classList.add("isMobile");
    } else {
      wrapper.classList.remove("isMobile");
    }
  }
  window.addEventListener("resize", updateOrientation);
  window.addEventListener("orientationchange", () => {
    miraStore.inputInFocus = false;
    updateOrientation();
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", updateOrientation);
  window.removeEventListener("orientationchange", updateOrientation);
});
</script>

<style lang="scss"></style>
