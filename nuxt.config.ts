// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/motion/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title: 'لوکس ویپ | فروشگاه تخصصی ویپ، سالت و پاد',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
        },
        {
          name: 'description',
          content:
            'فروشگاه لوکس ویپ، سالت نیکوتین و پاد با دستیار هوشمند انتخاب طعم (AI Sommelier)، ارسال سریع و ضمانت اصالت کالا.',
        },
        { name: 'theme-color', content: '#070709' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800;900&display=swap',
        },
      ],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },

  vite: {
    optimizeDeps: { include: ['three'] },
    server: {
      // اجازه دسترسی از طریق دامین پیش‌نمایش
      allowedHosts: ['localhost', '127.0.0.1', '.e2b.app'],
    },
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  typescript: { strict: false },
})
