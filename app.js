// ============================================================
// PATHFINDER TN — app.js (v2.0 with Tech Today Magazine)
// Features:
//   - AI-powered career quiz (Groq API)
//   - 28 engineering field guides
//   - Tech Today magazine with articles
//   - Article editor for user submissions
//   - Medium/Substack-style reading experience
// ============================================================

let engineeringFieldsData = {};
let articlesData = [];
let userArticles = [];

// ── API KEY MANAGEMENT ──────────────────────────────────────
function getGroqKey() {
  return localStorage.getItem('groq_api_key') || sessionStorage.getItem('groq_api_key') || '';
}

function clearApiKey() {
  localStorage.removeItem('groq_api_key');
  sessionStorage.removeItem('groq_api_key');
}

// ── USER ARTICLES (LocalStorage) ────────────────────────────
function loadUserArticles() {
  try {
    const stored = localStorage.getItem('pathfinder_user_articles');
    if (stored) {
      userArticles = JSON.parse(stored);
    }
  } catch (e) {
    userArticles = [];
  }
}

function saveUserArticles() {
  localStorage.setItem('pathfinder_user_articles', JSON.stringify(userArticles));
}

function addUserArticle(article) {
  article.id = 'user_' + Date.now();
  article.date = new Date().toISOString().split('T')[0];
  article.readTime = Math.ceil(article.content.split(' ').length / 200) + ' min read';
  article.author = article.author || 'Anonymous';
  article.isUserArticle = true;
  userArticles.unshift(article);
  saveUserArticles();
  return article.id;
}

function updateUserArticle(id, updates) {
  const idx = userArticles.findIndex(a => a.id === id);
  if (idx !== -1) {
    userArticles[idx] = { ...userArticles[idx], ...updates };
    saveUserArticles();
    return true;
  }
  return false;
}

function deleteUserArticle(id) {
  userArticles = userArticles.filter(a => a.id !== id);
  saveUserArticles();
}

function getAllArticles() {
  return [...articlesData, ...userArticles];
}

function getArticleById(id) {
  return getAllArticles().find(a => a.id === id);
}

// ── 1. LOAD DATA ─────────────────────────────────────────────
async function initApp() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    // Extract articles and fields
    articlesData = data.articles || [];
    delete data.articles;
    engineeringFieldsData = data;

    // Load user articles from localStorage
    loadUserArticles();

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
    if (subParam) {
      if (subParam === 'editor') {
        app.innerHTML = `<div class="page-container">${getArticleEditorPage()}</div>`;
        initArticleEditor();
      } else if (subParam.startsWith('edit_')) {
        const articleId = subParam.replace('edit_', '');
        app.innerHTML = `<div class="page-container">${getArticleEditorPage(articleId)}</div>`;
        initArticleEditor(articleId);
      } else {
        app.innerHTML = `<div class="page-container">${getArticleReaderPage(subParam)}</div>`;
      }
    } else {
      app.innerHTML = `<div class="page-container">${getTechTodayPage()}</div>`;
    }
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
                The latest in AI, energy, robotics, and more. Read curated
                articles or write your own.
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

// ═══════════════════════════════════════════════════════════════
// TECH TODAY MAGAZINE
// ═══════════════════════════════════════════════════════════════

