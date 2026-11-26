<template>
  <Embedview />
</template>
<script setup>
const Embedview = defineAsyncComponent(
  () => import("~/components/embedview/index.vue"),
);
definePageMeta({
  layout: "custom",
});
useHead({
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>
