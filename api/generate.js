function generateAIQuestions() {

  const text = document.getElementById("aiText").value.trim();

  if (!text) {
    alert("اكتبي نصًا أولًا 🌷");
    return;
  }

  const prompt = `
أنت معلم لغة عربية خبير.
أنشئ أسئلة متنوعة للصف الخامس حول النص التالي:
- فهم واستيعاب
- مفردات
- قواعد
- إملاء
- تفكير ناقد

النص:
${text}
`;

  const url =
    "https://chat.openai.com/?prompt=" +
    encodeURIComponent(prompt);

  window.open(url, "_blank");
}
