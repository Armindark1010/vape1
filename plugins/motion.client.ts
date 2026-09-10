import { MotionPlugin } from '@vueuse/motion'

/** رجیستر کردن directive های v-motion فقط در سمت کلاینت */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MotionPlugin)
})
