# 🧭 Pathfinder TN

> **An AI-powered career guidance platform built for Tunisian engineering students.**
> https://mayssascat.github.io/pathfinder-tn

[![Live Demo](https://img.shields.io/badge/🔗-Live%20Demo-gold?style=for-the-badge)](https://YOUR_USERNAME.github.io/pathfinder-tn)
[![Made for Tunisia](https://img.shields.io/badge/🇹🇳-Made%20for%20Tunisia-cyan?style=for-the-badge)]()
[![AI Powered](https://img.shields.io/badge/🤖-AI%20Powered-purple?style=for-the-badge)]()

---

## ✨ What is Pathfinder TN?

**Pathfinder TN** is a free, open-source web application that helps Tunisian students discover their ideal engineering career path. Whether you are a high school graduate preparing for the national engineering entrance exam (*Concours National d'Accès aux Écoles d'Ingénieurs*), a CPGE student unsure which specialty to choose, or simply curious about engineering — Pathfinder guides you through the decision with **AI-powered recommendations** and **comprehensive field guides**.

### 🎯 The Problem We Solve

Every year, thousands of Tunisian students face the same dilemma:
- *"Which engineering field should I choose?"*
- *"What do software engineers actually do?"*
- *"Where can I study robotics in Tunisia?"*
- *"How much do engineers earn here vs. abroad?"*

Pathfinder TN answers all of these — in one place, in Darija-friendly English, with real Tunisian university data.

---

## 🚀 Features

### 🧭 AI Pathfinder Quiz
A 6-question personality & interest quiz powered by **Groq LLM (Llama 3)**. The AI analyzes your answers holistically and recommends the **2-3 best-fit engineering fields** with personalized explanations.

- **Smart fallback**: If the AI API is unavailable, a local scoring engine instantly provides results — the quiz never breaks.
- **Secure**: Users provide their own free Groq API key. No keys are stored on any server.

### 📚 Explore 28 Engineering Fields
Deep-dive guides covering:

| Section | Details |
|---------|---------|
| **Curriculum** | Year-by-year subjects (Prépa → Engineering cycle) |
| **Universities** | Exact schools in Tunisia — INSAT, ENIT, SUP'COM, ENIS, ENIM, EPT, and more |
| **Careers** | Real job titles with day-in-the-life schedules |
| **Salaries** | Tunisia vs. Europe vs. North America (entry & mid-level) |
| **Traits & Interests** | "Is this right for me?" self-assessment |
| **Future Tech** | Technologies shaping each field (AI, quantum, green energy, etc.) |

### 🗺️ Roadmaps (Coming Soon)
Personalized learning plans based on your current level and goals.

### 📡 Tech Today (Coming Soon)
A magazine covering the latest breakthroughs in engineering — AI, energy, robotics, and what's next.

---

## 🏫 Covered Engineering Schools

Pathfinder TN includes data from Tunisia's top engineering institutions:

- **INSAT** — Tunis (Génie Logiciel, Informatique Industrielle)
- **ENIT** — Tunis (Civil, Electrical, Mechanical, Industrial, ICT, Hydraulique)
- **SUP'COM** — Ariana (Telecom, Cybersecurity, Data Science)
- **ENSI** — Manouba (Computer Science, Intelligent Systems)
- **ENIS** — Sfax (Computer Science, Electrical, Mechanical, Civil)
- **ENIM** — Monastir (Mechanical, Energy, Textile, Industrial)
- **EPT** — La Marsa (Polytechnique, Advanced Techniques)
- **ENIG** — Gabès (Chemical, Civil, Petroleum)
- **ENISO** — Sousse (Mécatronique, Informatique Industrielle)
- **ENSIT** — Tunis (Topographie & Géomatique)
- **ENICarthage** — Ariana (Mécatronique, Electronics)
- **ISTMT** — Tunis (Biomedical)
- **INAT** — Tunis (Agronomic, Food Industry)
- **ESIAT** — Tunis (Food Industry)
- **And more...**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Styling** | Custom CSS with CSS Variables, Glassmorphism, Animations |
| **AI Engine** | Groq API (Llama 3 8B) — free tier available |
| **Data** | Static JSON (28 engineering fields) |
| **Hosting** | GitHub Pages / Netlify (100% static, zero server costs) |

---

## 🚀 Quick Start

### For Users
1. Visit the live site: `https://YOUR_USERNAME.github.io/pathfinder-tn`
2. Click **"Start Pathfinder"**
3. Get a free API key from [console.groq.com/keys](https://console.groq.com/keys) (takes 30 seconds)
4. Paste your key and take the 6-question quiz
5. Get your personalized AI recommendation!

### For Developers

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/pathfinder-tn.git
cd pathfinder-tn

# Open with Live Server (VS Code extension) or any static server
# Do NOT double-click index.html — fetch() requires a server
```

**No build step. No dependencies. No server to run.**

---

## 📁 Project Structure

```
pathfinder-tn/
├── index.html          # Main HTML shell
├── app.js              # All logic: router, quiz, AI call, rendering
├── style.css           # Complete design system + animations
├── data.json           # 28 engineering fields with full data
├── favicon.png         # Site icon
└── background.mp4      # Hero background video (optional)
```

---

## 🎨 Design Highlights

- **Dark theme** with gold & cyan accents — easy on the eyes for long reading sessions
- **Glassmorphism cards** with backdrop blur and subtle borders
- **3D flip cards** on the hero section (CSS `transform-style: preserve-3d`)
- **Shimmering gradient title** animation on the hero
- **Fully responsive** — works on mobile, tablet, and desktop
- **Smooth scroll** and page transitions

---

## 🔐 Privacy & Security

- **Your API key stays in YOUR browser** (localStorage / sessionStorage)
- **No backend server** — we never see your key or your quiz answers
- **No tracking** — no Google Analytics, no cookies, no data collection
- **Open source** — you can verify every line of code

---

## 🤝 Contributing

We welcome contributions! Here are some ways to help:

- 🐛 **Report bugs** — open an issue with steps to reproduce
- 📝 **Update data** — salaries, new schools, or curriculum changes
- 🌍 **Add fields** — we currently cover 28; there are more!
- 🎨 **Improve design** — CSS animations, accessibility, dark mode toggle
- 🌐 **Translate** — add Arabic/French language support
- 🤖 **Enhance AI** — improve the prompt or scoring algorithm

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add: your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

```
MIT License

Copyright (c) 2026 Pathfinder TN Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Groq** for providing fast, free LLM inference
- **Tunisia's engineering schools** for shaping generations of engineers
- **Every student** who ever asked *"Which field should I choose?"* — this is for you

---

## 📬 Contact

Have questions or feedback?

- Open an [Issue](https://github.com/mayssascat/pathfinder-tn/issues)
- Or reach out on [LinkedIn / Twitter / Email]

---

<p align="center">
  <strong>🇹🇳 Built with pride for Tunisian engineering students 🇹🇳</strong><br>
  <em>Aslema. Marhbe. Welcome to your future.</em>
</p>
