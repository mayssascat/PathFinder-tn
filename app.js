// ============================================================
// PATHFINDER TN — app.js (Production Ready - Public Deploy)
// Features:
//   - User provides their own Groq API key (secure)
//   - Direct API call to Groq (no server needed)
//   - Local scoring fallback if API fails
//   - Fully static — deployable to GitHub Pages / Netlify
// ============================================================

let engineeringFieldsData = {};

// ── API KEY MANAGEMENT ──────────────────────────────────────
function getGroqKey() {
  return localStorage.getItem('groq_api_key') || sessionStorage.getItem('groq_api_key') || '';
}

function clearApiKey() {
  localStorage.removeItem('groq_api_key');
  sessionStorage.removeItem('groq_api_key');
}

// ── 1. LOAD DATA ─────────────────────────────────────────────
async function initApp() {
  try {
    const response = await fetch('data.json');
    engineeringFieldsData = await response.json();
    showPage('home');
  } catch (err) {
    document.getElementById('app').innerHTML = `
      <div style="padding:4rem;text-align:center;color:#e55;font-family:monospace;">
        ⚠ Could not load data.json.<br>
        Make sure you are opening this via Live Server, not by double-clicking the file.
      </div>`;
  }
}

// ── 2. ROUTER ─────────────────────────────────────────────────
function showPage(pageName, subParam = null) {
  const app = document.getElementById('app');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageName === 'home') {
    app.innerHTML = getHomePage();
    const vid = document.querySelector('.video-bg');
    if (vid) { vid.muted = true; vid.play().catch(() => {}); }

  } else if (pageName === 'explore') {
    if (subParam) {
      app.innerHTML = `<div class="page-container">${getFieldDetailPage(subParam)}</div>`;
    } else {
      app.innerHTML = `<div class="page-container">${getExploreFieldsListPage()}</div>`;
    }

  } else if (pageName === 'pathfinder') {
    app.innerHTML = `<div class="page-container">${getPathfinderPage()}</div>`;
    initQuiz();

  } else if (pageName === 'tech') {
    app.innerHTML = `
      <div class="coming-soon">
        <h2>📡 TECH TODAY</h2>
        <p>
          The technology magazine is coming soon.<br>
          Check back for the latest breakthroughs shaping engineering in 2026.
        </p>
      </div>`;
  }
}