function getTechTodayPage() {
  const allArticles = getAllArticles();
  const featured = allArticles.find(a => a.featured) || allArticles[0];
  const others = allArticles.filter(a => a.id !== featured.id);

  // Featured article hero
  const featuredHTML = featured ? `
    <div class="article-hero" onclick="showPage('tech', '${featured.id}')">
      <div class="article-hero-image" style="background-image: url('${featured.image}')">
        <div class="article-hero-overlay"></div>
      </div>
      <div class="article-hero-content">
        <span class="article-category">${featured.category}</span>
        <h2 class="article-hero-title">${featured.title}</h2>
        <p class="article-hero-subtitle">${featured.subtitle}</p>
        <div class="article-meta">
          <span>${featured.author}</span>
          <span>•</span>
          <span>${featured.date}</span>
          <span>•</span>
          <span>${featured.readTime}</span>
          ${featured.isUserArticle ? '<span class="user-badge">✎ User Article</span>' : ''}
        </div>
      </div>
    </div>
  ` : '';

  // Article grid
  const articlesHTML = others.map(article => `
    <div class="article-card ${article.isUserArticle ? 'user-article-card' : ''}" onclick="showPage('tech', '${article.id}')">
      <div class="article-card-image" style="background-image: url('${article.image}')">
        ${article.isUserArticle ? '<span class="user-article-badge">✎</span>' : ''}
      </div>
      <div class="article-card-content">
        <span class="article-category-tag">${article.category}</span>
        <h3 class="article-card-title">${article.title}</h3>
        <p class="article-card-excerpt">${article.subtitle}</p>
        <div class="article-card-meta">
          <span>${article.author}</span>
          <span>•</span>
          <span>${article.readTime}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Category filter tags
  const categories = [...new Set(allArticles.map(a => a.category))];
  const categoryTags = categories.map(cat => 
    `<button class="category-tag" onclick="filterArticles('${cat}')">${cat}</button>`
  ).join('');

  return `
    <section class="tech-today-section">
      <header class="tech-today-header">
        <h1 class="section-title">📡 <span class="accent">Tech Today</span></h1>
        <p class="section-subtitle">
          The latest breakthroughs in engineering and technology — curated for Tunisian students.
          Read, learn, and share your own insights.
        </p>
      </header>

      <div class="tech-today-actions">
        <button class="write-article-btn" onclick="showPage('tech', 'editor')">
          <span>✎</span> Write an Article
        </button>
      </div>

      <div class="category-filter">
        <button class="category-tag active" onclick="filterArticles('all')">All</button>
        ${categoryTags}
      </div>

      ${featuredHTML}

      <div class="articles-grid" id="articles-grid">
        ${articlesHTML}
      </div>

      ${userArticles.length > 0 ? `
        <div class="user-articles-section">
          <h3 class="user-articles-heading">Your Articles</h3>
          <p class="user-articles-hint">Click any article to edit or delete it</p>
          <div class="user-articles-list">
            ${userArticles.map(a => `
              <div class="user-article-item">
                <span onclick="showPage('tech', '${a.id}')">${a.title}</span>
                <div class="user-article-actions">
                  <button onclick="event.stopPropagation(); showPage('tech', 'edit_${a.id}')">Edit</button>
                  <button onclick="event.stopPropagation(); deleteUserArticle('${a.id}'); showPage('tech');">Delete</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>`;
}

function filterArticles(category) {
  const allArticles = getAllArticles();
  const filtered = category === 'all' ? allArticles : allArticles.filter(a => a.category === category);

  // Update active button
  document.querySelectorAll('.category-tag').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (category === 'all' ? 'All' : category));
  });

  const grid = document.getElementById('articles-grid');
  if (!grid) return;

  grid.innerHTML = filtered.filter(a => !a.featured).map(article => `
    <div class="article-card ${article.isUserArticle ? 'user-article-card' : ''}" onclick="showPage('tech', '${article.id}')">
      <div class="article-card-image" style="background-image: url('${article.image}')">
        ${article.isUserArticle ? '<span class="user-article-badge">✎</span>' : ''}
      </div>
      <div class="article-card-content">
        <span class="article-category-tag">${article.category}</span>
        <h3 class="article-card-title">${article.title}</h3>
        <p class="article-card-excerpt">${article.subtitle}</p>
        <div class="article-card-meta">
          <span>${article.author}</span>
          <span>•</span>
          <span>${article.readTime}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ── ARTICLE READER PAGE ─────────────────────────────────────
function getArticleReaderPage(articleId) {
  const article = getArticleById(articleId);
  if (!article) return `<h2 style="padding:4rem 0;color:#e55;">Article not found</h2>`;

  const contentHTML = article.content.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p class="article-paragraph">${block.text}</p>`;
      case 'heading':
        return `<h2 class="article-heading">${block.text}</h2>`;
      case 'quote':
        return `
          <blockquote class="article-quote">
            <p>"${block.text}"</p>
            <cite>— ${block.author}</cite>
          </blockquote>`;
      case 'list':
        return `<ul class="article-list">${block.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
      default:
        return '';
    }
  }).join('');

  const tagsHTML = article.tags ? article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('') : '';

  return `
    <article class="article-reader">
      <button class="back-btn" onclick="showPage('tech')">← Back to Tech Today</button>

      <header class="article-reader-header">
        <div class="article-reader-image" style="background-image: url('${article.image}')">
          <div class="article-reader-overlay"></div>
        </div>
        <div class="article-reader-header-content">
          <span class="article-category">${article.category}</span>
          <h1 class="article-reader-title">${article.title}</h1>
          <p class="article-reader-subtitle">${article.subtitle}</p>
          <div class="article-reader-meta">
            <div class="author-info">
              <div class="author-avatar">${article.author.charAt(0).toUpperCase()}</div>
              <div class="author-details">
                <span class="author-name">${article.author}</span>
                <span class="author-date">${article.date} • ${article.readTime}</span>
              </div>
            </div>
            ${article.isUserArticle ? '<span class="user-article-label">✎ User Article</span>' : ''}
          </div>
        </div>
      </header>

      <div class="article-reader-body">
        ${contentHTML}
      </div>

      <div class="article-reader-footer">
        <div class="article-tags">
          ${tagsHTML}
        </div>
        <div class="article-actions">
          <button class="article-action-btn" onclick="shareArticle('${article.id}')">
            <span>🔗</span> Share
          </button>
          ${article.isUserArticle ? `
            <button class="article-action-btn" onclick="showPage('tech', 'edit_${article.id}')">
              <span>✎</span> Edit
            </button>
          ` : ''}
        </div>
      </div>

      <div class="article-related">
        <h3>More from Tech Today</h3>
        <div class="related-articles">
          ${getAllArticles().filter(a => a.id !== article.id).slice(0, 3).map(a => `
            <div class="related-article-card" onclick="showPage('tech', '${a.id}')">
              <div class="related-article-image" style="background-image: url('${a.image}')"></div>
              <span class="related-article-category">${a.category}</span>
              <h4>${a.title}</h4>
            </div>
          `).join('')}
        </div>
      </div>
    </article>`;
}

function shareArticle(articleId) {
  const article = getArticleById(articleId);
  if (!article) return;

  const url = window.location.origin + window.location.pathname + '#tech-' + articleId;

  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.subtitle,
      url: url
    });
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert('Article link copied to clipboard!');
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// ARTICLE EDITOR — Write & Edit Articles (Medium/Substack style)
// ═══════════════════════════════════════════════════════════════

