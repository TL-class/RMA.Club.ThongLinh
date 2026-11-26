<script setup>
import { useSceneStore } from "~/store/scene";
import { useViewerStore } from "~/store/viewer";
import { usePropertyStore } from "~/store/property";
import NoSceneFound from "~/components/NoSceneFound.vue";
import ErrorPage from "~/components/ErrorPage.vue";
import QualityDropdown from "../actionQualityController/QualityDropdown.vue";
import PasswordProtect from "~/components/detailview/PasswordProtect.vue";
import PrivateProtect from "~/components/detailview/PrivateProtect.vue";

const ActionBar = defineAsyncComponent(
  () => import("~/components/actionBar/index.vue"),
);

const isPortrait = inject("isPortrait");
const route = useRoute();
const sceneStore = useSceneStore();
const viewerStore = useViewerStore();
const { $busSocket } = useNuxtApp();
const propertyStore = usePropertyStore();
const { isPlacePasswordProtected, isPlacePrivateProtected, initTourAccess } =
  useTourAccess();

const propertyNotFound = ref(false);
const embedErrorMessage = ref(
  "This embed link is invalid or the place no longer exists.",
);

const propertyId = computed(() => {
  const value = route.params.propertyId;
  return Array.isArray(value) ? value[0] || "" : value || "";
});

function isEmbeddedQuery() {
  const embedded = String(route.query.embedded || "").toLowerCase();
  return embedded === "1" || embedded === "true";
}

const isEmbedRequest = ref(isEmbeddedQuery());

function detectIframeEmbed() {
  try {
    return window.self !== window.top;
  } catch {
    return false;
  }
}

function getHostEmbedMsg() {
  const raw = route.query.msg;
  if (!raw) return {};

  try {
    return JSON.parse(decodeURIComponent(String(raw)));
  } catch {
    try {
      return JSON.parse(String(raw));
    } catch {
      return { raw: String(raw) };
    }
  }
}

function getEmbedMetadata() {
  const msg = getHostEmbedMsg();
  return {
    referer: msg.referer || "",
    location: msg.location || "",
    userAgent: msg.userAgent || navigator.userAgent || "",
  };
}

function buildEmbedInitMsg() {
  const hostMsg = getHostEmbedMsg();
  const msg = {
    ...hostMsg,
    propertyId: propertyId.value || "",
    propertyName: propertyStore.propertyInfo?.name || "",
    propertyValid: !propertyNotFound.value,
  };

  if (hostMsg.status === "NO_TARGET") {
    return msg;
  }

  if (!propertyId.value) {
    msg.status = "INVALID_PROPERTY";
    msg.error = embedErrorMessage.value;
  } else if (propertyNotFound.value) {
    msg.status = "PROPERTY_NOT_FOUND";
    msg.error = embedErrorMessage.value;
  } else if (!msg.status) {
    msg.status = "LOADED";
  }

  return msg;
}

function setMissingPropertyError() {
  propertyNotFound.value = true;
  embedErrorMessage.value = "Property ID is missing.";
}

if (propertyId.value) {
  const result = await propertyStore.getProperty(propertyId.value, {
    softFail: true,
  });
  propertyNotFound.value = Boolean(result?.notFound || result?.error);
  if (result?.notFound) {
    embedErrorMessage.value = "Property not found";
  } else if (result?.error) {
    embedErrorMessage.value = "Unable to load this place right now.";
  }
} else if (isEmbedRequest.value) {
  setMissingPropertyError();
}

onMounted(async () => {
  if (!isEmbedRequest.value) {
    isEmbedRequest.value = detectIframeEmbed();
  }

  if (!propertyId.value && isEmbedRequest.value) {
    setMissingPropertyError();
  }

  if (isEmbedRequest.value) {
    $busSocket.sendView(
      propertyId.value || "",
      propertyStore.propertyInfo?.name || "",
      getEmbedMetadata(),
    );
  } else if (propertyId.value) {
    $busSocket.sendView(
      propertyId.value,
      propertyStore.propertyInfo?.name || "",
    );
  }
  $busSocket.sendEvent({
    name: isEmbedRequest.value
      ? "EMBED_SCRIPT_INITIALIZED"
      : "EMBED_INITIALIZED",
    propertyId: propertyId.value,
    propertyName: propertyStore.propertyInfo?.name,
    propertyOwnerName: propertyStore.propertyInfo?.owner?.name,
    embedMetadata: getEmbedMetadata(),
    msg: buildEmbedInitMsg(),
  });

  if (propertyId.value && !propertyNotFound.value) {
    await initTourAccess(propertyId.value);
    viewerStore.setIsReady(true);
  }
});
</script>

<template>
  <ErrorPage
    v-if="propertyNotFound"
    :hide-logo="isEmbedRequest"
    :error="{
      statusCode: 404,
      message: embedErrorMessage,
    }"
  />
  <template v-else>
    <NuxtImg
      v-if="!viewerStore.marzipanoReady"
      v-show="propertyStore.propertyInfo?.previewImage"
      :src="propertyStore.propertyInfo?.previewImage"
      alt="property thumbnail"
      class="property-thumbnail"
      preload
    />
    <div class="embed-viewer-wrap">
      <Viewer :in-focus="true" />
    </div>
    <NoSceneFound v-if="sceneStore.noSceneFound" />
    <div v-if="viewerStore.marzipanoReady && !sceneStore.noSceneFound">
      <component
        :is="propertyStore.isEmbedActive ? ActionBar : null"
        :is-embed-request="isEmbedRequest"
        :is-portrait="isPortrait"
      />
      <div class="action-overlay">
        <ClientInfo />
      </div>

      <EmbedPanoWatermark v-if="!propertyStore.isEmbedActive" />
      <InactivePopUp
        v-if="!propertyStore.isEmbedActive"
        title="Plan Expired"
        description="Please upgrade your plan to embed this place"
      />
    </div>
    <PasswordProtect
      v-if="isPlacePasswordProtected"
      :property-info="propertyStore.propertyInfo"
    />
    <Transition name="quality-right">
      <QualityDropdown
        v-if="viewerStore.isToggleQuality"
        :custom="true"
        class="quality-dropdwon"
      />
    </Transition>
    <PrivateProtect
      v-if="isPlacePrivateProtected"
      :property-info="propertyStore.propertyInfo"
    />
  </template>
</template>
<style lang="scss" scoped>
.embed-viewer-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.action-overlay {
  position: absolute;
  bottom: 2%;
  height: fit-content;
  left: 0;
  right: 0;
  padding-left: 0.4rem;
}
.property-thumbnail {
  position: absolute;
  height: 100vh;
  width: 100vw;
  object-fit: cover;
  border-radius: 0px;
}

.quality-dropdwon {
  bottom: unset;
  top: 4rem;
  right: 1rem;
  @include respond-below(sm) {
    right: 1rem;
    top: 3rem;
  }
}

.quality-right-enter-active,
.quality-right-leave-active {
  position: fixed;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.quality-right-enter-from,
.quality-right-leave-to {
  opacity: 0;
  bottom: unset;
  top: 4rem;
  @include respond-below(sm) {
    top: 3rem;
  }
  transform: translateX(20px);
}
.quality-right-enter-to,
.quality-right-leave-from {
  opacity: 1;
  bottom: unset;
  top: 4rem;
  @include respond-below(sm) {
    top: 3rem;
  }
  transform: translateX(0);
}
</style>
