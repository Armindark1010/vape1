<template>
  <div class="min-h-dvh">
    <!-- پس‌زمینه دود سه‌بعدی -->
    <VaporBackground />

    <!-- هدر -->
    <SiteHeader />

    <!-- محتوای صفحه -->
    <main class="relative z-10 mx-auto w-full max-w-md px-4 pb-32">
      <slot />
    </main>

    <!-- نوبار پایین موبایل -->
    <MobileBottomNav />

    <!-- دستیار هوشمند + سبد خرید -->
    <AIFlavorAssistant />
    <CartBottomSheet />
    <AppToast />
  </div>
</template>
