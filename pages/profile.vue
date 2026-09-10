<template>
  <div class="space-y-6 pt-4 sm:pt-6 max-w-2xl mx-auto">
    <div>
      <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
        <span>👤</span>
        <span>حساب کاربری و سفارش‌ها</span>
      </h1>
      <p class="text-xs text-zinc-400 mt-1">مدیریت سفارش‌ها، آدرس‌ها و امتیازات</p>
    </div>

    <!-- کارت اطلاعات کاربر -->
    <div class="glass flex items-center gap-4 rounded-3xl p-5 border-white/[0.15]">
      <span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-ice text-3xl shadow-neon-purple">
        {{ loggedIn ? '😎' : '👤' }}
      </span>
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-black text-white truncate">
          {{ loggedIn ? 'آرمین عزیز 👋' : 'کاربر مهمان گرامی 👋' }}
        </h3>
        <p class="text-xs font-bold mt-1" :class="loggedIn ? 'text-amber-400' : 'text-zinc-400'">
          {{ loggedIn ? 'سطح کاربری: مشتری طلایی VIP 🏆' : 'برای دسترسی به سوابق خرید وارد شوید' }}
        </p>
      </div>

      <button
        class="btn-neon !py-2.5 !px-5 !text-xs"
        @click="loggedIn = !loggedIn"
      >
        {{ loggedIn ? 'خروج' : 'ورود / ثبت‌نام' }}
      </button>
    </div>

    <!-- آمار سریع حساب -->
    <div class="grid grid-cols-3 gap-3 text-center">
      <div v-for="s in miniStats" :key="s.label" class="glass rounded-2xl p-4">
        <p class="text-base sm:text-lg font-black text-neon-green">{{ s.value }}</p>
        <p class="mt-1 text-[11px] font-bold text-zinc-400">{{ s.label }}</p>
      </div>
    </div>

    <!-- منوی حساب کاربری -->
    <div class="glass divide-y divide-white/10 overflow-hidden rounded-3xl border-white/[0.12]">
      <button
        v-for="m in menu"
        :key="m.label"
        class="flex w-full items-center gap-3.5 p-4 text-start transition hover:bg-white/[0.06] active:bg-white/10"
        @click="onMenu(m)"
      >
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl">{{ m.icon }}</span>
        <span class="flex-1 text-xs sm:text-sm font-black text-white">{{ m.label }}</span>
        <span v-if="m.badge" class="rounded-full bg-neon-purple/20 border border-neon-purple/40 px-2.5 py-0.5 text-[10px] font-black text-neon-purple">
          {{ m.badge }}
        </span>
        <span class="text-zinc-400 text-sm font-bold">‹</span>
      </button>
    </div>

    <!-- هشدار محدودیت سنی ۱۸+ -->
    <div class="rounded-3xl border border-neon-pink/40 bg-neon-pink/[0.08] p-5 text-center space-y-1.5">
      <p class="text-xs sm:text-sm font-black text-neon-pink flex items-center justify-center gap-1.5">
        <span>🔞</span>
        <span>قوانین فروش و محدودیت سنی ۱۸+</span>
      </p>
      <p class="text-[11px] leading-relaxed text-zinc-300">
        فروش محصولات حاوی نیکوتین به افراد زیر ۱۸ سال ممنوع است. مصرف نیکوتین اعتیادآور و مضر است.
      </p>
    </div>

    <p class="text-center text-[11px] text-zinc-400 font-mono pt-2" dir="ltr">
      Luxe Vape v2.0 • Premium Vaping Experience
    </p>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

useHead({ title: 'پروفایل کاربری' })

const cart = useCartStore()
const loggedIn = ref(true)

const miniStats = computed(() => [
  { value: cart.count.toLocaleString('fa-IR'), label: 'کالا در سبد' },
  { value: loggedIn.value ? '۲' : '۰', label: 'سفارش تحویل‌شده' },
  { value: '⭐ ۵.۰', label: 'امتیاز وفاداری' },
])

const menu = [
  { icon: '📦', label: 'سفارش‌های من و پیگیری مرسوله', badge: '۲ سفارش' },
  { icon: '📍', label: 'آدرس‌ها و اطلاعات ارسال', badge: '' },
  { icon: '❤️', label: 'لیست علاقه‌مندی‌ها', badge: '' },
  { icon: '✨', label: 'مشاوره با دستیار هوشمند ساملیه', badge: 'رایگان' },
  { icon: '🎧', label: 'پشتیبانی آنلاین و تیکت', badge: 'پاسخگویی سریع' },
  { icon: '⚙️', label: 'تنظیمات حساب کاربری', badge: '' },
]

function onMenu(m: { label: string }) {
  if (m.label.includes('ساملیه')) {
    useState<boolean>('assistantOpen', () => false).value = true
    return
  }
  cart.notify('بخش «' + m.label + '» به زودی فعال می‌شود 🚧')
}
</script>
