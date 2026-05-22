# Solar Dashboard ☀️

A full-stack **solar production analytics dashboard**.

Upload a CSV → instantly get:
- 📊 Clean metrics
- 📈 Trend visualization
- 🤖 AI-powered insights (Groq LLM)

---

## 📸 Preview

### Dashboard Overview
![Dashboard 1](./public/images/img1.png)

### Analytics View
![Dashboard 2](./public/images/img2.png)

### Demo (GIF)
![Demo](./public/gifs/demo.gif)

---

## 🚀 Features

- 📁 Drag & drop CSV upload
- 📊 Real-time production metrics
- 📈 Interactive Recharts graph
- 🤖 AI insights using Groq API
- 📅 Date filtering (7D / 30D / 90D / All)
- 🧪 Built-in demo dataset (no upload needed)

---

## 🧠 Tech Stack

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- Recharts
- PapaParse (CSV parsing)

### Backend
- Node.js + Express + TypeScript
- Groq AI API integration
- dotenv for environment variables

---

## ⚙️ How to Run (Beginner Friendly)

### 1️⃣ Prerequisites

Make sure you have:

```bash
node -v   # v18+
pnpm -v   # install: npm i -g pnpm
```

---

### 2️⃣ Install dependencies

From project root:

```bash
cd Server && pnpm install
cd ../Client && pnpm install
```

---

### 3️⃣ Setup environment variables

```bash
cd Server/.env.example Server/.env
```

Open `Server/.env` and add:

```env
GROQ_API_KEY=your_actual_groq_key_here
PORT=3000
```

👉 Get your key from: https://console.groq.com

---

### 4️⃣ Run the project

Open TWO terminals:

#### Backend
```bash
cd Server
pnpm dev
```

Server runs at:
```
http://localhost:3000
```

#### Frontend
```bash
cd Client
pnpm dev
```

Frontend runs at:
```
http://localhost:5173
```

---

### ⚡ Quick Start (Demo Mode)

No CSV needed:

👉 Click **"Load Demo Data"** inside the app

---

## 📂 Project Structure

```
solar-dashboard/
├── Server/        Express + Groq AI backend
├── Client/        React dashboard UI
├── sample.csv     Demo dataset
└── public/
    ├── images/
    │   ├── img1.png
    │   └── img2.png
    └── gifs/
        └── demo.gif
```

---

## 🤖 How AI Works

```
Frontend → Backend → Groq API → AI Response → Frontend
```

- API key is stored ONLY in backend (`Server/.env`)
- Frontend never sees secrets
- `/api/ai/insights` handles requests securely

---

## 📄 CSV Format

Simple format:

```csv
date,production_kwh
2026-01-01,373
```

Advanced format also supported:

```csv
date,site_name,daily_production_kwh,weather,anomaly_detected
2026-01-01,Site A,373,Cloudy,Yes
```

---

## 🧩 Architecture Decisions

- 🔐 Backend-only API key security (Groq)
- ⚡ Vite proxy for `/api` calls
- 📦 Client-side CSV parsing (fast + simple)
- 🧠 Pure metric computation utilities
- 🎯 Demo data included for zero setup friction

---

## 📌 Future Improvements

- Weather API integration 🌦️
- PDF export reports 📄
- Multi-site comparison 📊
- Database persistence (PostgreSQL)
- User authentication 🔐
- Streaming AI responses ⚡

---

