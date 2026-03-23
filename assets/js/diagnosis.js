document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('diagnosis-form');
  const cta = document.getElementById('start-diagnosis');
  const resultTeaser = document.getElementById('diagnosis-teaser');
  if (!form) return;

  const data = await fetch('./data/diagnosis.json').then(r => r.json());

  form.innerHTML = data.questions.map((q, index) => `
    <section class="panel">
      <div class="eyebrow">Question ${index + 1}</div>
      <h2>${q.question}</h2>
      <div class="diagnosis-choices">
        ${q.options.map(opt => `
          <label class="card-body" style="display:flex;gap:12px;align-items:flex-start;border:1px solid var(--line);border-radius:18px;background:#fff;">
            <input type="radio" name="${q.id}" value="${opt.value}" style="margin-top:5px;">
            <span>${opt.label}</span>
          </label>
        `).join('')}
      </div>
    </section>
  `).join('');

  cta?.addEventListener('click', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const answered = data.questions.every(q => formData.get(q.id));
    if (!answered) {
      alert('すべての質問を選択してください。');
      return;
    }
    resultTeaser.classList.remove('hidden');
    await flashTransition(220);
    const params = new URLSearchParams();
    params.set('stay', data.fixedResult);
    params.set('from', 'diagnosis');
    location.href = `./result.html?${params.toString()}`;
  });
});
