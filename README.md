# 💨 لوکس ویپ — فروشگاه تخصصی ویپ، سالت و پاد

فروشگاه اینترنتی فوق‌لوکس، پرسرعت و انیمیت‌شده با معماری **Mobile-First**، پس‌زمینه دود سه‌بعدی تعاملی و دستیار هوشمند انتخاب طعم.

## ✨ ویژگی‌ها

| بخش | توضیح |
|---|---|
| 🌫️ `VaporBackground.vue` | دود ۳D با Three.js + شیدر سفارشی، تعامل لمسی، گاورنر خودکار FPS |
| ✨ `AIFlavorAssistant.vue` | دستیار «ساملیه»: کوییز ۴ مرحله‌ای، افکت تایپ زنده، پیشنهاد هوشمند + افزودن سریع به سبد |
| 🛍️ `pages/products/[id].vue` | گالری سوایپی با زوم، انتخاب طعم/نیکوتین، نمودار پروفایل طعم، شیت مشخصات فنی، هشدار سازگاری، اکشن‌بار چسبان |
| 📱 `MobileBottomNav.vue` | نوبار پایین با دکمه مرکزی AI، بج سبد خرید، مخفی‌شدن هوشمند در صفحه محصول |
| 🛒 `CartBottomSheet.vue` | سبد خرید کشویی با نوار پیشرفت ارسال رایگان و ثبت سفارش |
| 🎞️ انیمیشن | GSAP + VueUse Motion + ترنزیشن‌های Bottom Sheet |

## 🛠 تکنولوژی‌ها

- **Nuxt 3 + Vue 3 + TypeScript**
- **Tailwind CSS** (تم Dark Vapor `#09090B` + نئون بنفش/سبز/یخی)
- **Three.js** (ذرات GPU، بدون تکسچر خارجی)
- **GSAP / VueUse Motion** (انیمیشن‌های Touch و اسکرول)
- **Pinia** (سبد خرید با ذخیره‌سازی localStorage)

## 🚀 اجرا

```bash
# نصب وابستگی‌ها
npm install

# اجرای محیط توسعه (http://localhost:3000)
npm run dev

# بیلد نهایی
npm run build

# پیش‌نمایش بیلد
npm run preview
```

## 📁 ساختار

```
├── assets/css/main.css        # استایل سراسری + ترنزیشن‌ها
├── components/
│   ├── VaporBackground.vue    # پس‌زمینه Three.js
│   ├── AIFlavorAssistant.vue  # دستیار هوشمند
│   ├── MobileBottomNav.vue    # نوبار پایین
│   ├── CartBottomSheet.vue    # سبد خرید کشویی
│   ├── ProductCard.vue        # کارت محصول
│   ├── FlavorProfileBars.vue  # نمودار طعم
│   ├── IceMeter.vue           # نشانگر خنکی
│   ├── SiteHeader.vue         # هدر
│   └── AppToast.vue           # اعلان‌ها
├── data/products.ts           # دیتای محصولات
├── layouts/default.vue        # لی‌اوت اصلی
├── pages/
│   ├── index.vue              # خانه
│   ├── products/[id].vue      # صفحه محصول
│   ├── products/index.vue     # فروشگاه + فیلتر
│   ├── search.vue             # جستجو
│   └── profile.vue            # پروفایل
├── plugins/motion.client.ts   # پلاگین VueUse Motion
├── stores/cart.ts             # استور سبد خرید
└── types/product.ts           # تایپ‌ها + راهنمای نیکوتین
```

> 🔞 فروش محصولات نیکوتین‌دار فقط به افراد بالای ۱۸ سال مجاز است.
