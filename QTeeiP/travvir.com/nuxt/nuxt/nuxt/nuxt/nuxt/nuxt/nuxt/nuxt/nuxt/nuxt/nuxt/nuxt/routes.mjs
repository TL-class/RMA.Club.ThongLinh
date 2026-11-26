
if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    const router = import.meta.hot.data.router
    const generateRoutes = import.meta.hot.data.generateRoutes
    if (!router || !generateRoutes) {
      import.meta.hot.invalidate('[nuxt] Cannot replace routes because there is no active router. Reloading.')
      return
    }
    const addedRoutes = router.getRoutes().filter(r => !r._initial)
    router.clearRoutes()
    const routes = generateRoutes(mod.default || mod)
    function addRoutes (routes) {
      for (const route of routes) {
        router.addRoute(route)
      }
      for (const route of router.getRoutes()) {
        route._initial = true
      }
      for (const route of addedRoutes) {
        router.addRoute(route)
      }
      router.isReady().then(() => {
        // Resolve the current path against the new routes to get updated meta
        const newRoute = router.resolve(router.currentRoute.value.fullPath)
        // Clear old meta values and assign new ones
        for (const key of Object.keys(router.currentRoute.value.meta)) {
          delete router.currentRoute.value.meta[key]
        }
        Object.assign(router.currentRoute.value.meta, newRoute.meta)
      })
    }
    if (routes && 'then' in routes) {
      routes.then(addRoutes)
    } else {
      addRoutes(routes)
    }
  })
}

