<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md"
        @click="close"
      />
    </Transition>
    <Transition name="sheet">
      <div
        v-if="open"
        class="glass-strong fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:start-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[71] mx-auto flex max-h-[90dvh] md:max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] md:rounded-[2rem] shadow-neon-purple border border-white/[0.18]"
        :style="sheetStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- دستگیره درگ فقط برای موبایل -->
        <div class="md:hidden flex cursor-grab justify-center pb-1 pt-3" @touchstart.stop="onGripStart">
          <div class="h-1.5 w-12 rounded-full bg-white/20" />
        </div>

        <!-- هدر دستیار -->
        <div class="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-white/[0.02]">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet via-neon-purple to-neon-ice text-xl shadow-neon-purple"
              >
                ✨
              </div>
              <span class="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-vapor-900 bg-neon-green" />
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-black text-white">ساملیه — دستیار هوشمند طعم</h3>
              <p class="flex items-center gap-1.5 text-[11px] font-bold text-neon-green mt-0.5">
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-green" />
                آنلاین • مشاور تخصصی ویپ و سالت
              </p>
            </div>
          </div>

          <button
            class="rounded-full border border-white/10 bg-white/[0.06] p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-90"
            aria-label="بستن"
            @click="close"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- لیست پیام‌ها -->
        <div ref="scrollRef" class="flex-1 space-y-3.5 overflow-y-auto px-4 sm:px-5 py-4">
          <div
            v-for="m in messages"
            :key="m.id"
            class="flex"
            :class="m.role === 'user' ? 'justify-start' : 'justify-end'"
          >
            <!-- پیام‌های هوش مصنوعی -->
            <div
              v-if="m.role === 'ai'"
              class="max-w-[88%] rounded-2xl rounded-tr-md border border-white/[0.12] bg-[#14141e]/95 px-4 py-3 text-xs sm:text-sm leading-relaxed text-zinc-100 shadow-md"
            >
              <span v-if="m.typing && !m.text" class="typing-dots"><span /><span /><span /></span>
              <span v-else>{{ m.text }}<span v-if="m.typing" class="animate-pulse text-neon-purple">▍</span></span>
            </div>

            <!-- پیام‌های کاربر -->
            <div
              v-else
              class="max-w-[85%] rounded-2xl rounded-tl-md bg-gradient-to-l from-neon-violet to-neon-purple px-4 py-3 text-xs sm:text-sm font-black leading-relaxed text-white shadow-neon-purple"
            >
              {{ m.text }}
            </div>
          </div>

          <!-- کارت‌های نتایج و پیشنهادهای هوش مصنوعی -->
          <div v-if="results.length > 0" class="space-y-3 pt-2">
            <div
              v-for="r in results"
              :key="r.product.id"
              v-motion
              :initial="{ opacity: 0, y: 20, scale: 0.98 }"
              :enter="{ opacity: 1, y: 0, scale: 1 }"
              class="rounded-2xl border border-neon-purple/40 bg-[#12121c] overflow-hidden shadow-card"
            >
              <div class="flex gap-3.5 p-3.5 items-center">
                <NuxtLink
                  :to="`/products/${r.product.id}`"
                  class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#1a1a26] p-1.5 flex items-center justify-center"
                  @click="close"
                >
                  <img :src="r.product.images[0]" :alt="r.product.name" class="h-full w-full object-contain" loading="lazy" />
                  <span
                    class="absolute start-1 top-1 rounded-full bg-neon-green px-1.5 py-0.5 text-[9px] font-black text-vapor-950 shadow-sm"
                  >
                    {{ r.match }}٪ تطابق
                  </span>
                </NuxtLink>

                <div class="min-w-0 flex-1 space-y-1">
                  <h4 class="truncate text-xs sm:text-sm font-black text-white">{{ r.product.name }}</h4>
                  <p class="truncate text-[11px] font-bold text-neon-ice">✨ {{ r.reason }}</p>
                  
                  <div class="flex items-center justify-between pt-1">
                    <p class="text-xs sm:text-sm font-black text-neon-green">
                      {{ formatPrice(r.product.price) }}
                    </p>
                    <span class="text-[10px] text-zinc-400">⭐ {{ toFa(r.product.rating) }} ({{ toFa(r.product.reviews) }})</span>
                  </div>
                </div>
              </div>

              <!-- دکمه‌های اکشن کارت -->
              <div class="flex gap-2 border-t border-white/10 bg-black/20 p-2.5">
                <button
                  class="btn-neon flex-1 !py-2 !text-xs"
                  @click="quickAdd(r.product)"
                >
                  🛒 افزودن سریع به سبد
                </button>
                <NuxtLink
                  :to="`/products/${r.product.id}`"
                  class="btn-secondary !py-2 !px-4 !text-xs font-bold"
                  @click="close"
                >
                  مشاهده کالا
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- گزینه‌های مرحله کوییز -->
          <div v-if="currentOptions.length > 0 && !busy" class="grid grid-cols-2 gap-2.5 pt-2">
            <button
              v-for="o in currentOptions"
              :key="o.id"
              v-motion
              :initial="{ opacity: 0, y: 12 }"
              :enter="{ opacity: 1, y: 0 }"
              class="glass group rounded-2xl p-3.5 text-center transition-all duration-200 hover:border-neon-purple/70 hover:bg-neon-purple/15 active:scale-95 border-white/[0.12]"
              @click="select(o)"
            >
              <span class="text-2xl transition-transform group-hover:scale-110 inline-block">{{ o.icon }}</span>
              <p class="mt-1 text-xs font-black text-white group-hover:text-neon-purple transition-colors">{{ o.label }}</p>
              <p v-if="o.desc" class="mt-0.5 text-[10px] text-zinc-400 leading-tight">{{ o.desc }}</p>
            </button>
          </div>

          <!-- چیپ‌های پاسخ‌های سریع -->
          <div v-if="showQuickReplies" class="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            <button
              v-for="q in QUICK_REPLIES"
              :key="q"
              class="chip whitespace-nowrap !py-1.5"
              @click="sendUser(q)"
            >
              {{ q }}
            </button>
          </div>
        </div>

        <!-- نوار ورودی گفتگو -->
        <div v-if="showQuickReplies" class="border-t border-white/10 p-3.5 safe-bottom bg-[#0a0a0f]">
          <form class="flex gap-2" @submit.prevent="sendUser(input)">
            <input
              v-model="input"
              type="text"
              placeholder="هر سوالی داری بنویس... (مثلاً: خنک‌ترین طعم چیه؟)"
              class="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#14141e] px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-neon-purple/70 focus:outline-none"
            />
            <button
              type="submit"
              :disabled="!input.trim() || busy"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-ice text-lg text-white shadow-neon-purple transition active:scale-90 disabled:opacity-40"
              aria-label="ارسال"
            >
              ✈️
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { PRODUCTS, getProduct, type Product } from '~/data/products'
import { formatPrice } from '~/types/product'
import { useCartStore } from '~/stores/cart'

