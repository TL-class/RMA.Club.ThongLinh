import { defineAsyncComponent } from 'vue'
export default {
  custom: defineAsyncComponent(() => import("/app/layouts/custom.vue").then(m => m.default || m)),
  default: defineAsyncComponent(() => import("/app/layouts/default.vue").then(m => m.default || m))
}