export function handleHotUpdate(_router, _generateRoutes) {
  if (import.meta.hot) {
    import.meta.hot.data ||= {}
    import.meta.hot.data.router = _router
    import.meta.hot.data.generateRoutes = _generateRoutes
    for (const route of _router.getRoutes()) {
      route._initial = true
    }
  }
}
import { default as _91404_93e_A6eT2qbeN8ceq0DJV0zVQebag80Ldqz7y_fnoBTeAMeta } from "/app/pages/[404].vue?macro=true";
import { default as indexndqPXFtP262szLmLJV4PriPTgAg5k_457f05QyTfosBXQMeta } from "/app/pages/index.vue?macro=true";
import { default as indexqKg2vEVwFr7R6sRGNcznbQ1tGR2wwG4KtZU0fEO_45KcgMeta } from "/app/pages/docs/index.vue?macro=true";
import { default as indexsziV31bRWzCkX_45YudaBOdqrwcbympIP9GPi2Nu0StJUMeta } from "/app/pages/about/index.vue?macro=true";
import { default as indexgIHaC0fdW2BGHm1KPXppFjW1YknpFdYO_LTaS3pYtQQMeta } from "/app/pages/terms/index.vue?macro=true";
import { default as _91_46_46_46catchall_93YCFVf3YC9WkFyjVwUp4Ak0EPVdsoDqNTMhcZMsRRRrAMeta } from "/app/pages/[...catchall].vue?macro=true";
import { default as indexQYLsx_45Y4jATQ8DXrAIU_45u9flcnkF2hfIzb8JBUok5iMMeta } from "/app/pages/credits/index.vue?macro=true";
import { default as indexdE_UA8oF0KJtAE6KiO0P6I6VgyACLCuQoDBZhO0l_gcMeta } from "/app/pages/explore/index.vue?macro=true";
import { default as indexe3sMNPzI0jKbUjCKyepP_45oLuYbYdwQqUOHe4eOD42DIMeta } from "/app/pages/pricing/index.vue?macro=true";
import { default as indexr2RtQMRpUolBdOn8oOapQQyjAGni1NUx6NfmHiNcc1gMeta } from "/app/pages/panorama/index.vue?macro=true";
import { default as indexI8sv9Tyq3XHcdnk8WBb_Kd_zonaB5OXDebmz7lD5UL0Meta } from "/app/pages/360camera/index.vue?macro=true";
import { default as _91propertyId_93g4gKk5MqDEFbUyCGiy_lUmWAmo9j2esTLDKzWcbtPMgMeta } from "/app/pages/vr/[propertyId].vue?macro=true";
import { default as indexXF5Srx9CXsqS4JrQMVwLfBaWmay3cGPl8lWyJt2LMeYMeta } from "/app/pages/enterprise/index.vue?macro=true";
import { default as index80yQPjX__45OAZHC9Ixgmo_O5cgLuggawhZDjo3npIqFkMeta } from "/app/pages/partnership/index.vue?macro=true";
import { default as _91propertyId_93kS8LLBbdiFz9GTsSr8gExMY48442qSPEXycokx1rnlYMeta } from "/app/pages/place/[propertyId].vue?macro=true";
import { default as indexftjrkRFMrWL3a6L7i8S60k6vTJCx4Vzn9YrXa4cxbggMeta } from "/app/pages/virtual-tour/index.vue?macro=true";
import { default as _91_91propertyId_93_93jvD3GUYmOE1FuSEZGgREgF_45p41k6pP5LBdVS0PqR11sMeta } from "/app/pages/embed/[[propertyId]].vue?macro=true";
import { default as indexAWLVNp8iMHF70fkcB3DYOBON8T44sZWE_fzwjUZuNjkMeta } from "/app/pages/privacy-policy/index.vue?macro=true";
import { default as _91propertyId_93JQo4VAnbwaXP4_45iiVjQVKHjIa0jUPF75YqWOpEnLvCoMeta } from "/app/pages/embed/do/[propertyId].vue?macro=true";
import { default as _91conferenceKey_938_viDJQZ81ctM5Tx90QoQhGN1UcD_VmFTCjSswTOP5wMeta } from "/app/pages/conference/[conferenceKey].vue?macro=true";
import { default as component_45stubbjLkcGu196H3H6U3AGpzju91fOJPpk9xx3zVsuzjgIAMeta } from "/app/node_modules/nuxt/dist/pages/runtime/component-stub.js?macro=true";
import { default as component_45stubbjLkcGu196H3H6U3AGpzju91fOJPpk9xx3zVsuzjgIA } from "/app/node_modules/nuxt/dist/pages/runtime/component-stub.js";
export default [
  {
    name: "404",
    path: "/:404()",
    meta: _91404_93e_A6eT2qbeN8ceq0DJV0zVQebag80Ldqz7y_fnoBTeAMeta || {},
    component: () => import("/app/pages/[404].vue")
  },
  {
    name: "index",
    path: "/",
    meta: indexndqPXFtP262szLmLJV4PriPTgAg5k_457f05QyTfosBXQMeta || {},
    component: () => import("/app/pages/index.vue")
  },
  {
    name: "docs",
    path: "/docs",
    component: () => import("/app/pages/docs/index.vue")
  },
  {
    name: "about",
    path: "/about",
    component: () => import("/app/pages/about/index.vue")
  },
  {
    name: "terms",
    path: "/terms",
    component: () => import("/app/pages/terms/index.vue")
  },
  {
    name: "catchall",
    path: "/:catchall(.*)*",
    meta: _91_46_46_46catchall_93YCFVf3YC9WkFyjVwUp4Ak0EPVdsoDqNTMhcZMsRRRrAMeta || {},
    component: () => import("/app/pages/[...catchall].vue")
  },
  {
    name: "credits",
    path: "/credits",
    component: () => import("/app/pages/credits/index.vue")
  },
  {
    name: "explore",
    path: "/explore",
    component: () => import("/app/pages/explore/index.vue")
  },
  {
    name: "pricing",
    path: "/pricing",
    meta: indexe3sMNPzI0jKbUjCKyepP_45oLuYbYdwQqUOHe4eOD42DIMeta || {},
    component: () => import("/app/pages/pricing/index.vue")
  },
  {
    name: "panorama",
    path: "/panorama",
    component: () => import("/app/pages/panorama/index.vue")
  },
  {
    name: "360camera",
    path: "/360camera",
    meta: indexI8sv9Tyq3XHcdnk8WBb_Kd_zonaB5OXDebmz7lD5UL0Meta || {},
    component: () => import("/app/pages/360camera/index.vue")
  },
  {
    name: "vr-propertyId",
    path: "/vr/:propertyId()",
    meta: _91propertyId_93g4gKk5MqDEFbUyCGiy_lUmWAmo9j2esTLDKzWcbtPMgMeta || {},
    component: () => import("/app/pages/vr/[propertyId].vue")
  },
  {
    name: "enterprise",
    path: "/enterprise",
    component: () => import("/app/pages/enterprise/index.vue")
  },
  {
    name: "partnership",
    path: "/partnership",
    component: () => import("/app/pages/partnership/index.vue")
  },
  {
    name: "place-propertyId",
    path: "/place/:propertyId()",
    meta: _91propertyId_93kS8LLBbdiFz9GTsSr8gExMY48442qSPEXycokx1rnlYMeta || {},
    component: () => import("/app/pages/place/[propertyId].vue")
  },
  {
    name: "virtual-tour",
    path: "/virtual-tour",
    meta: indexftjrkRFMrWL3a6L7i8S60k6vTJCx4Vzn9YrXa4cxbggMeta || {},
    component: () => import("/app/pages/virtual-tour/index.vue")
  },
  {
    name: "embed-propertyId",
    path: "/embed/:propertyId?",
    meta: _91_91propertyId_93_93jvD3GUYmOE1FuSEZGgREgF_45p41k6pP5LBdVS0PqR11sMeta || {},
    component: () => import("/app/pages/embed/[[propertyId]].vue")
  },
  {
    name: "privacy-policy",
    path: "/privacy-policy",
    component: () => import("/app/pages/privacy-policy/index.vue")
  },
  {
    name: "embed-do-propertyId",
    path: "/embed/do/:propertyId()",
    meta: _91propertyId_93JQo4VAnbwaXP4_45iiVjQVKHjIa0jUPF75YqWOpEnLvCoMeta || {},
    component: () => import("/app/pages/embed/do/[propertyId].vue")
  },
  {
    name: "conference-conferenceKey",
    path: "/conference/:conferenceKey()",
    meta: _91conferenceKey_938_viDJQZ81ctM5Tx90QoQhGN1UcD_VmFTCjSswTOP5wMeta || {},
    component: () => import("/app/pages/conference/[conferenceKey].vue")
  },
  {
    name: component_45stubbjLkcGu196H3H6U3AGpzju91fOJPpk9xx3zVsuzjgIAMeta?.name,
    path: "/view/:pathMatch(.*)",
    component: component_45stubbjLkcGu196H3H6U3AGpzju91fOJPpk9xx3zVsuzjgIA
  }
]
