async function generateAIQuestions() {
  const text = (document.getElementById("aiText")?.value || "").trim();
  const output = document.getElementById("aiOutput");

  if (!text) {
    output.innerHTML = '<div class="aiError">اكتبي نصًا أولًا حتى تولّد سلامة أسئلة ذكية 🌷</div>';
    return;
  }

  output.innerHTML = '<div class="loadingAI">🤖 سلامة تحلّل النص عبر الذكاء الاصطناعي...</div>';

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!response.ok) {
      output.innerHTML = `
        <div class="aiError">
          تعذر تشغيل الذكاء الاصطناعي.<br>
          <strong>السبب:</strong> ${escapeHTML(data.error || "خطأ غير معروف")}
        </div>
      `;
      return;
    }

    renderAIResult(data.text, data.model);

    if (typeof addAch === "function") addAch("مستكشفة الذكاء الاصطناعي");
    if (typeof play === "function") play("sparkleSound");

  } catch (error) {
    output.innerHTML = `
      <div class="aiError">
        حدث خطأ أثناء الاتصال بخادم الذكاء الاصطناعي.
      </div>
    `;
  }
}

function renderAIResult(text, modelName) {
  const output = document.getElementById("aiOutput");
  let data = null;

  try {
    data = JSON.parse(text);
  } catch {
    output.innerHTML = `
      <div class="aiResult">
        <h2>✨ نتيجة الذكاء الاصطناعي</h2>
        <p><strong>الموديل:</strong> ${escapeHTML(modelName || "")}</p>
        <pre>${escapeHTML(text)}</pre>
      </div>
    `;
    return;
  }

  const questions = Array.isArray(data.questions) ? data.questions : [];

  output.innerHTML = `
    <div class="aiResult">
      <h2>✨ ${escapeHTML(data.title || "أسئلة ذكية")}</h2>
      <p><strong>الموديل:</strong> ${escapeHTML(modelName || "")}</p>
      <p><strong>نوع النص:</strong> ${escapeHTML(data.text_type || "")}</p>
      <p><strong>الصعوبة:</strong> ${escapeHTML(data.difficulty || "")}</p>
      <p><strong>الفكرة العامة:</strong> ${escapeHTML(data.main_idea || "")}</p>

      <h3>🎯 المهارات</h3>
      <div class="badgeWrap">
        ${(data.skills_detected || []).map(x => `<span class="badge">${escapeHTML(String(x))}</span>`).join("")}
      </div>

      <h3>🧠 الأسئلة الذكية</h3>
      <div class="generatedQuestions">
        ${questions.map((q, i) => renderAIQuestion(q, i)).join("")}
      </div>

      <h3>🎮 الألعاب والتحديات</h3>
      <pre>${escapeHTML(JSON.stringify({
        games: data.games || [],
        quick_challenges: data.quick_challenges || [],
        hots_question: data.hots_question || {},
        achievement_badge: data.achievement_badge || ""
      }, null, 2))}</pre>
    </div>
  `;
}

function renderAIQuestion(q, i) {
  const options = Array.isArray(q.options) ? q.options : [];
  return `
    <div class="aiQuestionCard">
      <div class="aiQuestionHeader">
        <span>سؤال ${i + 1}</span>
        <span>${escapeHTML(q.category || q.skill || "لغة عربية")}</span>
        <span>${escapeHTML(q.difficulty || "متوسط")}</span>
      </div>
      <div class="aiQuestionText">${escapeHTML(q.question || "")}</div>
      ${options.length ? `<ol>${options.map(o => `<li>${escapeHTML(String(o))}</li>`).join("")}</ol>` : ""}
      <div class="aiAnswer"><strong>الإجابة:</strong> ${escapeHTML(q.answer || "")}</div>
      <div class="aiExplain"><strong>التفسير:</strong> ${escapeHTML(q.explanation || "")}</div>
    </div>
  `;
}

function escapeHTML(v) {
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}