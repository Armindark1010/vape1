<template>
  <div class="pt-4">
    <h1 class="text-lg font-black">👤 پروفایل</h1>

    <div class="glass mt-3 flex items-center gap-3 rounded-3xl p-4">
      <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue text-2xl shadow-neon-purple">
        {{ loggedIn ? '😎' : '👤' }}
      </span>
      <div class="flex-1">
        <p class="text-sm font-black">{{ loggedIn ? 'آرمین عزیز 👋' : 'مهمان عزیز 👋' }}</p>
        <p class="mt-0.5 text-[11px] text-zinc-400">
          {{ loggedIn ? 'سطح: مشتری طلایی 🏆' : 'وارد شو تا سفارش‌هات رو ببینی' }}
        </p>
      </div>
      <button
        v-if="!loggedIn"
        class="rounded-xl bg-gradient-to-l from-neon-purple to-neon-blue px-4 py-2 text-xs font-extrabold shadow-neon-purple transition active:scale-90"
        @click="loggedIn = true"
      >
        ورود
      </button>
    </div>

    <div class="mt-3 grid grid-cols-3 gap-2 text-center">
      <div v-for="s in miniStats" :key="s.label" class="glass rounded-2xl p-3">
        <p class="text-base font-black text-neon-green">{{ s.value }}</p>
        <p class="mt-0.5 text-[10px] text-zinc-400">{{ s.label }}</p>
      </div>
    </div>

    <div class="glass mt-3 divide-y divide-white/5 overflow-hidden rounded-3xl">
      <button
        v-for="m in menu"
        :key="m.label"
        class="flex w-full items-center gap-3 p-4 text-start transition active:bg-white/5"
        @click="onMenu(m)"
      >
        <span class="text-xl">{{ m.icon }}</span>
        <span class="flex-1 text-[13px] font-extrabold">{{ m.label }}</span>
        <span v-if="m.badge" class="rounded-full bg-neon-purple/20 px-2 py-0.5 text-[10px] font-black text-neon-purple">{{ m.badge }}</span>
        <span class="text-zinc-600">‹</span>
      </button>
    </div>

    <div class="mt-3 rounded-3xl border border-neon-pink/25 bg-neon-pink/[0.06] p-4 text-center">
      <p class="text-xs font-black text-neon-pink">🔞 فقط بالای ۱۸ سال</p>
      <p class="mt-1 text-[11px] leading-5 text-zinc-400">
        فروش محصولات نیکوتین‌دار به افراد زیر ۱۸ سال ممنوع است. مصرف نیکوتین اعتیادآور و برای سلامتی مضر است.
      </p>
    </div>

    <p class="mt-4 text-center text-[10px] text-zinc-600" dir="ltr">Luxe Vape v1.0 • Made with 💨 in Gothenburg</p>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

useHead({ title: 'پروفایل' })

const cart = useCartStore()
const loggedIn = ref(false)

const miniStats = computed(() => [
  { value: cart.count.toLocaleString('fa-IR'), label: 'کالا در سبد' },
  { value: '۰', label: 'سفارش فعال' },
  { value: '⭐ ۴.۹', label: 'امتیاز شما' },
])

const menu = [
  { icon: '📦', label: 'سفارش‌های من', badge: '' },
  { icon: '📍', label: 'آدرس‌ها', badge: '' },
  { icon: '❤️', label: 'علاقه‌مندی‌ها', badge: '' },
  { icon: '✨', label: 'مشاوره با دستیار AI', badge: 'رایگان' },
  { icon: '🎧', label: 'پشتیبانی', badge: '' },
  { icon: '⚙️', label: 'تنظیمات', badge: '' },
]

function onMenu(m: { label: string }) {
  if (m.label.includes('AI')) {
    useState<boolean>('assistantOpen', () => false).value = true
    return
  }
  cart.notify('به‌زودی فعال می‌شود 🚧')
}
</script>
