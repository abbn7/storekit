# 🚂 دليل النشر على Railway

## ما هو Railway؟
Railway منصة استضافة سحابية حديثة — أسرع وأسهل من Heroku، تدعم Docker مباشرةً، وتوفر قاعدة بيانات PostgreSQL مدمجة.

---

## الخطوات — من الصفر للنشر الكامل

### الخطوة 1: إنشاء حساب Railway
اذهب إلى [railway.com](https://railway.com) وسجّل دخول بـ GitHub.

---

### الخطوة 2: مشروع جديد من GitHub

1. من لوحة التحكم اضغط **"New Project"**
2. اختر **"Deploy from GitHub repo"**
3. ابحث عن اسم الريبو واضغط **Deploy**
4. Railway سيكتشف الـ `Dockerfile` تلقائياً ويبدأ البناء

---

### الخطوة 3: إضافة قاعدة البيانات PostgreSQL

1. داخل المشروع اضغط **"New"** → **"Database"** → **"PostgreSQL"**
2. سيتم إنشاء قاعدة البيانات تلقائياً
3. Railway **يضيف `DATABASE_URL` تلقائياً** — لا تحتاج لنسخه يدوياً

---

### الخطوة 4: ضبط متغيرات البيئة

في الـ Service الخاص بالتطبيق، اذهب إلى **Variables** وأضف:

| المتغير | القيمة | ملاحظة |
|---|---|---|
| `SESSION_SECRET` | نص عشوائي طويل (64+ حرف) | مثال: استخدم [randomkeygen.com](https://randomkeygen.com) |
| `ADMIN_PASSWORD` | كلمة سر قوية | للوصول لـ `/admin` |
| `VITE_CLERK_PUBLISHABLE_KEY` | من [clerk.com](https://clerk.com) | مفتاح Clerk للـ frontend |
| `CLERK_SECRET_KEY` | من [clerk.com](https://clerk.com) | مفتاح Clerk للـ backend |
| `NODE_ENV` | `production` | |
| `PORT` | `8080` | |
| `FRONTEND_DIST` | `/app/public` | مسار الـ frontend المبني |
| `UPLOAD_DIR` | `/app/uploads` | مسار الصور المرفوعة |

**اختياري (للدفع):**
| `STRIPE_SECRET_KEY` | من [stripe.com](https://stripe.com) | |

> ⚠️ **ملاحظة مهمة:** `DATABASE_URL` يتم ربطه تلقائياً من قاعدة بيانات Railway — لا تضيفه يدوياً.

---

### الخطوة 5: تشغيل Migrations قاعدة البيانات

بعد أول نشر ناجح، شغّل migrations:

1. اذهب لـ Service → **"Shell"** (أيقونة الـ terminal في أعلى اليمين)
2. شغّل:
```bash
cd /app && node -e "
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { db } = require('./dist/index.mjs');
" 
```

**أو الطريقة الأسهل:** استخدم Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway run pnpm --filter @workspace/db run push
```

---

### الخطوة 6: الوصول للموقع

بعد نجاح النشر:
- Railway يعطيك رابط تلقائي مثل: `https://storekit-production.up.railway.app`
- يمكنك ربط دومين مخصص من **Settings → Networking → Add Domain**

---

## متابعة النشر اليومي

كل push لـ GitHub يؤدي لـ **نشر تلقائي** على Railway — لا تحتاج لأي إجراء.

---

## لوحة الإدارة (Admin Dashboard)

الرابط: `https://your-domain.up.railway.app/admin`
كلمة السر: ما وضعته في `ADMIN_PASSWORD`

### ما تقدر تعمله من الداشبورد:
- **Products** — إضافة/تعديل/حذف منتجات مع صور
- **Collections** — إدارة المجموعات
- **Orders** — متابعة الطلبات وتغيير الحالة
- **Settings** — تخصيص المتجر (اسم، ألوان، روابط سوشيال)
- **Analytics** — إحصائيات المبيعات والزوار
- **Promo Codes** — أكواد خصم
- **Reviews** — مراجعات العملاء

---

## تسليم المشروع للعميل

### ما يحتاجه العميل:
1. **رابط المتجر** (من Railway)
2. **رابط الداشبورد** (`/admin`)
3. **كلمة سر الداشبورد** — اللي وضعتها في `ADMIN_PASSWORD`
4. هذا الملف كمرجع

### ما تحتاج تفعله أنت (مرة واحدة):
1. نشر المشروع على Railway (الخطوات أعلاه)
2. إعداد Clerk إذا أراد العميل تسجيل دخول للعملاء
3. إعداد Stripe إذا أراد دفع حقيقي

---

## استضافة الصور

الصور المرفوعة من الداشبورد محفوظة في `/app/uploads` داخل الـ container.

> ⚠️ **مهم:** Railway يعيد تشغيل الـ container عند كل نشر — **الصور لن تُحذف** إذا استخدمت **Railway Volumes**.

### ربط Volume للصور (مهم جداً!):

1. داخل الـ Service → **"Volumes"** → **"Add Volume"**
2. Mount Path: `/app/uploads`
3. اضغط **"Create"**

هكذا الصور تبقى محفوظة حتى بعد إعادة النشر ✅

---

## تكلفة Railway التقريبية

| الخطة | السعر | مناسبة لـ |
|---|---|---|
| Hobby | $5/شهر | عميل صغير / متجر ناشئ |
| Pro | $20/شهر | متجر نشط / حركة مرور متوسطة |

قاعدة البيانات PostgreSQL مدمجة في نفس السعر.