let editorBlocks = [];
let editingArticleId = null;

function getArticleEditorPage(articleId = null) {
  editingArticleId = articleId;
  let article = null;

  if (articleId) {
    article = getArticleById(articleId);
    if (!article) return `<h2 style="padding:4rem 0;color:#e55;">Article not found</h2>`;
    if (!article.isUserArticle) return `<h2 style="padding:4rem 0;color:#e55;">Can only edit your own articles</h2>`;
  }

  const title = article ? article.title : '';
  const subtitle = article ? article.subtitle : '';
  const author = article ? article.author : '';
  const category = article ? article.category : 'Technology';
  const image = article ? article.image : '';

  // Initialize editor blocks
  if (article) {
    editorBlocks = JSON.parse(JSON.stringify(article.content));
  } else {
    editorBlocks = [{ type: 'paragraph', text: '' }];
  }

  return `
    <div class="article-editor">
      <header class="editor-header">
        <button class="back-btn" onclick="showPage('tech')">← Cancel</button>
        <div class="editor-actions">
          <button class="editor-btn-ghost" onclick="previewArticle()">👁 Preview</button>
          <button class="editor-btn" onclick="publishArticle()">${articleId ? '💾 Update' : '🚀 Publish'}</button>
        </div>
      </header>

      <div class="editor-main">
        <div class="editor-metadata">
          <input 
            type="text" 
            id="editor-title" 
            class="editor-title-input" 
            placeholder="Article Title"
            value="${title.replace(/"/g, '&quot;')}"
          >
          <input 
            type="text" 
            id="editor-subtitle" 
            class="editor-subtitle-input" 
            placeholder="Subtitle — a one-line summary of your article"
            value="${subtitle.replace(/"/g, '&quot;')}"
          >
          <div class="editor-meta-row">
            <input 
              type="text" 
              id="editor-author" 
              class="editor-author-input" 
              placeholder="Your Name"
              value="${author.replace(/"/g, '&quot;')}"
            >
            <select id="editor-category" class="editor-category-select">
              <option value="Technology" ${category === 'Technology' ? 'selected' : ''}>Technology</option>
              <option value="Artificial Intelligence" ${category === 'Artificial Intelligence' ? 'selected' : ''}>Artificial Intelligence</option>
              <option value="Energy" ${category === 'Energy' ? 'selected' : ''}>Energy</option>
              <option value="Automotive" ${category === 'Automotive' ? 'selected' : ''}>Automotive</option>
              <option value="Quantum Tech" ${category === 'Quantum Tech' ? 'selected' : ''}>Quantum Tech</option>
              <option value="Robotics" ${category === 'Robotics' ? 'selected' : ''}>Robotics</option>
              <option value="Biotech" ${category === 'Biotech' ? 'selected' : ''}>Biotech</option>
              <option value="Space" ${category === 'Space' ? 'selected' : ''}>Space</option>
              <option value="Other" ${category === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="editor-image-row">
            <input 
              type="text" 
              id="editor-image" 
              class="editor-image-input" 
              placeholder="Cover image URL (Unsplash, etc.) — leave empty for random tech image"
              value="${image.replace(/"/g, '&quot;')}"
            >
            <button class="editor-btn-ghost" onclick="randomUnsplashImage()">🎲 Random Image</button>
          </div>
        </div>

        <div class="editor-toolbar">
          <button onclick="addBlock('paragraph')" title="Paragraph">¶</button>
          <button onclick="addBlock('heading')" title="Heading">H</button>
          <button onclick="addBlock('quote')" title="Quote">❝</button>
          <button onclick="addBlock('list')" title="List">☰</button>
          <button onclick="addBlock('image')" title="Image">🖼</button>
        </div>

        <div class="editor-blocks" id="editor-blocks">
          ${renderEditorBlocks()}
        </div>

        <button class="editor-add-block" onclick="addBlock('paragraph')">
          + Add paragraph
        </button>
      </div>
    </div>

    <div id="editor-preview-modal" class="editor-preview-modal" style="display:none;">
      <div class="editor-preview-content">
        <button class="editor-preview-close" onclick="closePreview()">✕</button>
        <div id="editor-preview-body"></div>
      </div>
    </div>`;
}

