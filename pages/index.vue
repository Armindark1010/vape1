<template>
  <div>
    <!-- ===== هیرو ===== -->
    <section class="relative overflow-hidden pt-6 text-center">
      <div
        ref="heroEl"
        class="glass relative overflow-hidden rounded-[2rem] p-6 pt-7 shadow-glass"
      >
        <div class="absolute -top-16 start-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-neon-purple/25 blur-[70px]" />
        <span class="hero-in relative inline-flex items-center gap-1.5 rounded-full border border-neon-green/30 bg-neon-green/10 px-3 py-1 text-[11px] font-extrabold text-neon-green">
          🚚 ارسال رایگان بالای {{ formatPrice(499) }}
        </span>
        <h1 class="hero-in relative mt-3 text-3xl font-black leading-[1.35]">
          دنیای <span class="neon-text-purple">لوکس</span> ویپ،
          <br />
          سالت و پاد 💨
        </h1>
        <p class="hero-in relative mx-auto mt-2 max-w-[16rem] text-xs leading-6 text-zinc-400">
          اورجینال، تازه و با ضمانت اصالت — بذار هوش مصنوعی دقیق‌ترین طعم رو برات پیدا کنه
        </p>

        <div class="hero-in relative mx-auto -mb-2 mt-1 h-44 w-44">
          <div class="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-neon-purple/30 via-transparent to-neon-ice/30 blur-xl" />
          <img
            src="/images/img-pod.svg"
            alt="پاد لوکس"
            class="relative h-full w-full animate-float object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.45)]"
          />
        </div>

        <div class="hero-in relative mt-3 flex gap-2">
          <button class="btn-neon flex-1 !text-[13px]" @click="assistantOpen = true">
            ✨ پیدا کردن طعم با AI
          </button>
          <NuxtLink
            to="/products"
            class="flex-1 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-[13px] font-extrabold backdrop-blur-md transition active:scale-95"
          >
            🛍️ مشاهده فروشگاه
          </NuxtLink>
        </div>
      </div>

      <!-- آمار -->
      <div class="mt-3 grid grid-cols-3 gap-2">
        <div v-for="s in stats" :key="s.label" class="glass rounded-2xl px-2 py-3">
          <p class="text-base font-black text-neon-ice">{{ s.value }}</p>
          <p class="mt-0.5 text-[10px] font-bold text-zinc-400">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- ===== دسته‌بندی‌ها ===== -->
    <section class="mt-6">
      <div class="mb-2.5 flex items-center justify-between">
        <h2 class="text-sm font-black">🗂️ دسته‌بندی‌ها</h2>
        <NuxtLink to="/products" class="text-[11px] font-bold text-neon-purple">همه ←</NuxtLink>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <NuxtLink
          v-for="c in CATEGORIES"
          :key="c.id"
          :to="`/products?cat=${c.id}`"
          class="glass flex min-w-[7.5rem] flex-col items-center rounded-2xl px-3 py-3.5 transition active:scale-95"
        >
          <span class="text-2xl">{{ c.icon }}</span>
          <span class="mt-1.5 text-xs font-extrabold">{{ c.label }}</span>
          <span class="mt-0.5 text-[10px] text-zinc-500">{{ c.desc }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- ===== بنر دستیار AI ===== -->
    <section
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :visible-once="{ opacity: 1, scale: 1, transition: { duration: 500 } }"
      class="relative mt-6 overflow-hidden rounded-[1.75rem] border border-neon-purple/30 bg-gradient-to-l from-neon-purple/20 via-vapor-800 to-neon-ice/15 p-5"
    >
      <div class="absolute -end-10 -top-10 h-36 w-36 rounded-full bg-neon-purple/30 blur-[60px]" />
      <div class="relative flex items-center gap-3">
        <span class="animate-pulse-glow flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue text-2xl">✨</span>
        <div>
          <p class="text-sm font-black">ساملیه — متخصص طعم تو!</p>
          <p class="mt-1 text-[11px] leading-5 text-zinc-300">۴ تا سوال جواب بده، بهترین طعم و دستگاه رو بگیر 🎯</p>
        </div>
      </div>
      <button
        class="relative mt-3 w-full rounded-2xl bg-white py-3 text-[13px] font-black text-vapor-950 transition active:scale-[0.98]"
        @click="assistantOpen = true"
      >
        شروع مشاوره رایگان ✨
      </button>
    </section>

    <!-- ===== محصولات ویژه ===== -->
    <section class="mt-6">
      <div class="mb-2.5 flex items-center justify-between">
        <h2 class="text-sm font-black">🔥 پیشنهادهای ویژه</h2>
        <NuxtLink to="/products" class="text-[11px] font-bold text-neon-purple">همه محصولات ←</NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-2.5">
        <ProductCard
          v-for="(p, i) in featured"
          :key="p.id"
          :product="p"
          :index="i"
        />
      </div>
    </section>

    <!-- ===== چرا ما ===== -->
    <section class="mt-6 grid grid-cols-3 gap-2 text-center">
      <div
        v-for="f in features"
        :key="f.label"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 450 } }"
        class="glass rounded-2xl p-3"
      >
        <p class="text-2xl">{{ f.icon }}</p>
        <p class="mt-1.5 text-[11px] font-extrabold">{{ f.label }}</p>
        <p class="mt-0.5 text-[10px] leading-4 text-zinc-500">{{ f.desc }}</p>
      </div>
    </section>

    <!-- ===== فوتر ===== -->
    <footer class="mt-6 rounded-3xl border border-white/10 bg-vapor-900/60 p-5 text-center backdrop-blur-xl">
      <p class="text-sm font-black">💨 لوکس ویپ</p>
      <p class="mx-auto mt-2 max-w-[15rem] text-[10px] leading-5 text-zinc-500">
        فروش محصولات نیکوتین‌دار فقط به افراد بالای ۱۸ سال مجاز است. مصرف نیکوتین اعتیادآور است.
      </p>
      <div class="mt-3 flex justify-center gap-2">
        <NuxtLink to="/products" class="chip">🛍️ فروشگاه</NuxtLink>
        <button class="chip" @click="assistantOpen = true">✨ دستیار AI</button>
        <NuxtLink to="/profile" class="chip">👤 پروفایل</NuxtLink>
      </div>
      <p class="mt-4 text-[10px] text-zinc-600" dir="ltr">© 2026 Luxe Vape • Gothenburg, SE</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { CATEGORIES, formatPrice } from '~/types/product'
import { PRODUCTS } from '~/data/products'
import { FREE_SHIPPING_FROM } from '~/stores/cart'

useHead({ title: 'خانه' })

const assistantOpen = useState<boolean>('assistantOpen', () => false)
const heroEl = ref<HTMLElement | null>(null)

const featured = computed(() => PRODUCTS.filter((p) => p.featured).slice(0, 4))

const stats = [
  { value: '۴.۹⭐', label: 'امتیاز کاربران' },
  { value: '+۲.۵k', label: 'مشتری خوشحال' },
  { value: '۱۰۰٪', label: 'ضمانت اصالت' },
]

const features = [
  { icon: '🚚', label: 'ارسال سریع', desc: '۱ تا ۳ روزه سراسر سوئد' },
  { icon: '🛡️', label: 'ضمانت اصالت', desc: '۱۰۰٪ اورجینال و آکبند' },
  { icon: '💬', label: 'پشتیبانی', desc: 'مشاوره تخصصی رایگان' },
]

onMounted(() => {
  if (heroEl.value) {
    gsap.from('.hero-in', {
      y: 26,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: 'power3.out',
      clearProps: 'all',
    })
  }
})
</script>
