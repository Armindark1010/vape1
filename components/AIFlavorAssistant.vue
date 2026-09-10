<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        @click="close"
      />
    </Transition>
    <Transition name="sheet">
      <div
        v-if="open"
        class="glass-strong fixed inset-x-0 bottom-0 z-[71] mx-auto flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl shadow-neon-purple"
        :style="sheetStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- دستگیره درگ -->
        <div class="flex cursor-grab justify-center pb-1 pt-3" @touchstart.stop="onGripStart">
          <div class="h-1.5 w-12 rounded-full bg-white/20" />
        </div>

        <!-- هدر -->
        <div class="flex items-center gap-3 border-b border-white/10 px-4 pb-3">
          <div class="relative">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple via-neon-violet to-neon-blue text-xl shadow-neon-purple"
            >
              ✨
            </div>
            <span class="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-vapor-900 bg-neon-green" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-extrabold">ساملیه هوشمند طعم</p>
            <p class="flex items-center gap-1 text-[11px] text-neon-green">
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-green" />
              آنلاین — متخصص ویپ و سالت
            </p>
          </div>
          <button
            class="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            @click="close"
            aria-label="بستن"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- پیام‌ها -->
        <div ref="scrollRef" class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <div
            v-for="m in messages"
            :key="m.id"
            class="flex"
            :class="m.role === 'user' ? 'justify-start' : 'justify-end'"
          >
            <div
              v-if="m.role === 'ai'"
              class="max-w-[85%] rounded-2xl rounded-tr-md border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-[13px] leading-6 text-zinc-100"
            >
              <span v-if="m.typing && !m.text" class="typing-dots"><span /><span /><span /></span>
              <span v-else>{{ m.text }}<span v-if="m.typing" class="animate-pulse text-neon-purple">▍</span></span>
            </div>
            <div
              v-else
              class="max-w-[85%] rounded-2xl rounded-tl-md bg-gradient-to-l from-neon-purple to-neon-violet px-3.5 py-2.5 text-[13px] font-bold leading-6 text-white shadow-neon-purple"
            >
              {{ m.text }}
            </div>
          </div>

          <!-- کارت‌های پیشنهادی -->
          <div v-if="results.length > 0" class="space-y-2.5 pt-1">
            <div
              v-for="r in results"
              :key="r.product.id"
              v-motion
              :initial="{ opacity: 0, y: 24, scale: 0.97 }"
              :enter="{ opacity: 1, y: 0, scale: 1 }"
              class="glass overflow-hidden rounded-2xl"
            >
              <div class="flex gap-3 p-3">
                <NuxtLink
                  :to="`/products/${r.product.id}`"
                  class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-ice/20"
                  @click="close"
                >
                  <img :src="r.product.images[0]" :alt="r.product.name" class="h-full w-full object-cover" loading="lazy" />
                  <span
                    class="absolute start-1 top-1 rounded-full bg-neon-green/90 px-1.5 py-0.5 text-[10px] font-black text-vapor-950"
                  >
                    {{ r.match }}٪
                  </span>
                </NuxtLink>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[13px] font-extrabold">{{ r.product.name }}</p>
                  <p class="truncate text-[11px] text-zinc-400">{{ r.reason }}</p>
                  <div class="mt-1 flex items-center justify-between">
                    <p class="text-[13px] font-black text-neon-green">
                      {{ formatPrice(r.product.price) }}
                    </p>
                    <p class="text-[10px] text-zinc-500">⭐ {{ toFa(r.product.rating) }} ({{ toFa(r.product.reviews) }})</p>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 border-t border-white/10 p-2">
                <button
                  class="flex-1 rounded-xl bg-gradient-to-l from-neon-purple to-neon-blue py-2 text-xs font-extrabold text-white transition active:scale-95"
                  @click="quickAdd(r.product)"
                >
                  🛒 افزودن سریع
                </button>
                <NuxtLink
                  :to="`/products/${r.product.id}`"
                  class="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-zinc-200 transition active:scale-95"
                  @click="close"
                >
                  مشاهده
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- گزینه‌های مرحله -->
          <div v-if="currentOptions.length > 0 && !busy" class="grid grid-cols-2 gap-2 pt-1">
            <button
              v-for="o in currentOptions"
              :key="o.id"
              v-motion
              :initial="{ opacity: 0, y: 12 }"
              :enter="{ opacity: 1, y: 0 }"
              class="glass group rounded-2xl p-3 text-center transition-all duration-200 hover:border-neon-purple/60 hover:bg-neon-purple/10 active:scale-95"
              @click="select(o)"
            >
              <span class="text-2xl">{{ o.icon }}</span>
              <p class="mt-1 text-xs font-extrabold">{{ o.label }}</p>
              <p v-if="o.desc" class="mt-0.5 text-[10px] text-zinc-400">{{ o.desc }}</p>
            </button>
          </div>

          <!-- پاسخ‌های سریع -->
          <div v-if="showQuickReplies" class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              v-for="q in QUICK_REPLIES"
              :key="q"
              class="chip whitespace-nowrap"
              @click="sendUser(q)"
            >
              {{ q }}
            </button>
          </div>
        </div>

        <!-- ورودی چت -->
        <div v-if="showQuickReplies" class="border-t border-white/10 p-3 safe-bottom">
          <form class="flex gap-2" @submit.prevent="sendUser(input)">
            <input
              v-model="input"
              type="text"
              placeholder="سوالت رو بپرس... (مثلاً: خنک‌ترین طعم؟)"
              class="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[13px] text-white placeholder:text-zinc-500 focus:border-neon-purple/60 focus:outline-none"
            />
            <button
              type="submit"
              :disabled="!input.trim() || busy"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue text-lg shadow-neon-purple transition active:scale-90 disabled:opacity-40"
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