// ── 3. HOME PAGE ─────────────────────────────────────────────
function getHomePage() {
  return `
    <section class="hero">
      <div class="video-bg-container">
        <video autoplay loop muted playsinline class="video-bg">
          <source src="background.mp4" type="video/mp4">
        </video>
        <div class="video-overlay"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">Find Your Engineering Path</h1>
        <p class="hero-sub">
          <span class="greet">Aslema. Marhbe. Welcome</span> to Pathfinder —
          your guide in a dive into the Engineering World, Tunisian Edition.
        </p>
      </div>
      <div class="hero-cards">
        <div class="hero-card featured" onclick="showPage('pathfinder')">
          <div class="card-inner">
            <div class="card-front">
              <div class="card-icon">🧭</div>
              <div class="card-title">Start Pathfinder</div>
            </div>
            <div class="card-back">
              <div class="card-desc">
                Answer a few questions. Our AI matches you to the right
                engineering field for your personality and goals.
              </div>
              <div class="card-arrow">→ DISCOVER YOUR PATH</div>
            </div>
          </div>
        </div>
        <div class="hero-card" onclick="showPage('explore')">
          <div class="card-inner">
            <div class="card-front">
              <div class="card-icon">📚</div>
              <div class="card-title">Explore Fields</div>
            </div>
            <div class="card-back">
              <div class="card-desc">
                Deep-dive into every engineering major — curriculum,
                careers, schools in Tunisia, and salaries.
              </div>
              <div class="card-arrow">→ EXPLORE</div>
            </div>
          </div>
        </div>
        <div class="hero-card" onclick="showPage('tech')">
          <div class="card-inner">
            <div class="card-front">
              <div class="card-icon">🚀</div>
              <div class="card-title">Tech Today</div>
            </div>
            <div class="card-back">
              <div class="card-desc">
                The technologies shaping engineering right now — AI,
                energy, robotics, and what is coming next.
              </div>
              <div class="card-arrow">→ OPEN MAGAZINE</div>
            </div>
          </div>
        </div>
        <div class="hero-card" onclick="showPage('pathfinder')">
          <div class="card-inner">
            <div class="card-front">
              <div class="card-icon">🗺️</div>
              <div class="card-title">Roadmaps</div>
            </div>
            <div class="card-back">
              <div class="card-desc">
                Get a personalized step-by-step learning plan built
                around your current level and future goals.
              </div>
              <div class="card-arrow">→ BUILD ROADMAP</div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

// ── 4. EXPLORE FIELDS LIST ────────────────────────────────────
function getExploreFieldsListPage() {
  let cardsHTML = '';
  for (const key in engineeringFieldsData) {
    const f = engineeringFieldsData[key];
    cardsHTML += `
      <div class="field-card" onclick="showPage('explore', '${key}')">
        <div class="field-icon">${f.icon}</div>
        <h3>${f.title}</h3>
        <h4>${f.subtitle}</h4>
        <p>${f.description.substring(0, 110)}…</p>
        <span class="explore-link">Explore Field →</span>
      </div>`;
  }
  return `
    <section>
      <h2 class="section-title">Explore <span class="accent">Engineering Fields</span></h2>
      <p class="section-subtitle">
        Comprehensive guides designed for Tunisian students —
        curriculum, universities, careers, salaries, and the technologies shaping each field.
      </p>
      <div class="fields-grid">${cardsHTML}</div>
    </section>`;
}

// ── 5. FIELD DETAIL PAGE ──────────────────────────────────────
function getFieldDetailPage(fieldKey) {
  const field = engineeringFieldsData[fieldKey];
  if (!field) return `<h2 style="padding:4rem 0;color:#e55;">Field not found: ${fieldKey}</h2>`;

  const studyHTML = field.study.map(s => `
    <div class="timeline-block">
      <h5>${s.year}</h5>
      <p>${s.subjects}</p>
    </div>`).join('');

  const schoolsHTML = field.schools.map(sch => `
    <tr>
      <td><strong>${sch.name}</strong></td>
      <td>${sch.city}</td>
      <td>${sch.program}</td>
    </tr>`).join('');

  const careersHTML = field.careers.map(c => `
    <div class="career-box">
      <h4>💼 ${c.title}</h4>
      <p class="career-desc">${c.desc}</p>
      <div class="day-life">
        <h6>⏳ Day in the Life</h6>
        <p class="schedule">${c.schedule}</p>
      </div>
    </div>`).join('');

  return `
    <div class="detail-container">
      <button class="back-btn" onclick="showPage('explore')">← Back to Fields</button>
      <header class="detail-header">
        <h1>${field.title} <span class="accent">(${field.subtitle})</span></h1>
        <p class="intro-text">${field.description}</p>
      </header>
      <div class="detail-grid">
        <div class="detail-main">
          <section class="template-section">
            <h3>01 / WHAT WILL YOU STUDY?</h3>
            ${studyHTML}
          </section>
          <section class="template-section">
            <h3>02 / WHERE CAN YOU STUDY IN TUNISIA?</h3>
            <table class="schools-table">
              <thead>
                <tr><th>University</th><th>City</th><th>Specialization</th></tr>
              </thead>
              <tbody>${schoolsHTML}</tbody>
            </table>
          </section>
          <section class="template-section">
            <h3>03 / CAREER PATHS & ROLES</h3>
            ${careersHTML}
          </section>
        </div>
        <div class="detail-sidebar">
          <div class="sidebar-card">
            <h3>🧠 Is This Right For Me?</h3>
            <h5>Personal Traits</h5>
            <ul>${field.traits.map(t => `<li>✓ ${t}</li>`).join('')}</ul>
            <h5 style="margin-top:1rem">Technical Interests</h5>
            <ul>${field.interests.map(i => `<li>✦ ${i}</li>`).join('')}</ul>
          </div>
          <div class="sidebar-card economics">
            <h3>📊 Salary Outlook</h3>
            <p><strong>Tunisia:</strong><span>${field.salary.tunisia}</span></p>
            <p><strong>Europe:</strong><span>${field.salary.europe}</span></p>
            <p><strong>North America:</strong><span>${field.salary.na}</span></p>
          </div>
          <div class="sidebar-card">
            <h3>🚀 Shaping Future Technologies</h3>
            <div class="tech-tags">
              ${field.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// ── 6. PATHFINDER QUIZ ────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "When you imagine your future job, which environment excites you most?",
    hint: "Don't think about what you're 'supposed' to pick — think about what actually sounds good to wake up to.",
    choices: [
      "Writing code and building software systems",
      "Designing or building physical things — structures, machines, circuits",
      "Working in a lab, doing research and experiments",
      "Managing projects, optimizing processes, working with teams",
      "Outdoors, on-site, in factories or on construction sites"
    ]
  },
  {
    q: "Which school subject do you enjoy the most?",
    hint: "Pick the one that felt least like work.",
    choices: [
      "Mathematics and problem solving",
      "Physics and how the physical world works",
      "Chemistry and materials",
      "Computer science or programming",
      "Biology or life sciences"
    ]
  },
  {
    q: "If you had a free afternoon to work on something, what would you choose?",
    hint: "Be honest — this reveals a lot about what genuinely drives you.",
    choices: [
      "Building an app or automating something with code",
      "Taking apart a device to understand how it works",
      "Designing something in CAD or sketching blueprints",
      "Reading about new technologies or watching science documentaries",
      "Organizing data, analyzing numbers, finding patterns"
    ]
  },
  {
    q: "Which future technology excites you the most?",
    hint: "The technology you find most exciting usually points toward the field you will thrive in.",
    choices: [
      "Artificial Intelligence and machine learning",
      "Renewable energy and solving climate change",
      "Robotics, automation, and self-driving machines",
      "Cybersecurity and protecting digital infrastructure",
      "Biomedical tech — prosthetics, medical devices, lab-grown organs"
    ]
  },
  {
    q: "How would your friends describe your strongest skill?",
    hint: "Ask yourself: what do people come to you for help with?",
    choices: [
      "Logical — I break complex problems into clear steps",
      "Creative — I come up with ideas others do not think of",
      "Analytical — I love data, numbers, and finding patterns",
      "Practical — I like building, fixing, and making things work",
      "Leader — I organize people and see the big picture"
    ]
  },
  {
    q: "What matters most to you about your future career?",
    hint: "There is no wrong answer. This is about your values.",
    choices: [
      "High salary and international job opportunities",
      "Working on things that help the environment or society",
      "Constant learning — always working with new technologies",
      "Job stability and being respected in Tunisia",
      "Creative freedom — designing or inventing original things"
    ]
  }
];

let quizAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
let quizCurrentStep = 0;

function getPathfinderPage() {
  const storedKey = getGroqKey();

  if (!storedKey) {
    return `
      <div class="quiz-wrapper">
        <div class="quiz-api-setup">
          <h2>🔑 API Key Required</h2>
          <p>Pathfinder uses AI to give personalized recommendations. You\'ll need a free Groq API key.</p>
          <ol style="text-align:left; color:var(--text-muted); font-size:0.9rem; line-height:1.8; margin:1.5rem 0;">
            <li>Go to <a href="https://console.groq.com/keys" target="_blank" style="color:var(--accent-cyan);">console.groq.com/keys</a></li>
            <li>Create a free account (takes 30 seconds)</li>
            <li>Generate an API key</li>
            <li>Paste it below</li>
          </ol>
          <input 
            type="password" 
            id="api-key-input" 
            placeholder="gsk_..." 
            style="width:100%; padding:0.8rem; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-family:var(--font-mono); font-size:0.9rem; margin-bottom:1rem;"
          >
          <label style="display:flex; align-items:center; gap:0.5rem; color:var(--text-muted); font-size:0.8rem; margin-bottom:1rem; cursor:pointer;">
            <input type="checkbox" id="save-key-check" style="accent-color:var(--accent-gold);">
            Remember this key on this device
          </label>
          <button class="quiz-btn" onclick="saveApiKey()">Start Pathfinder →</button>
          <p style="color:var(--text-muted); font-size:0.75rem; margin-top:1rem;">
            🔒 Your key stays in your browser and is never sent to our servers.
          </p>
        </div>
      </div>`;
  }

  return `
    <div class="quiz-wrapper">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <div class="quiz-progress-bar" style="flex:1; margin-bottom:0; margin-right:1rem;">
          <div class="quiz-progress-fill" id="quiz-progress" style="width:0%"></div>
        </div>
        <button onclick="clearApiKey(); showPage('pathfinder');" style="background:none; border:none; color:var(--text-muted); font-size:0.7rem; cursor:pointer; font-family:var(--font-mono); white-space:nowrap;">
          🗑 Clear Key
        </button>
      </div>
      <div id="quiz-body"></div>
    </div>`;
}

function saveApiKey() {
  const input = document.getElementById('api-key-input');
  const saveCheck = document.getElementById('save-key-check');
  const key = input.value.trim();

  if (!key || !key.startsWith('gsk_')) {
    input.style.borderColor = '#e55';
    input.value = '';
    input.placeholder = 'Please enter a valid Groq API key (starts with gsk_)';
    return;
  }

  if (saveCheck.checked) {
    localStorage.setItem('groq_api_key', key);
  } else {
    sessionStorage.setItem('groq_api_key', key);
  }

  showPage('pathfinder');
  initQuiz();
}

function initQuiz() {
  quizAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
  quizCurrentStep = 0;
  renderQuizStep();
}

