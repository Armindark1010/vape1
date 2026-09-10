<template>
  <div class="fixed inset-0 z-0 overflow-hidden bg-vapor-950" aria-hidden="true">
    <canvas ref="canvasRef" class="block h-full w-full" />
    <!-- وینیت + گرادیان برای خوانایی محتوا -->
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(9,9,11,0.8)_100%)]"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-vapor-950/70 via-transparent to-vapor-950/95"
    />
    <!-- هاله‌های نئونی ثابت -->
    <div
      class="pointer-events-none absolute -top-24 -start-24 h-72 w-72 rounded-full bg-neon-purple/15 blur-[100px]"
    />
    <div
      class="pointer-events-none absolute bottom-10 -end-24 h-80 w-80 rounded-full bg-neon-ice/10 blur-[110px]"
    />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'

/**
 * پس‌زمینه دود سه‌بعدی تعاملی (Three.js)
 * - ذرات GPU با شیدر سفارشی (بدون تکسچر خارجی)
 * - تعامل لمسی/ماوس: دود از انگشت کنار می‌رود
 * - گاورنر خودکار FPS: کاهش/افزایش تعداد ذرات و پیکسل‌ریشو
 * - توقف هوشمند + احترام به prefers-reduced-motion
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
    // بالا رفتن چرخه‌ای دود
    p.y = mod(p.y + t * 0.16 + 2.0, 4.0) - 2.0;
    // چرخش مارپیچ
    p.x += sin(t * 0.55 + p.y * 2.1) * 0.28;
    p.z += cos(t * 0.42 + p.y * 1.6) * 0.22;
    // دافعه لمسی
    vec2 d = p.xy - uTouch * vec2(2.4, 2.0);
    float dist = length(d);
    float push = smoothstep(1.0, 0.0, dist) * 0.4;
    p.xy += normalize(d + vec2(0.0001)) * push;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = aScale * (1.0 + push * 2.2);
    gl_PointSize = size * uPixelRatio * (150.0 / -mv.z);
    vColor = aColor;
    vAlpha = smoothstep(2.0, 0.35, abs(p.y)) * 0.5;
  }
`

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.04, d) * vAlpha;
    a *= 0.72 + 0.28 * sin(uv.x * 22.0 + uv.y * 15.0);
    if (a < 0.003) discard;
    gl_FragColor = vec4(vColor, a);
  }
`

const PALETTE = ['#a855f7', '#8b5cf6', '#34d399', '#67e8f9', '#f472b6', '#38bdf8']
const MAX_PARTICLES = 1400

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
    { count: 350, pr: 1 },
    { count: 800, pr: Math.min(dpr, 1.5) },
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

  // ---------- ساخت ذرات ----------
  const positions = new Float32Array(MAX_PARTICLES * 3)
  const colors = new Float32Array(MAX_PARTICLES * 3)
  const scales = new Float32Array(MAX_PARTICLES)
  const speeds = new Float32Array(MAX_PARTICLES)
  const offsets = new Float32Array(MAX_PARTICLES)
  const tmpColor = new THREE.Color()

  for (let i = 0; i < MAX_PARTICLES; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4.8
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4.0
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0
    tmpColor.set(PALETTE[(Math.random() * PALETTE.length) | 0])
    colors[i * 3] = tmpColor.r
    colors[i * 3 + 1] = tmpColor.g
    colors[i * 3 + 2] = tmpColor.b
    scales[i] = 6 + Math.random() * 18
    speeds[i] = 0.25 + Math.random() * 0.85
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

  // ---------- تعامل لمسی ----------
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

  // حالت کاهش حرکت: فقط یک فریم ثابت
  if (prefersReduced) {
    uniforms.uTime.value = 4
    renderer.render(scene, camera)
    return
  }

  // ---------- حلقه رندر + گاورنر FPS ----------
  const clock = new THREE.Clock()
  let raf = 0
  let frames = 0
  let acc = 0
  let goodWindows = 0
  let running = true

  const onVisibility = () => {
    running = !document.hidden
    if (running) clock.getDelta() // جلوگیری از پرش زمانی
  }
  document.addEventListener('visibilitychange', onVisibility)

  function govern(dt: number) {
    frames++
    acc += dt
    if (frames >= 90) {
      const avgFps = frames / acc
      if (avgFps < 45 && qi > 0) {
        qi--
        applyQuality()
        goodWindows = 0
      } else if (avgFps > 57 && qi < QUALITY.length - 1) {
        goodWindows++
        if (goodWindows >= 2) {
          qi++
          applyQuality()
          goodWindows = 0
        }
      } else {
        goodWindows = 0
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

    // برگشت نرم لمس به حالت شناور خودکار بعد از ۳ ثانیه بی‌حرکتی
    if (performance.now() - lastInteract > 3000) {
      touchTarget.set(Math.sin(t * 0.3) * 0.6, Math.cos(t * 0.22) * 0.5)
    }
    uniforms.uTouch.value.lerp(touchTarget, 0.06)

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