const QUICK_REPLIES = ['ارزون‌ترین چی داری؟ 💰', 'خنک‌ترین طعم؟ ❄️', 'برای ترک سیگار 🚭', '🔄 شروع دوباره']

const STAGES: Record<string, { q: string; options: Option[]; next: string }> = {
  taste: {
    q: 'اول بگو ذائقه‌ات چیه؟ چه طعمی بیشتر حالت رو خوب می‌کنه؟ 😋',
    options: [
      { id: 'fruit', label: 'میوه‌ای', icon: '🍓', desc: 'انبه، بری، هندوانه' },
      { id: 'ice', label: 'خنک و یخی', icon: '❄️', desc: 'منتول و فراست' },
      { id: 'tobacco', label: 'تنباکو', icon: '🍂', desc: 'کلاسیک و سنگین' },
      { id: 'dessert', label: 'دسر و شیرین', icon: '🍮', desc: 'کارامل، وانیل' },
    ],
    next: 'smoke',
  },
  smoke: {
    q: 'چقدر سیگار می‌کشی؟ (تا نیکوتین درست رو برات پیدا کنم 🎯)',
    options: [
      { id: 'light', label: 'سبک / تازه‌کار', icon: '🌱', desc: '۰ تا ۵ نخ در روز' },
      { id: 'medium', label: 'متوسط', icon: '🚬', desc: '۵ تا ۱۵ نخ در روز' },
      { id: 'heavy', label: 'سنگین', icon: '🔥', desc: 'بیش از ۱۵ نخ' },
      { id: 'quit', label: 'می‌خوام ترک کنم', icon: '💪', desc: 'کمک برای ترک' },
    ],
    next: 'device',
  },
  device: {
    q: 'چه مدل دستگاهی دوست داری؟ جیبی باشه یا غول بخار؟ ⚙️',
    options: [
      { id: 'pod', label: 'جیبی و شیک (پاد)', icon: '🔋', desc: 'سبک، روزمره' },
      { id: 'mod', label: 'قوی و حرفه‌ای (ماد)', icon: '🎛️', desc: 'بخار زیاد' },
      { id: 'disposable', label: 'یکبارمصرف', icon: '⚡', desc: 'بدون دردسر' },
      { id: 'salt', label: 'فقط سالت می‌خوام', icon: '🧪', desc: 'برای پادم' },
    ],
    next: 'ice',
  },
  ice: {
    q: 'آخرین سوال! یخ و خنکی چقدر باشه؟ 🧊',
    options: [
      { id: 'none', label: 'بدون یخ', icon: '🚫', desc: 'طعم خالص' },
      { id: 'low', label: 'یخ کم', icon: '❄️', desc: 'ته‌مایه خنک' },
      { id: 'high', label: 'خیلی یخی!', icon: '🧊', desc: 'یخبندان کامل' },
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
    }, 24)
  })
}