function renderQuizStep() {
  const body     = document.getElementById('quiz-body');
  const progress = document.getElementById('quiz-progress');
  if (!body) return;

  const total = QUIZ_QUESTIONS.length;
  const pct   = Math.round((quizCurrentStep / total) * 100);
  if (progress) progress.style.width = pct + '%';

  if (quizCurrentStep >= total) {
    body.innerHTML = `
      <div class="quiz-thinking">
        <div class="dot-pulse">
          <span></span><span></span><span></span>
        </div>
        Pathfinder is analyzing your answers…
      </div>`;
    if (progress) progress.style.width = '100%';
    callPathfinderAI();
    return;
  }

  const q              = QUIZ_QUESTIONS[quizCurrentStep];
  const stepNum        = quizCurrentStep + 1;
  const selectedAnswer = quizAnswers[quizCurrentStep];
  const isLast         = quizCurrentStep === total - 1;

  const choicesHTML = q.choices.map((choice, idx) => `
    <button
      class="quiz-choice ${selectedAnswer === idx ? 'selected' : ''}"
      onclick="selectQuizAnswer(${idx})"
    >${choice}</button>`).join('');

  body.innerHTML = `
    <p class="quiz-step-label">Question ${stepNum} of ${total}</p>
    <h2 class="quiz-question">${q.q}</h2>
    <p class="quiz-hint">${q.hint}</p>
    <div class="quiz-choices">${choicesHTML}</div>
    <div class="quiz-nav">
      ${quizCurrentStep > 0
        ? `<button class="quiz-btn-ghost" onclick="quizGoBack()">← Back</button>`
        : `<span></span>`}
      <button
        class="quiz-btn"
        id="quiz-next-btn"
        onclick="quizNext()"
        ${selectedAnswer === null ? 'disabled' : ''}
      >${isLast ? 'See My Results →' : 'Next →'}</button>
    </div>`;
}

function selectQuizAnswer(choiceIdx) {
  quizAnswers[quizCurrentStep] = choiceIdx;
  document.querySelectorAll('.quiz-choice').forEach((btn, i) => {
    btn.classList.toggle('selected', i === choiceIdx);
  });
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) nextBtn.disabled = false;
}

function quizNext() {
  if (quizAnswers[quizCurrentStep] === null) return;
  quizCurrentStep++;
  renderQuizStep();
}

function quizGoBack() {
  if (quizCurrentStep > 0) {
    quizCurrentStep--;
    renderQuizStep();
  }
}

// ═══════════════════════════════════════════════════════════════
// AI CALL — Direct Groq API (No server needed)
// ═══════════════════════════════════════════════════════════════