function initArticleEditor(articleId = null) {
  // Blocks are already initialized in getArticleEditorPage
  // This function is called after DOM is ready
  renderEditorBlocks();
}

function renderEditorBlocks() {
  return editorBlocks.map((block, idx) => {
    switch (block.type) {
      case 'paragraph':
        return `
          <div class="editor-block" data-index="${idx}">
            <div class="editor-block-handle">¶</div>
            <textarea 
              class="editor-textarea" 
              placeholder="Write your paragraph here..."
              oninput="updateBlock(${idx}, this.value)"
            >${block.text}</textarea>
            <button class="editor-block-delete" onclick="deleteBlock(${idx})">🗑</button>
          </div>`;
      case 'heading':
        return `
          <div class="editor-block" data-index="${idx}">
            <div class="editor-block-handle">H</div>
            <input 
              type="text" 
              class="editor-heading-input" 
              placeholder="Section Heading"
              value="${block.text.replace(/"/g, '&quot;')}"
              oninput="updateBlock(${idx}, this.value)"
            >
            <button class="editor-block-delete" onclick="deleteBlock(${idx})">🗑</button>
          </div>`;
      case 'quote':
        return `
          <div class="editor-block" data-index="${idx}">
            <div class="editor-block-handle">❝</div>
            <div class="editor-quote-inputs">
              <textarea 
                class="editor-textarea editor-quote-text" 
                placeholder="Quote text..."
                oninput="updateQuoteBlock(${idx}, 'text', this.value)"
              >${block.text}</textarea>
              <input 
                type="text" 
                class="editor-quote-author" 
                placeholder="Quote author"
                value="${(block.author || '').replace(/"/g, '&quot;')}"
                oninput="updateQuoteBlock(${idx}, 'author', this.value)"
              >
            </div>
            <button class="editor-block-delete" onclick="deleteBlock(${idx})">🗑</button>
          </div>`;
      case 'list':
        return `
          <div class="editor-block" data-index="${idx}">
            <div class="editor-block-handle">☰</div>
            <div class="editor-list-items">
              ${(block.items || []).map((item, itemIdx) => `
                <div class="editor-list-item">
                  <span class="editor-list-bullet">•</span>
                  <input 
                    type="text" 
                    value="${item.replace(/"/g, '&quot;')}" 
                    oninput="updateListItem(${idx}, ${itemIdx}, this.value)"
                  >
                  <button onclick="removeListItem(${idx}, ${itemIdx})">✕</button>
                </div>
              `).join('')}
              <button class="editor-add-list-item" onclick="addListItem(${idx})">+ Add item</button>
            </div>
            <button class="editor-block-delete" onclick="deleteBlock(${idx})">🗑</button>
          </div>`;
      case 'image':
        return `
          <div class="editor-block" data-index="${idx}">
            <div class="editor-block-handle">🖼</div>
            <div class="editor-image-inputs">
              <input 
                type="text" 
                class="editor-image-url" 
                placeholder="Image URL (Unsplash, etc.)"
                value="${(block.url || '').replace(/"/g, '&quot;')}"
                oninput="updateImageBlock(${idx}, this.value)"
              >
              <input 
                type="text" 
                class="editor-image-caption" 
                placeholder="Image caption (optional)"
                value="${(block.caption || '').replace(/"/g, '&quot;')}"
                oninput="updateImageCaption(${idx}, this.value)"
              >
            </div>
            <button class="editor-block-delete" onclick="deleteBlock(${idx})">🗑</button>
          </div>`;
      default:
        return '';
    }
  }).join('');
}

