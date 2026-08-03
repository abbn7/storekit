# 🚂 دليل النشر على Railway — 3 خطوات بس

> **الهدف:** ترفع الكود على GitHub وتضغط نشر — خلاص.
> قاعدة البيانات تتنشئ وتتملأ بالبيانات تلقائياً، والمتجر يشتغل من أول تشغيل.

---

## الخطوة 1️⃣ — أنشئ مشروع من GitHub

1. اذهب إلى [railway.com](https://railway.com) وسجّل دخول بـ GitHub
2. اضغط **"New Project"** → **"Deploy from GitHub repo"**
3. ابحث عن الريبو `storekit` واضغط **Deploy**
4. Railway يكتشف الـ `Dockerfile` تلقائياً ويبدأ البناء

---

## الخطوة 2️⃣ — أضف قاعدة البيانات

1. داخل المشروع اضغط **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway يربط `DATABASE_URL` تلقائياً — **لا تفعل شيء**

---

## الخطوة 3️⃣ — اضغط Deploy ✅

المتجر يبدأ تلقائياً ويفعل:
- ✅ ينشئ كل جداول قاعدة البيانات
- ✅ يضيف المنتجات والمجموعات والإعدادات
- ✅ يعمل كاملاً بدون أي إجراء يدوي

---

## 🔐 كلمات السر الافتراضية

| الوصول | الرابط | الكلمة الافتراضية |
|---|---|---|
| لوحة الإدارة | `/admin` | `storekit2024` |

> **غيّر كلمة السر** من Railway Variables → أضف `ADMIN_PASSWORD` بكلمتك الخاصة

---

## ⚡ متغيرات اختيارية (تضيفها متى تريد)

### 🔑 تسجيل الدخول للعملاء (Clerk)
```
VITE_CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY           = sk_live_...
```
> بدونها: صفحات الحساب والـ Checkout مخفية (المتجر يشتغل)

### 💳 الدفع الحقيقي (Stripe)
```
STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_SECRET_KEY      = sk_live_...
```
> بدونها: الـ Checkout يعمل في "Test Mode" (طلبات وهمية)

### 🔒 رفع الصور (اختياري)
```
ADMIN_PASSWORD = كلمتك_الخاصة
```

---

## 📦 Volume للصور المرفوعة

> إذا أضاف العميل صور من الداشبورد، أضف Volume لحفظها:

1. **Service → Volumes → Add Volume**
2. **Mount Path:** `/app/uploads`

---

## 🔄 تحديث المتجر لاحقاً

```bash
git add .
git commit -m "update"
git push
```
Railway يشوف الـ push ويبني ويحدّث تلقائياً — بدون أي تدخل.

---

## 🎁 تسليم المتجر للعميل

بعد ما يظهر الموقع على Railway:

```
🌐 رابط المتجر:      https://your-project.up.railway.app
⚙️ لوحة الإدارة:     https://your-project.up.railway.app/admin
🔑 كلمة السر:        storekit2024 (غيّرها من Variables)
```

كل `git push` = نشر تلقائي جديد.