interface Msg {
  id: number
  role: 'ai' | 'user'
  text: string
  typing?: boolean
}
interface Option {
  id: string
  label: string
  icon: string
  desc?: string
}
interface Answers {
  taste: string
  smoke: string
  device: string
  ice: string
}
interface Scored {
  product: Product
  match: number
  reason: string
}

const open = useState<boolean>('assistantOpen', () => false)
const cart = useCartStore()
const scrollRef = ref<HTMLElement | null>(null)

const messages = ref<Msg[]>([])
const results = ref<Scored[]>([])
const stage = ref('welcome')
const busy = ref(false)
const input = ref('')
const answers = reactive<Answers>({ taste: '', smoke: '', device: '', ice: '' })
let msgId = 0

const QUICK_REPLIES = ['ارزان‌ترین چی داری؟ 💰', 'خنک‌ترین طعم یخی؟ ❄️', 'برای ترک سیگار 🚭', '🔄 شروع دوباره']

const STAGES: Record<string, { q: string; options: Option[]; next: string }> = {
  taste: {
    q: 'اول بگو ذائقه‌ات چیه؟ چه طعمی بیشتر حالت رو خوب می‌کنه؟ 😋',
    options: [
      { id: 'fruit', label: 'میوه‌ای و تروپیکال', icon: '🍓', desc: 'انبه، بری میکس، هندوانه' },
      { id: 'ice', label: 'خنک و یخی (فراست)', icon: '❄️', desc: 'منتول، نعناع یخی قطبی' },
      { id: 'tobacco', label: 'تنباکویی کلاسیک', icon: '🍂', desc: 'تنباکو کارامل، سیگار برگ' },
      { id: 'dessert', label: 'دسری و شیرین', icon: '🍮', desc: 'وانیل، کارامل، کیک' },
    ],
    next: 'smoke',
  },
  smoke: {
    q: 'میزان مصرفت چقدره تا سطح نیکوتین مناسب گلوت رو تنظیم کنم؟ 🎯',
    options: [
      { id: 'light', label: 'سبک / تازه‌کار', icon: '🌱', desc: '۰ تا ۵ نخ در روز' },
      { id: 'medium', label: 'متوسط روزمره', icon: '🚬', desc: '۵ تا ۱۵ نخ در روز' },
      { id: 'heavy', label: 'سنگین و دائم', icon: '🔥', desc: 'بیش از ۱۵ نخ در روز' },
      { id: 'quit', label: 'می‌خوام سیگار رو ترک کنم', icon: '💪', desc: 'کمک برای جایگزینی سالم' },
    ],
    next: 'device',
  },
  device: {
    q: 'چه سبکی از دستگاه رو می‌پسندی؟ ⚙️',
    options: [
      { id: 'pod', label: 'پاد سیستم شیک و جیبی', icon: '🔋', desc: 'جمع‌وجور، مصرف روزمره' },
      { id: 'mod', label: 'ماد حرفه‌ای (حجم بخار بالا)', icon: '🎛️', desc: 'قدرت بالا، دود ابری' },
      { id: 'disposable', label: 'یکبارمصرف آماده', icon: '⚡', desc: 'بدون شارژ و تعویض کویل' },
      { id: 'salt', label: 'فقط سالت نیکوتین می‌خوام', icon: '🧪', desc: 'مایع باکیفیت برای پادم' },
    ],
    next: 'ice',
  },
  ice: {
    q: 'آخرین سوال! چقدر حس خنکی و یخ دوست داری؟ 🧊',
    options: [
      { id: 'none', label: 'بدون یخ (طبیعی)', icon: '🚫', desc: 'طعم خالص و گرم' },
      { id: 'low', label: 'خنکی ملایم', icon: '❄️', desc: 'ته‌مایه نسیم خنک' },
      { id: 'high', label: 'یخبندان قطبی!', icon: '🧊', desc: 'حس شدید یخ در گلو' },
    ],
    next: 'result',
  },
}