async function start() {
  messages.value = []
  results.value = []
  answers.taste = ''
  answers.smoke = ''
  answers.device = ''
  answers.ice = ''
  await aiSay('سلام! من «ساملیه» هستم، دستیار هوشمند طعم لوکس ویپ ✨ با ۴ تا سوال کوتاه، دقیق‌ترین طعم و دستگاه رو برات پیدا می‌کنم. بزن بریم!')
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
    await aiSay('ممنون! بذار ذائقه‌ات رو آنالیز کنم... 🧠✨')
    await recommend()
  } else {
    stage.value = next
    await new Promise((r) => setTimeout(r, 350))
    await aiSay(STAGES[next]!.q)
  }
}

function recommend(): Promise<void> {
  const desiredCool = { none: 8, low: 45, high: 88 }[answers.ice] ?? 45
  const needNic = { light: 20, medium: 30, heavy: 50 }[answers.smoke as string] ?? 30

  const scored = PRODUCTS.map((p) => {
    let s = 0
    const reasons: string[] = []
    // تطابق دسته دستگاه
    const dev = answers.device
    const catOk =
      (dev === 'pod' && (p.category === 'pod' || p.category === 'salt')) ||
      (dev === 'salt' && p.category === 'salt') ||
      (dev === 'mod' && p.category === 'device') ||
      (dev === 'disposable' && p.category === 'disposable')
    if (catOk) {
      s += 30
      reasons.push('دقیقاً همون مدلیه که می‌خوای')
    }
    // تطابق ذائقه
    if (p.tags.includes(answers.taste)) {
      s += 25
      const tasteFa: Record<string, string> = { fruit: 'میوه‌ای', ice: 'یخی', tobacco: 'تنباکویی', dessert: 'دسری' }
      reasons.push(`طعم ${tasteFa[answers.taste] ?? ''} محبوبت`)
    }
    // نزدیکی خنکی
    s += Math.max(0, 20 - Math.abs(p.profile.cooling - desiredCool) / 5)
    // نیکوتین مناسب
    if (p.nicotine.includes(needNic)) {
      s += 15
      reasons.push(`نیکوتین ${needNic}mg مناسبته`)
    } else if (p.nicotine.length > 1) {
      s += 6
    }
    s += p.rating * 1.6 + Math.min(4, p.reviews / 200)
    if (p.badges?.includes('پرفروش‌ترین')) s += 4
    return { p, s, reason: reasons.slice(0, 2).join(' + ') || 'انتخاب پرطرفدار' }
  })
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)

  const top = scored[0]!.s
  results.value = scored.map(({ p, s, reason }, i) => ({
    product: p,
    reason,
    match: Math.min(98, Math.max(81 - i * 4, Math.round(88 + ((s - top) / Math.max(top, 1)) * 40))),
  }))

  const nicFa = needNic === 20 ? '۲۰mg (یا بدون نیکوتین)' : needNic === 30 ? '۳۰mg' : '۵۰mg'
  stage.value = 'chat'
  return aiSay(
    `تمومه! 🎉 این ۳ گزینه بالاترین تطابق رو با ذائقه‌ات دارن. نیکوتین پیشنهادی من برای تو: ${nicFa}. اگه سوالی داری بپرس یا مستقیم به سبد اضافه کن! 👇`,
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
  await new Promise((r) => setTimeout(r, 400))
  await aiSay(freeAnswer(q))
}

