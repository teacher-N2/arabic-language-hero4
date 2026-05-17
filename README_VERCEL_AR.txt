منصة بطلة اللغة العربية — نسخة Vercel + OpenRouter AI

الخطوات:
1. ارفعي هذه الحزمة كاملة إلى GitHub.
2. افتحي Vercel واختاري Add New Project.
3. اربطي مستودع GitHub.
4. من Settings > Environment Variables أضيفي:
   OPENROUTER_API_KEY = مفتاح OpenRouter
5. اختياري:
   OPENROUTER_MODEL = اتركيه فارغًا ليختار موديلًا مجانيًا تلقائيًا.
6. اضغطي Deploy.

مهم:
لا تضعي مفتاح OpenRouter داخل ملفات js.
الملف api/generate.js هو الذي يتصل بالذكاء الاصطناعي من جهة الخادم.