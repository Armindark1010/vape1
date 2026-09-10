<template>
  <div class="min-h-dvh flex flex-col selection:bg-neon-purple/40">
    <!-- پس‌زمینه دود سه‌بعدی بهینه‌شده -->
    <VaporBackground />

    <!-- هدر سایت (ریسپانسیو: موبایل و دسکتاپ) -->
    <SiteHeader />

    <!-- محتوای صفحه با عرض ریسپانسیو فوق‌العاده زیبا -->
    <main class="relative z-10 mx-auto w-full flex-1 px-3 sm:px-6 lg:px-8 max-w-7xl pb-28 md:pb-16">
      <slot />
    </main>

    <!-- نوبار شناور پایین فقط برای موبایل -->
    <MobileBottomNav />

    <!-- دستیار هوشمند + شیت سبد خرید + نوتیفیکیشن -->
    <AIFlavorAssistant />
    <CartBottomSheet />
    <AppToast />
  </div>
</template>
