function generateAIQuestions() {

  const text = document.getElementById("aiText").value.trim();

  if (!text) {
    alert("اكتبي نصًا أولًا 🌷");
    return;
  }

  const prompt = `
أنت معلم لغة عربية خبير للمرحلة الابتدائية.

أنشئ:
- 3 أسئلة فهم واستيعاب
- 2 مفردات
- 2 سؤال قواعد مرتبطان مباشرة بالنص.
- يجب أن تكون الإجابة مستخرجة من النص نفسه.
- يُمنع إنشاء أسئلة قواعد عامة خارج النص.
- ركّز على مهارات الصف الخامس الابتدائي في اللغة العربية.
- عند إنشاء أسئلة القواعد، استخرج كلمات أو تراكيب حقيقية من النص.
- سؤال تفكير ناقد
- سؤال إملاء

حول النص التالي:

${text}
`;

  const url =
    "https://chat.openai.com/?prompt=" +
    encodeURIComponent(prompt);

  window.open(url, "_blank");
}