function freeAnswer(q: string): string {
  const has = (...words: string[]) => words.some((w) => q.includes(w))
  if (has('ارزون', 'قیمت', 'پایین')) {
    const cheap = [...PRODUCTS].filter((p) => p.inStock).sort((a, b) => a.price - b.price)[0]!
    results.value = [{ product: cheap, match: 95, reason: 'بهترین قیمت فروشگاه' }]
    return `ارزون‌ترین گزینه‌مون «${cheap.name}» فقط ${formatPrice(cheap.price)} هستش! 💰 کیفیتشم عالیه، امتیاز ${toFa(cheap.rating)} گرفته.`
  }
  if (has('خنک', 'یخ', 'منتول')) {
    const cool = [...PRODUCTS].sort((a, b) => b.profile.cooling - a.profile.cooling)[0]!
    results.value = [{ product: cool, match: 97, reason: 'یخی‌ترین طعم فروشگاه' }]
    return `اگه یخبندان می‌خوای، «${cool.name}» با خنکی ${toFa(cool.profile.cooling)} از ۱۰۰ حرف نداره! ❄️🧊`
  }
  if (has('ترک', 'سیگار')) {
    const t = getProduct('tobacco-gold')!
    results.value = [{ product: t, match: 96, reason: 'نزدیک‌ترین حس به سیگار' }]
    return `برای ترک سیگار، «${t.name}» با نیکوتین ۵۰mg بهترین انتخابه؛ گیرایی گلوش مثل سیگار واقعیه. 💪 تو می‌تونی!`
  }
  if (has('قوی', 'ماد', 'بخار', 'دود زیاد', 'کلاد')) {
    const m = getProduct('cloud-beast-mod')!
    results.value = [{ product: m, match: 94, reason: '۲۰۰ وات قدرت خالص' }]
    return `برای بخار غلیظ و حرفه‌ای، «${m.name}» هیولای واقعیه؛ ۲۰۰ وات قدرت! 🌩️`
  }
  if (has('پرفروش', 'بهترین', 'پیشنهاد')) {
    const b = getProduct('luxe-x-pod')!
    results.value = [{ product: b, match: 93, reason: 'پرفروش‌ترین فروشگاه' }]
    return `پرفروش‌ترینمون «${b.name}» هستش با امتیاز ${toFa(b.rating)} از ${toFa(b.reviews)} نظر! ⭐ انتخاب امنیه.`
  }
  if (has('سلام', 'درود', 'هی')) return 'سلام عزیز! 👋 من اینجام تا بهترین طعم رو برات پیدا کنم. بگو چه طعمی دوست داری؟'
  if (has('ممنون', 'مرسی', 'تشکر')) return 'قربانت! 😊 اگه چیز دیگه‌ای لازم داشتی من همینجام. دود خوش! 💨'
  if (has('ارسال', 'پست')) return `ارسال به سراسر سوئد ۱ تا ۳ روزه انجام می‌شه 📦 و برای خریدهای بالای ${formatPrice(499)} کاملاً رایگانه!`
  return 'سوال خوبیه! 🤔 من متخصص طعم و دستگاهم؛ مثلاً بپرس «خنک‌ترین طعم؟» یا «برای ترک سیگار چی خوبه؟» — یا با دکمه 🔄 شروع دوباره، کوییز رو از اول برو!'
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

// ---------- باز شدن: شروع گفتگو ----------
watch(open, (v) => {
  if (v && messages.value.length === 0 && stage.value === 'welcome') start()
})

// ---------- درگ برای بستن (سوایپ پایین) ----------
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
  if (dragY.value > 130) close()
  dragY.value = 0
}
</script>
