export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const text = String((req.body || {}).text || "").trim();
    if (!text) return res.status(400).json({ error: "النص فارغ." });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "لم يتم ضبط OPENROUTER_API_KEY داخل Vercel." });
    }

    const model = process.env.OPENROUTER_MODEL || await chooseFreeModel(apiKey);
    const prompt = buildPrompt(text);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "https://batlat-arabic.vercel.app",
        "X-OpenRouter-Title": "Batlat Al-Lugha Al-Arabia"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "أنت محرّك أسئلة تعليمية عربي دقيق. أخرج JSON فقط دون Markdown." },
          { role: "user", content: prompt }
        ],
        temperature: 0.65,
        max_tokens: 3500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: (data && data.error && (data.error.message || data.error)) || "OpenRouter error",
        raw: data
      });
    }

    const aiText = data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "";

    if (!aiText) return res.status(500).json({ error: "لم يرجع الذكاء الاصطناعي نتيجة واضحة." });

    return res.status(200).json({ ok: true, model, text: cleanJson(aiText) });

  } catch (error) {
    return res.status(500).json({ error: (error && error.message) || "حدث خطأ غير متوقع." });
  }
}

async function chooseFreeModel(apiKey) {
  const response = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { "Authorization": `Bearer ${apiKey}` }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data && data.error && data.error.message) || "تعذر جلب قائمة موديلات OpenRouter.");
  }

  const models = data.data || [];

  const freeModels = models.filter((m) => {
    const id = String(m.id || "");
    const promptPrice = Number((m.pricing && m.pricing.prompt) || 1);
    const completionPrice = Number((m.pricing && m.pricing.completion) || 1);
    const output = m.architecture && m.architecture.output_modalities ? m.architecture.output_modalities : ["text"];
    const isText = output.includes("text");
    return isText && (id.endsWith(":free") || (promptPrice === 0 && completionPrice === 0));
  });

  const preferred =
    freeModels.find((m) => /qwen|deepseek|llama|mistral|google/i.test(m.id)) ||
    freeModels[0];

  if (!preferred) {
    throw new Error("لا يوجد موديل مجاني متاح حاليًا. ضعي OPENROUTER_MODEL يدويًا من OpenRouter.");
  }

  return preferred.id;
}

function buildPrompt(text) {
  return `
أنت الآن محرّك ذكاء اصطناعي متخصص في تحليل النصوص العربية وتوليد أسئلة تعليمية تفاعلية لمنصة "بطلة اللغة العربية".

حلّل النص التالي لطالبات الصف الخامس الابتدائي، ثم أخرج JSON فقط دون أي شرح خارج JSON.

يجب أن يكون الإخراج بهذا الشكل:
{
  "title": "",
  "text_type": "",
  "grade_level": "الصف الخامس الابتدائي",
  "difficulty": "",
  "skills_detected": [],
  "main_idea": "",
  "key_values": [],
  "questions": [
    {
      "id": "",
      "type": "",
      "question": "",
      "options": [],
      "answer": "",
      "explanation": "",
      "skill": "",
      "difficulty": "",
      "category": "",
      "points": 10
    }
  ],
  "games": [],
  "quick_challenges": [],
  "hots_question": {},
  "achievement_badge": ""
}

المطلوب:
- أسئلة فهم واستيعاب.
- مفردات: مرادف، مضاد، معنى من السياق.
- قواعد نحوية إن وُجدت في النص.
- إملاء وخط إن أمكن.
- بلاغة وتعبير إن أمكن.
- سؤال HOTS عالي التفكير.
- تحديات سريعة.
- ألعاب تعليمية مقترحة.

قواعد صارمة:
- لا تكرر الأسئلة.
- اجعل الخيارات أربعة عند أسئلة الاختيار من متعدد.
- استخدم لغة عربية سليمة 100%.
- اجعل الأسئلة مناسبة لطالبات المرحلة الابتدائية.
- اجعل الأسئلة متدرجة من السهل إلى الأصعب.

النص:
${text}
`;
}

function cleanJson(text) {
  return String(text)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}