const currentOptions = computed<Option[]>(() => {
  if (busy.value) return []
  return STAGES[stage.value]?.options ?? []
})
const showQuickReplies = computed(() => stage.value === 'chat' && !busy.value)

const toFa = (n: number | string): string =>
  Number(n).toLocaleString('fa-IR', { maximumFractionDigits: 1 })

function scrollBottom() {
  nextTick(() => {
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function pushUser(text: string) {
  messages.value.push({ id: ++msgId, role: 'user', text })
  scrollBottom()
}

function aiSay(text: string): Promise<void> {
  return new Promise((resolve) => {
    busy.value = true
    const msg: Msg = { id: ++msgId, role: 'ai', text: '', typing: true }
    messages.value.push(msg)
    scrollBottom()
    let i = 0
    const timer = setInterval(() => {
      i += 3
      msg.text = text.slice(0, i)
      scrollBottom()
      if (i >= text.length) {
        clearInterval(timer)
        msg.typing = false
        busy.value = false
        resolve()
      }
    }, 22)
  })
}

async function start() {
  messages.value = []
  results.value = []
  answers.taste = ''
  answers.smoke = ''
  answers.device = ''
  answers.ice = ''
  await aiSay('سلام! من «ساملیه» هستم، دستیار هوشمند طعم و پاد در لوکس ویپ ✨ با ۴ تا سوال کوتاه، دقیق‌ترین طعم و دستگاه متناسب با ذائقه‌ات رو برات پیدا می‌کنم. آماده‌ای؟')
  stage.value = 'taste'
  await aiSay(STAGES.taste!.q)
}

async function select(o: Option) {
  if (busy.value) return
  pushUser(`${o.icon} ${o.label}`)
  results.value = []
  if (stage.value === 'taste') answers.taste = o.id
  if (stage.value === 'smoke') answers.smoke = o.id === 'quit' ? 'medium' : o.id
  if (stage.value === 'device') answers.device = o.id
  if (stage.value === 'ice') answers.ice = o.id
  const next = STAGES[stage.value]!.next
  if (next === 'result') {
    stage.value = 'thinking'
    await aiSay('در حال آنالیز طعم‌ها و سازگاری با سلیقه شما... 🧠✨')
    await recommend()
  } else {
    stage.value = next
    await new Promise((r) => setTimeout(r, 300))
    await aiSay(STAGES[next]!.q)
  }
}

function recommend(): Promise<void> {
  const desiredCool = { none: 10, low: 45, high: 90 }[answers.ice] ?? 45
  const needNic = { light: 20, medium: 30, heavy: 50 }[answers.smoke as string] ?? 30

  const scored = PRODUCTS.map((p) => {
    let s = 0
    const reasons: string[] = []
    const dev = answers.device
    const catOk =
      (dev === 'pod' && (p.category === 'pod' || p.category === 'salt')) ||
      (dev === 'salt' && p.category === 'salt') ||
      (dev === 'mod' && p.category === 'device') ||
      (dev === 'disposable' && p.category === 'disposable')
    if (catOk) {
      s += 30
      reasons.push('دستگاه و مدل دلخواهت')
    }
    if (p.tags.includes(answers.taste)) {
      s += 25
      const tasteFa: Record<string, string> = { fruit: 'میوه‌ای', ice: 'یخی', tobacco: 'تنباکویی', dessert: 'دسری' }
      reasons.push(`طعم ${tasteFa[answers.taste] ?? ''} محبوبت`)
    }
    s += Math.max(0, 20 - Math.abs(p.profile.cooling - desiredCool) / 5)
    if (p.nicotine.includes(needNic)) {
      s += 15
      reasons.push(`نیکوتین ${needNic}mg مناسب گلوت`)
    }
    s += p.rating * 1.5 + Math.min(5, p.reviews / 150)
    if (p.badges?.includes('پرفروش‌ترین')) s += 4
    return { p, s, reason: reasons.slice(0, 2).join(' + ') || 'پیشنهاد هوشمند' }
  })
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)

  const top = scored[0]!.s
  results.value = scored.map(({ p, s, reason }, i) => ({
    product: p,
    reason,
    match: Math.min(98, Math.max(82 - i * 4, Math.round(90 + ((s - top) / Math.max(top, 1)) * 35))),
  }))

  const nicFa = needNic === 20 ? '۲۰mg (یا بدون نیکوتین)' : needNic === 30 ? '۳۰mg' : '۵۰mg'
  stage.value = 'chat'
  return aiSay(
    `آنالیز انجام شد! 🎉 این ۳ کالا بیشترین هماهنگی رو با سلیقه شما دارن. نیکوتین پیشنهادی برای شما: ${nicFa}. می‌تونی مستقیماً به سبد خرید اضافه‌شون کنی یا هر سوالی داری ازم بپرسی! 👇`,
  )
}

async function sendUser(text: string) {
  const q = text.trim()
  if (!q || busy.value) return
  input.value = ''
  if (q.includes('شروع دوباره')) {
    stage.value = 'welcome'
    await start()
    return
  }
  pushUser(q)
  await new Promise((r) => setTimeout(r, 350))
  await aiSay(freeAnswer(q))
}

function freeAnswer(q: string): string {
  const has = (...words: string[]) => words.some((w) => q.includes(w))
  if (has('ارزون', 'ارزان', 'قیمت', 'پایین')) {
    const cheap = [...PRODUCTS].filter((p) => p.inStock).sort((a, b) => a.price - b.price)[0]!
    results.value = [{ product: cheap, match: 96, reason: 'بهترین قیمت فروشگاه' }]
    return `ارزان‌ترین گزینه‌مون «${cheap.name}» با قیمت استثنایی ${formatPrice(cheap.price)} هستش! 💰 کیفیت تضمینی و امتیاز ${toFa(cheap.rating)}.`
  }
  if (has('خنک', 'یخ', 'منتول', 'فراست')) {
    const cool = [...PRODUCTS].sort((a, b) => b.profile.cooling - a.profile.cooling)[0]!
    results.value = [{ product: cool, match: 98, reason: 'یخی‌ترین طعم موجود' }]
    return `اگه عاشق خنکی و حس طراوت هستی، «${cool.name}» با خنکی ۹۵٪ حرف اول رو می‌زنه! ❄️🧊`
  }
  if (has('ترک', 'سیگار')) {
    const t = getProduct('tobacco-gold')!
    results.value = [{ product: t, match: 97, reason: 'بهترین جایگزین سیگار' }]
    return `برای ترک سیگار سنتی، سالت «${t.name}» با گیرایی گلو عالی و طعم اصیل بهترین انتخابه. 💪`
  }
  if (has('قوی', 'ماد', 'بخار', 'دود زیاد', 'کلاد')) {
    const m = getProduct('cloud-beast-mod')!
    results.value = [{ product: m, match: 95, reason: '۲۰۰ وات قدرت بخار' }]
    return `برای حجم بخار فوق‌العاده و حرفه‌ای، ماد «${m.name}» با توان ۲۰۰ وات بی‌رقیبه! 🌩️`
  }
  if (has('پرفروش', 'بهترین', 'پیشنهاد')) {
    const b = getProduct('luxe-x-pod')!
    results.value = [{ product: b, match: 95, reason: 'محبوب‌ترین انتخاب خریداران' }]
    return `پرفروش‌ترین دستگاه ما «${b.name}» هستش با بیش از ۴۰۰ نظر مثبت! ⭐`
  }
  if (has('سلام', 'درود', 'هی')) return 'سلام عزیز! 👋 من اینجام تا دقیق‌ترین محصول رو متناسب با ذائقه‌ات معرفی کنم. بگو چه طعمی بیشتر دوست داری؟'
  if (has('ممنون', 'مرسی', 'تشکر')) return 'خواهش می‌کنم! 😊 هر سوال دیگه‌ای در مورد طعم‌ها یا نحوه مصرف داشتی در خدمتم. دود خوش! 💨'
  if (has('ارسال', 'پست')) return `ارسال سفارشات به سراسر کشور ۱ تا ۳ روزه انجام می‌شه 📦 و برای خریدهای بالای ${formatPrice(499)} کاملاً رایگانه!`
  return 'سوال بسیار خوبی بود! من متخصص انواع طعم و دستگاه هستم. می‌تونی بپرسی «خنک‌ترین طعم چیه؟» یا «برای مصرف سبک چی خوبه؟» — یا دکمه 🔄 شروع دوباره رو بزنی.'
}

function suggestedNicotine(p: Product): number | undefined {
  const need = { light: 20, medium: 30, heavy: 50 }[answers.smoke as string]
  if (need && p.nicotine.includes(need)) return need
  return p.nicotine.includes(0) ? undefined : p.nicotine[0]
}

function quickAdd(p: Product) {
  cart.add(p.id, p.flavors[0]?.id, suggestedNicotine(p), 1)
}

function close() {
  open.value = false
}

watch(open, (v) => {
  if (v && messages.value.length === 0 && stage.value === 'welcome') start()
})

// درگ لمسی برای بستن در موبایل
const dragY = ref(0)
const dragging = ref(false)
let startY = 0
let canDrag = false
const sheetStyle = computed(() => ({
  transform: dragY.value ? `translateY(${dragY.value}px)` : '',
  transition: dragging.value ? 'none' : '',
}))
function onGripStart(e: TouchEvent) {
  canDrag = true
  startY = e.touches[0]?.clientY ?? 0
  dragging.value = true
  dragY.value = 0
}
function onTouchStart(e: TouchEvent) {
  const el = scrollRef.value
  if (el && el.scrollTop <= 0) {
    canDrag = true
    startY = e.touches[0]?.clientY ?? 0
    dragging.value = true
    dragY.value = 0
  }
}
function onTouchMove(e: TouchEvent) {
  if (!canDrag || !dragging.value) return
  const y = e.touches[0]?.clientY ?? 0
  const dy = y - startY
  if (dy > 0) dragY.value = dy
}
function onTouchEnd() {
  if (!dragging.value) return
  dragging.value = false
  canDrag = false
  if (dragY.value > 120) close()
  dragY.value = 0
}
</script>
