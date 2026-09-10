<template>
  <div class="space-y-8 sm:space-y-12 pt-4 sm:pt-6">
    <!-- ===== سکشن هیرو لوکس (ریسپانسیو: موبایل و دسکتاپ) ===== -->
    <section class="relative overflow-hidden">
      <div
        ref="heroEl"
        class="glass relative overflow-hidden rounded-[2.25rem] p-6 sm:p-8 lg:p-12 shadow-glass border border-white/[0.15]"
      >
        <!-- هاله‌های نوری پس‌زمینه هیرو -->
        <div class="absolute -top-24 start-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-neon-purple/20 blur-[90px] pointer-events-none" />
        <div class="absolute -bottom-20 end-10 h-48 w-48 rounded-full bg-neon-ice/15 blur-[80px] pointer-events-none" />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- ستون متن و اکشن‌ها -->
          <div class="lg:col-span-7 text-center lg:text-start flex flex-col items-center lg:items-start">
            <!-- بج ارسال رایگان -->
            <span class="hero-in inline-flex items-center gap-2 rounded-full border border-neon-green/40 bg-neon-green/15 px-4 py-1.5 text-xs font-black text-neon-green shadow-sm">
              <span class="h-2 w-2 animate-ping rounded-full bg-neon-green" />
              🚚 ارسال رایگان برای خریدهای بالای {{ formatPrice(499) }}
            </span>

            <!-- عنوان اصلی با تایپوگرافی چشم‌نواز -->
            <h1 class="hero-in mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.3] text-white">
              دنیای <span class="neon-text-purple">لوکس</span> ویپ،
              <br class="hidden sm:inline" />
              سالت نیکوتین و پاد 💨
            </h1>

            <!-- توضیحات کوتاه -->
            <p class="hero-in mt-3.5 max-w-lg text-xs sm:text-sm lg:text-base leading-relaxed text-zinc-300 font-medium">
              ۱۰۰٪ اورجینال، تازه‌ترین تولیدات روز دنیا با ضمانت اصالت کالا. نمی‌دونی چه طعمی بهت می‌سازه؟ هوش مصنوعی ما بهترین رو برات پیدا می‌کنه!
            </p>

            <!-- دکمه‌های اکشن -->
            <div class="hero-in mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
              <button
                class="btn-neon flex-1 sm:flex-initial !px-6 !py-3.5 !text-sm"
                @click="assistantOpen = true"
              >
                <span>✨</span>
                <span>پیدا کردن طعم با AI</span>
              </button>

              <NuxtLink
                to="/products"
                class="btn-secondary flex-1 sm:flex-initial !px-6 !py-3.5 !text-sm"
              >
                <span>🛍️</span>
                <span>مشاهده فروشگاه</span>
              </NuxtLink>
            </div>

            <!-- آمار سریع -->
            <div class="hero-in mt-8 grid grid-cols-3 gap-3 w-full max-w-md">
              <div
                v-for="s in stats"
                :key="s.label"
                class="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-md"
              >
                <p class="text-base sm:text-lg font-black text-neon-ice">{{ s.value }}</p>
                <p class="mt-0.5 text-[10px] sm:text-[11px] font-bold text-zinc-400">{{ s.label }}</p>
              </div>
            </div>
          </div>

          <!-- ستون گرافیک و دستگاه سه‌بعدی شناور -->
          <div class="lg:col-span-5 flex justify-center items-center relative">
            <div class="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
              <!-- حلقه نور گردان -->
              <div class="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-neon-purple/40 via-transparent to-neon-ice/40 blur-2xl opacity-75" />
              
              <!-- تصویر پاد لوکس -->
              <img
                src="/images/img-pod.svg"
                alt="پاد لوکس پرچم‌دار"
                class="relative h-full w-full animate-float object-contain drop-shadow-[0_15px_35px_rgba(168,85,247,0.55)]"
              />

              <!-- بج شناور روی تصویر -->
              <div class="absolute -bottom-2 -start-2 rounded-2xl border border-white/20 bg-[#0e0e14]/90 px-3.5 py-2 backdrop-blur-xl shadow-glass">
                <p class="text-[10px] font-bold text-zinc-400">چیپست هوشمند AXON</p>
                <p class="text-xs font-black text-neon-green">⚡ طعم‌رسانی بی‌نظیر</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== دسته‌بندی‌های محصولات ===== -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-xl font-black text-white flex items-center gap-2">
            <span>🗂️</span>
            <span>دسته‌بندی‌های تخصصی</span>
          </h2>
          <p class="text-xs text-zinc-400 mt-0.5">انتخاب سریع بر اساس نیاز شما</p>
        </div>
        <NuxtLink to="/products" class="text-xs font-black text-neon-purple hover:underline flex items-center gap-1">
          <span>مشاهده همه</span>
          <span>←</span>
        </NuxtLink>
      </div>

      <!-- گرید در دسکتاپ و اسکرول در موبایل -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <NuxtLink
          v-for="c in CATEGORIES"
          :key="c.id"
          :to="`/products?cat=${c.id}`"
          class="glass group flex flex-col items-center text-center rounded-2xl p-4 transition-all duration-300 hover:border-neon-purple/60 hover:-translate-y-1 hover:shadow-neon-purple active:scale-95"
        >
          <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-2xl transition-transform group-hover:scale-110">
            {{ c.icon }}
          </span>
          <span class="mt-2.5 text-xs sm:text-sm font-black text-white group-hover:text-neon-purple transition-colors">
            {{ c.label }}
          </span>
          <span class="mt-1 text-[11px] text-zinc-400 line-clamp-1">
            {{ c.desc }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- ===== بنر دستیار هوشمند ساملیه AI ===== -->
    <section
      v-motion
      :initial="{ opacity: 0, scale: 0.96 }"
      :visible-once="{ opacity: 1, scale: 1, transition: { duration: 450 } }"
      class="relative overflow-hidden rounded-[2rem] border border-neon-purple/40 bg-gradient-to-l from-neon-purple/20 via-[#101018] to-neon-ice/15 p-6 sm:p-8 shadow-neon-purple"
    >
      <div class="absolute -end-16 -top-16 h-48 w-48 rounded-full bg-neon-purple/30 blur-[70px] pointer-events-none" />

      <div class="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div class="flex items-center gap-4 text-center md:text-start flex-col md:flex-row">
          <span class="animate-pulse-glow flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet via-neon-purple to-neon-ice text-3xl shadow-neon-purple">
            ✨
          </span>
          <div>
            <h3 class="text-base sm:text-xl font-black text-white">ساملیه — هوش مصنوعی انتخاب طعم و پاد!</h3>
            <p class="mt-1 text-xs sm:text-sm leading-relaxed text-zinc-200">
              با ۴ سوال ساده، دقیق‌ترین سالت، پاد یا یکبارمصرف متناسب با ذائقه و میزان مصرفت رو پیدا کن 🎯
            </p>
          </div>
        </div>

        <button
          class="w-full md:w-auto shrink-0 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-vapor-950 transition-all duration-200 hover:bg-zinc-100 hover:scale-105 active:scale-95 shadow-lg"
          @click="assistantOpen = true"
        >
          شروع مشاوره رایگان ✨
        </button>
      </div>
    </section>

    <!-- ===== محصولات ویژه و پرطرفدار ===== -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-xl font-black text-white flex items-center gap-2">
            <span>🔥</span>
            <span>پیشنهادهای ویژه و پرفروش‌ها</span>
          </h2>
          <p class="text-xs text-zinc-400 mt-0.5">محبوب‌ترین انتخاب‌های خریداران</p>
        </div>
        <NuxtLink to="/products" class="text-xs font-black text-neon-purple hover:underline flex items-center gap-1">
          <span>مشاهده همه محصولات</span>
          <span>←</span>
        </NuxtLink>
      </div>

      <!-- گرید محصولات ۴ تایی ریسپانسیو -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <ProductCard
          v-for="(p, i) in featured"
          :key="p.id"
          :product="p"
          :index="i"
        />
      </div>
    </section>

    <!-- ===== مزایای خرید از لوکس ویپ ===== -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="f in features"
        :key="f.label"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400 } }"
        class="glass flex flex-col items-center text-center rounded-2xl p-4 sm:p-5"
      >
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-2xl shadow-sm">
          {{ f.icon }}
        </span>
        <h4 class="mt-2.5 text-xs sm:text-sm font-black text-white">{{ f.label }}</h4>
        <p class="mt-1 text-[11px] leading-5 text-zinc-400">{{ f.desc }}</p>
      </div>
    </section>

    <!-- ===== نظرات مشتریان ===== -->
    <section class="glass rounded-3xl p-6 sm:p-8">
      <div class="text-center max-w-xl mx-auto mb-6">
        <span class="text-xs font-black text-neon-purple uppercase tracking-wider">تجربه خریداران</span>
        <h3 class="text-lg sm:text-2xl font-black text-white mt-1">نظرات کاربران لوکس ویپ</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="r in testimonials"
          :key="r.name"
          class="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex flex-col justify-between"
        >
          <p class="text-xs leading-6 text-zinc-200">«{{ r.comment }}»</p>
          <div class="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <div>
              <p class="text-xs font-black text-white">{{ r.name }}</p>
              <p class="text-[10px] text-zinc-400">{{ r.product }}</p>
            </div>
            <span class="text-xs text-amber-400">⭐⭐⭐⭐⭐</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== فوتر مدرن و لوکس ===== -->
    <footer class="glass rounded-3xl border border-white/[0.12] p-6 sm:p-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-white/10">
        <!-- ستون برند -->
        <div class="md:col-span-5 space-y-3">
          <div class="flex items-center gap-2.5">
            <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-ice text-xl shadow-neon-purple">💨</span>
            <span class="neon-text-purple text-lg font-black">لوکس ویپ</span>
          </div>
          <p class="text-xs leading-relaxed text-zinc-400 max-w-sm">
            فروشگاه تخصصی پاد سیستم، سالت نیکوتین و ویپ با ضمانت ۱۰۰٪ اصالت کالا و ارسال سریع به سراسر کشور.
          </p>
        </div>

        <!-- ستون دسترسی سریع -->
        <div class="md:col-span-3 space-y-2">
          <p class="text-xs font-black text-white">دسترسی سریع</p>
          <ul class="space-y-1.5 text-xs text-zinc-400">
            <li><NuxtLink to="/products" class="hover:text-white transition">🛍️ همه محصولات</NuxtLink></li>
            <li><NuxtLink to="/products?cat=pod" class="hover:text-white transition">🔋 پاد سیستم‌ها</NuxtLink></li>
            <li><NuxtLink to="/products?cat=salt" class="hover:text-white transition">🧪 سالت نیکوتین</NuxtLink></li>
            <li><button class="hover:text-white transition text-start" @click="assistantOpen = true">✨ مشاوره هوشمند AI</button></li>
          </ul>
        </div>

        <!-- ستون هشدار قانونی -->
        <div class="md:col-span-4 space-y-2">
          <div class="inline-flex items-center gap-1.5 rounded-full border border-neon-pink/40 bg-neon-pink/10 px-3 py-1 text-xs font-black text-neon-pink">
            🔞 فقط افراد بالای ۱۸ سال
          </div>
          <p class="text-[11px] leading-relaxed text-zinc-400">
            فروش تمامی محصولات حاوی نیکوتین صرفاً به افراد دارای سن قانونی مجاز است. مصرف نیکوتین اعتیادآور است.
          </p>
        </div>
      </div>

      <!-- کپی‌رایت -->
      <div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
        <p>© 2026 Luxe Vape • تمامی حقوق محفوظ است.</p>
        <p dir="ltr" class="font-mono text-zinc-400">Crafted with 💨 for Vapers</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { CATEGORIES, formatPrice } from '~/types/product'
