
  import * as ipxRuntime$c5bYuDBMFn7pLf3NiYFFTgAhjpBXVLzp5UXALzaMXO0 from '/app/node_modules/@nuxt/image/dist/runtime/providers/ipx'
  
  export const imageOptions = {
    ...{
  "screens": {
    "xs": 320,
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "xxl": 1536,
    "2xl": 1536
  },
  "presets": {},
  "provider": "ipx",
  "domains": [],
  "alias": {},
  "densities": [
    1,
    2
  ],
  "format": [
    "webp"
  ]
},
    providers: {
        ['ipx']: { provider: ipxRuntime$c5bYuDBMFn7pLf3NiYFFTgAhjpBXVLzp5UXALzaMXO0, defaults: {} }
    }
  }