function addBlock(type) {
  const newBlock = { type };
  if (type === 'paragraph') newBlock.text = '';
  if (type === 'heading') newBlock.text = '';
  if (type === 'quote') { newBlock.text = ''; newBlock.author = ''; }
  if (type === 'list') newBlock.items = [''];
  if (type === 'image') { newBlock.url = ''; newBlock.caption = ''; }

  editorBlocks.push(newBlock);
  refreshEditorBlocks();
}

function deleteBlock(index) {
  editorBlocks.splice(index, 1);
  refreshEditorBlocks();
}

function updateBlock(index, value) {
  editorBlocks[index].text = value;
}

function updateQuoteBlock(index, field, value) {
  editorBlocks[index][field] = value;
}

function updateListItem(blockIdx, itemIdx, value) {
  editorBlocks[blockIdx].items[itemIdx] = value;
}

function addListItem(blockIdx) {
  editorBlocks[blockIdx].items.push('');
  refreshEditorBlocks();
}

function removeListItem(blockIdx, itemIdx) {
  editorBlocks[blockIdx].items.splice(itemIdx, 1);
  if (editorBlocks[blockIdx].items.length === 0) {
    deleteBlock(blockIdx);
  } else {
    refreshEditorBlocks();
  }
}

function updateImageBlock(index, value) {
  editorBlocks[index].url = value;
}

function updateImageCaption(index, value) {
  editorBlocks[index].caption = value;
}

function refreshEditorBlocks() {
  const container = document.getElementById('editor-blocks');
  if (container) {
    container.innerHTML = renderEditorBlocks();
  }
}

function randomUnsplashImage() {
  const techImages = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop'
  ];
  const random = techImages[Math.floor(Math.random() * techImages.length)];
  const input = document.getElementById('editor-image');
  if (input) input.value = random;
}

function previewArticle() {
  const title = document.getElementById('editor-title').value;
  const subtitle = document.getElementById('editor-subtitle').value;
  const author = document.getElementById('editor-author').value;
  const category = document.getElementById('editor-category').value;
  const image = document.getElementById('editor-image').value || randomUnsplashImage();

  const previewArticle = {
    title, subtitle, author, category, image,
    content: editorBlocks,
    date: new Date().toISOString().split('T')[0],
    readTime: Math.ceil(editorBlocks.reduce((acc, b) => acc + (b.text || '').split(' ').length, 0) / 200) + ' min read'
  };

  const modal = document.getElementById('editor-preview-modal');
  const body = document.getElementById('editor-preview-body');

  body.innerHTML = getArticleReaderPage('preview');
  // Replace the content with preview
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = body.innerHTML;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  const modal = document.getElementById('editor-preview-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function publishArticle() {
  const title = document.getElementById('editor-title').value.trim();
  const subtitle = document.getElementById('editor-subtitle').value.trim();
  const author = document.getElementById('editor-author').value.trim();
  const category = document.getElementById('editor-category').value;
  const image = document.getElementById('editor-image').value.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop';

  if (!title) { alert('Please enter a title'); return; }
  if (!subtitle) { alert('Please enter a subtitle'); return; }
  if (!author) { alert('Please enter your name'); return; }
  if (editorBlocks.length === 0 || editorBlocks.every(b => !b.text && !b.items)) {
    alert('Please write some content'); return;
  }

  // Clean up empty blocks
  const cleanBlocks = editorBlocks.filter(b => {
    if (b.type === 'list') return b.items && b.items.some(i => i.trim());
    return b.text && b.text.trim();
  });

  const article = {
    title, subtitle, author, category, image,
    content: cleanBlocks,
    tags: [category]
  };

  if (editingArticleId) {
    updateUserArticle(editingArticleId, article);
    alert('Article updated successfully!');
  } else {
    const newId = addUserArticle(article);
    alert('Article published successfully!');
  }

  showPage('tech');
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
          <p>Pathfinder uses AI to give personalized recommendations. You'll need a free Groq API key.</p>
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