import { PRODUCTS } from '~/data/products'

useHead({ title: 'فروشگاه تخصصی پاد، سالت و ویپ' })

const assistantOpen = useState<boolean>('assistantOpen', () => false)
const heroEl = ref<HTMLElement | null>(null)

const featured = computed(() => PRODUCTS.filter((p) => p.featured).slice(0, 4))

const stats = [
  { value: '۴.۹ ⭐', label: 'رضایت مشتریان' },
  { value: '+۲.۵k', label: 'خریدار فعال' },
  { value: '۱۰۰٪', label: 'اصالت تضمینی' },
]

const features = [
  { icon: '🚚', label: 'ارسال فوق‌سریع', desc: '۱ تا ۳ روزه سراسر کشور با بسته‌بندی امن' },
  { icon: '🛡️', label: 'ضمانت اصالت', desc: '۱۰۰٪ اورجینال، آکبند با کد استعلام' },
  { icon: '✨', label: 'مشاوره هوشمند AI', desc: 'انتخاب بهترین طعم و نیکوتین متناسب با شما' },
  { icon: '💎', label: 'بهترین قیمت', desc: 'عرضه مستقیم و بدون واسطه برترین برندها' },
]

const testimonials = [
  { name: 'امیرحسین ر.', product: 'پاد لوکس ایکس', comment: 'کیفیت طعم‌دهی پاد لوکس ایکس واقعاً فوق‌العاده‌ست. ارسال هم خیلی سریع به دستم رسید.' },
  { name: 'سارا م.', product: 'سالت آرکتیک مینت', comment: 'مشاوره هوش مصنوعی دقیقا سالتی که می‌خواستم رو پیشنهاد داد، خنکی نعناعش بی‌نظیره!' },
  { name: 'مهرداد ک.', product: 'پاد یکبارمصرف نئون', comment: 'برای مسافرت خریدم، طعم و دودش تا آخرین پاف مثل روز اول بود. حتما باز هم خرید می‌کنم.' },
]

onMounted(() => {
  if (heroEl.value) {
    gsap.from('.hero-in', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'all',
    })
  }
})
</script>