async function callPathfinderAI() {
  const GROQ_API_KEY = getGroqKey();

  if (!GROQ_API_KEY) {
    const result = runLocalRecommendationEngine();
    displayQuizResult(result);
    return;
  }

  const fieldsList = Object.entries(engineeringFieldsData)
    .map(([key, f]) => `- ${f.title} (key: "${key}"): ${f.description.substring(0, 120)}`)
    .join('\n');

  const answersSummary = QUIZ_QUESTIONS.map((q, i) => {
    const idx = quizAnswers[i];
    return `Q${i + 1}: ${q.q}\nAnswer: ${idx !== null ? q.choices[idx] : 'Not answered'}`;
  }).join('\n\n');

  const prompt = `You are Pathfinder, an intelligent career guidance system for Tunisian engineering students.

A student has completed a 6-question quiz. Based on their answers, recommend the 2-3 best-fit engineering fields from the available list below.

AVAILABLE ENGINEERING FIELDS:
${fieldsList}

STUDENT'S ANSWERS:
${answersSummary}

YOUR TASK:
1. Analyze the student's answers holistically.
2. Recommend exactly 2 or 3 fields from the list above using their exact key names.
3. For each field, write 2-3 sentences explaining specifically WHY it matches this student.
4. End with one short motivating sentence addressed directly to the student.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
RECOMMENDED_FIELDS: field_key1, field_key2, field_key3

RECOMMENDATION:
Your full explanation here.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.choices[0].message.content;

    displayQuizResult(aiText);

  } catch (err) {
    console.warn('AI API failed, using local engine:', err.message);
    const result = runLocalRecommendationEngine();
    displayQuizResult(result);
  }
}

// ── LOCAL FALLBACK ENGINE ────────────────────────────────────
function runLocalRecommendationEngine() {
  const fieldScores = {};

  for (const key in engineeringFieldsData) {
    fieldScores[key] = 0;
  }

  const scoringRules = [
    {
      0: ['software', 'ai_data', 'cybersecurity'],
      1: ['mechanical', 'civil', 'electrical', 'mechatronics'],
      2: ['chemical', 'biomedical', 'physics', 'ai_data'],
      3: ['industrial'],
      4: ['civil', 'petroleum', 'geomatics', 'hydraulic']
    },
    {
      0: ['software', 'ai_data', 'applied_math'],
      1: ['mechanical', 'electrical', 'aeronautical', 'energy'],
      2: ['chemical', 'textile', 'biomedical'],
      3: ['software', 'computer', 'cybersecurity', 'embedded'],
      4: ['biomedical', 'agricultural', 'food']
    },
    {
      0: ['software', 'ai_data', 'cybersecurity'],
      1: ['computer', 'electronics', 'mechatronics'],
      2: ['mechanical', 'civil', 'aeronautical'],
      3: ['ai_data', 'physics', 'energy', 'network'],
      4: ['applied_math', 'industrial', 'ai_data']
    },
    {
      0: ['ai_data', 'software', 'computer'],
      1: ['energy', 'chemical', 'hydraulic'],
      2: ['mechatronics', 'electrical', 'automotive'],
      3: ['cybersecurity', 'network', 'computer'],
      4: ['biomedical', 'agricultural', 'chemical']
    },
    {
      0: ['software', 'computer', 'applied_math'],
      1: ['mechatronics', 'aeronautical', 'automotive'],
      2: ['ai_data', 'applied_math', 'industrial'],
      3: ['electrical', 'electronics', 'mechanical', 'embedded'],
      4: ['industrial', 'civil', 'petroleum']
    },
    {
      0: ['software', 'ai_data', 'cybersecurity', 'petroleum', 'applied_math'],
      1: ['energy', 'hydraulic', 'agricultural', 'chemical'],
      2: ['ai_data', 'software', 'cybersecurity', 'computer'],
      3: ['civil', 'electrical', 'mechanical', 'industrial'],
      4: ['mechatronics', 'aeronautical', 'automotive', 'biomedical']
    }
  ];

  quizAnswers.forEach((answerIdx, qIdx) => {
    if (answerIdx === null) return;
    const fieldsToBoost = scoringRules[qIdx][answerIdx];
    if (fieldsToBoost) {
      fieldsToBoost.forEach(fieldKey => {
        if (fieldScores[fieldKey] !== undefined) {
          fieldScores[fieldKey] += 1;
        }
      });
    }
  });

  const sorted = Object.entries(fieldScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key);

  const recText = sorted.map(key => {
    const f = engineeringFieldsData[key];
    return `${f.title} — Based on your answers, this field aligns well with your interests and strengths. ${f.description.substring(0, 100)}...`;
  }).join('\n\n');

  return `RECOMMENDED_FIELDS: ${sorted.join(', ')}

RECOMMENDATION:
${recText}

You've got a bright future ahead! Explore these fields to find the perfect match for your engineering journey.`;
}

// ── DISPLAY RESULTS ───────────────────────────────────────────
function displayQuizResult(aiText) {
  const body = document.getElementById('quiz-body');

  const keysMatch = aiText.match(/RECOMMENDED_FIELDS:\s*([^\n]+)/i);
  const recommendedKeys = keysMatch
    ? keysMatch[1].split(',').map(k => k.trim()).filter(k => engineeringFieldsData[k])
    : [];

  const recMatch = aiText.match(/RECOMMENDATION:\s*([\s\S]+)/i);
  let recText = recMatch ? recMatch[1].trim() : aiText;
  recText = recText.replace(/\*\*/g, '');

  const tagsHTML = recommendedKeys.map(key => {
    const f = engineeringFieldsData[key];
    return `<span class="result-field-tag" onclick="showPage('explore', '${key}')">${f.icon} ${f.title}</span>`;
  }).join('');

  const paragraphs = recText
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.trim()}</p>`)
    .join('');

  body.innerHTML = `
    <div class="quiz-result">
      <h2>🧭 YOUR PATHFINDER RESULT</h2>
      ${paragraphs}
      ${tagsHTML ? `
        <p style="color:var(--text-muted);font-size:0.78rem;margin-top:1.5rem;font-family:var(--font-mono);letter-spacing:1px;">
          CLICK A FIELD TO EXPLORE IT IN DEPTH →
        </p>
        <div class="result-fields">${tagsHTML}</div>
      ` : ''}
      <button class="quiz-btn" style="margin-top:1.5rem" onclick="initQuiz()">
        Retake Quiz
      </button>
    </div>`;
}

// ── 7. BOOT ───────────────────────────────────────────────────
initApp();
