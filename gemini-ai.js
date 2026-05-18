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
- 2 قواعد
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
