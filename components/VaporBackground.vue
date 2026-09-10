<template>
  <div class="fixed inset-0 z-0 overflow-hidden bg-[#070709] pointer-events-none select-none" aria-hidden="true">
    <!-- بستر سه‌بعدی ذرات دود -->
    <canvas ref="canvasRef" class="block h-full w-full opacity-60 transition-opacity duration-1000" />

    <!-- لایه‌های وینیِت و فیلتر تیره برای تضمین خوانایی ۱۰۰٪ متون و کارت‌ها (WCAG AAA) -->
    <!-- ۱. گرادیان شعاعی مرکز برای تاریک نگه داشتن پشت متون -->
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,7,9,0.75)_0%,rgba(7,7,9,0.92)_70%,rgba(7,7,9,0.98)_100%)]"
    />

    <!-- ۲. گرادیان عمودی از بالا و پایین -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-[#070709]/90 via-transparent to-[#070709]/95"
    />

    <!-- ۳. هاله‌های نوری آمبینت ملایم در گوشه‌ها (بدون تداخل با متن) -->
    <div
      class="absolute -top-32 -start-32 h-96 w-96 rounded-full bg-neon-purple/[0.12] blur-[120px]"
    />
    <div
      class="absolute top-1/3 -end-32 h-96 w-96 rounded-full bg-neon-ice/[0.08] blur-[130px]"
    />
    <div
      class="absolute -bottom-32 start-1/4 h-96 w-96 rounded-full bg-neon-green/[0.07] blur-[140px]"
    />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'

/**
 * پس‌زمینه دود سه‌بعدی بهینه‌شده و لوکس (Three.js)
 * - کنترل دقیق آلفا و شیدر برای حفظ کنتراست حداکثری متون
 * - پاسخگویی به ماوس و لمس با دافعه نرم
 * - مدیریت خودکار نرخ فریم (FPS Governor)
 * - احترام به prefers-reduced-motion
 */

const canvasRef = ref<HTMLCanvasElement | null>(null)

const VERT = /* glsl */ `
  attribute float aScale;
  attribute float aSpeed;
  attribute float aOffset;
  attribute vec3 aColor;
  uniform float uTime;
  uniform vec2 uTouch;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime * aSpeed + aOffset;

    // بالا رفتن نرم و متناوب دود
    p.y = mod(p.y + t * 0.12 + 2.5, 5.0) - 2.5;

    // موج و چرخش متقارن طبیعی
    p.x += sin(t * 0.4 + p.y * 1.5) * 0.35;
    p.z += cos(t * 0.3 + p.y * 1.2) * 0.25;

    // دافعه نرم نسبت به موقعیت نشانگر
    vec2 d = p.xy - uTouch * vec2(2.5, 2.0);
    float dist = length(d);
    float push = smoothstep(1.2, 0.0, dist) * 0.45;
    p.xy += normalize(d + vec2(0.0001)) * push;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = aScale * (1.0 + push * 1.8);
    gl_PointSize = size * uPixelRatio * (140.0 / -mv.z);

    vColor = aColor;
    // شفافیت محو در لبه‌های بالا و پایین برای حرکت پیوسته و لطیف
    vAlpha = smoothstep(2.5, 0.4, abs(p.y)) * 0.38;
  }
`

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    // لبه بسیار نرم بدون بریدگی دایره‌ای
    float a = smoothstep(0.5, 0.02, d) * vAlpha;
    // بافت ظریف مه‌گونه
    a *= 0.8 + 0.2 * sin(uv.x * 18.0 + uv.y * 12.0);
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }
`

// پالت رنگی دود لوکس و ملایم (ترکیب ویپ، منتول و نئون بنفش)
const PALETTE = ['#9333ea', '#7c3aed', '#06b6d4', '#10b981', '#ec4899', '#3b82f6']
const MAX_PARTICLES = 1000

interface QualityLevel {
  count: number
  pr: number
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.innerWidth < 768
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const QUALITY: QualityLevel[] = [
    { count: 300, pr: 1 },
    { count: 650, pr: Math.min(dpr, 1.5) },
    { count: MAX_PARTICLES, pr: dpr },
  ]
  let qi = isMobile ? 1 : 2

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
  })
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10)
  camera.position.z = 3.2

  // ساخت ذرات
  const positions = new Float32Array(MAX_PARTICLES * 3)
  const colors = new Float32Array(MAX_PARTICLES * 3)
  const scales = new Float32Array(MAX_PARTICLES)
  const speeds = new Float32Array(MAX_PARTICLES)
  const offsets = new Float32Array(MAX_PARTICLES)
  const tmpColor = new THREE.Color()

  for (let i = 0; i < MAX_PARTICLES; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5.2
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5.0
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2.2
    tmpColor.set(PALETTE[(Math.random() * PALETTE.length) | 0])
    colors[i * 3] = tmpColor.r
    colors[i * 3 + 1] = tmpColor.g
    colors[i * 3 + 2] = tmpColor.b
    scales[i] = 8 + Math.random() * 20
    speeds[i] = 0.2 + Math.random() * 0.6
    offsets[i] = Math.random() * 20
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1))

  const uniforms = {
    uTime: { value: 0 },
    uTouch: { value: new THREE.Vector2(10, 10) },
    uPixelRatio: { value: QUALITY[qi]!.pr },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  scene.add(points)

  function applyQuality() {
    const q = QUALITY[qi]!
    geometry.setDrawRange(0, q.count)
    renderer.setPixelRatio(q.pr)
    uniforms.uPixelRatio.value = q.pr
    onResize()
  }

  function onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }

  // تعامل نرم با اشاره‌گر
  const touchTarget = new THREE.Vector2(10, 10)
  let lastInteract = 0
  const setFromClient = (x: number, y: number) => {
    touchTarget.set((x / window.innerWidth) * 2 - 1, -((y / window.innerHeight) * 2 - 1))
    lastInteract = performance.now()
  }
  const onPointerMove = (e: PointerEvent) => setFromClient(e.clientX, e.clientY)
  const onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0]
    if (t) setFromClient(t.clientX, t.clientY)
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchstart', onTouchMove, { passive: true })
  window.addEventListener('resize', onResize)

  applyQuality()

  if (prefersReduced) {
    uniforms.uTime.value = 4
    renderer.render(scene, camera)
    return
  }

  const clock = new THREE.Clock()
  let raf = 0
  let frames = 0
  let acc = 0
  let running = true

  const onVisibility = () => {
    running = !document.hidden
    if (running) clock.getDelta()
  }
  document.addEventListener('visibilitychange', onVisibility)

  function govern(dt: number) {
    frames++
    acc += dt
    if (frames >= 90) {
      const avgFps = frames / acc
      if (avgFps < 40 && qi > 0) {
        qi--
        applyQuality()
      } else if (avgFps > 57 && qi < QUALITY.length - 1) {
        qi++
        applyQuality()
      }
      frames = 0
      acc = 0
    }
  }

  function tick() {
    raf = requestAnimationFrame(tick)
    if (!running) return
    const dt = Math.min(clock.getDelta(), 0.1)
    const t = clock.elapsedTime
    uniforms.uTime.value = t

    if (performance.now() - lastInteract > 2500) {
      touchTarget.set(Math.sin(t * 0.25) * 0.5, Math.cos(t * 0.18) * 0.4)
    }
    uniforms.uTouch.value.lerp(touchTarget, 0.05)

    govern(dt)
    renderer.render(scene, camera)
  }
  tick()

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchstart', onTouchMove)
    window.removeEventListener('resize', onResize)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  })
})
</script>
