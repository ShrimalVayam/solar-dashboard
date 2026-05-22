# Solar Dashboard

A full-stack solar production analytics dashboard.  
Upload a CSV → see metrics, trend chart, and AI-powered insights.

```
frontend/   React + Vite + TypeScript (fe-boilerplate)
Server/    Express + TypeScript + ts-node (be-boilerplate)
```

---

## ▶ How to Run (Zero Errors)

### Step 1 — Prerequisites
Make sure you have these installed:
```bash
node --version   # must be v18 or higher (for native fetch)
pnpm --version   # install: npm install -g pnpm
```

### Step 2 — Install dependencies
```bash
# From the project root:
cd Server  && pnpm install
cd ../Client && pnpm install
cd ..
```

### Step 3 — Add your Anthropic API key
```bash
cp .env.example Server/.env
# Open Server/.env and set:
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```
> The app works without a key — the AI Insights button will show a clear
> error. CSV upload, metrics, and the chart all work without a key.

### Step 4 — Start the project
Open **two terminals**:

**Terminal 1 — Server API (port 3001)**
```bash
cd Server
pnpm dev
```
You should see:
```
🟢 Solar API running on http://localhost:3001
✅ ANTHROPIC_API_KEY loaded
```

**Terminal 2 — Client (port 5173)**
```bash
cd Client
pnpm dev
```
You should see:
```
  VITE v7.x  ready in Xms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

### Alternative — Start both at once (from root)
```bash
# Install concurrently first:
npm install   # installs concurrently at root level

# Then run both:
npm run dev
```

---

## Testing Without a CSV

Click **Load Demo Data** in the header to instantly load 30 days of
sample solar production data — no file upload needed.

Or upload the included `sample.csv` from the project root.

---

## Project Structure

```
solar-dashboard/
├── Server/                  ← Express API (be-boilerplate)
│   ├── src/
│   │   ├── server.ts         starts server, loads .env
│   │   ├── app.ts            Express app, middleware, routes
│   │   ├── routes/
│   │   │   ├── health.route.ts
│   │   │   └── ai.route.ts   POST /api/ai/insights
│   │   ├── controllers/
│   │   │   ├── health.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── services/
│   │   │   ├── health.service.ts
│   │   │   └── ai.service.ts  calls Anthropic, key stays server-side
│   │   └── utils/logger.ts
│   ├── package.json
│   ├── tsconfig.json         CommonJS module system
│   └── nodemon.json
│
├── Client/                 ← React app (fe-boilerplate)
│   ├── src/
│   │   ├── App.tsx           layout, state, routing between screens
│   │   ├── components/
│   │   │   ├── FileUpload    drag-and-drop CSV upload
│   │   │   ├── SummaryCards  4 metric cards with icons
│   │   │   ├── ProductionChart  Recharts area chart
│   │   │   ├── AIInsights    Generate Insights panel
│   │   │   └── DateFilter    7D / 30D / 60D / 90D / All pills
│   │   ├── utils/
│   │   │   ├── parseCsv.ts   PapaParse wrapper
│   │   │   ├── metrics.ts    pure computation helpers
│   │   │   ├── api.ts        calls /api/ai/insights
│   │   │   └── demoData.ts   embedded 30-day sample dataset
│   │   └── types/solar.ts
│   ├── vite.config.ts        proxies /api → localhost:3001
│   └── package.json
│
├── sample.csv                30-day solar dataset for testing
├── .env.example              API key template
└── README.md
```

---

## How the AI works (no key in the browser)

```
Browser                  Server/src/services/ai.service.ts   Anthropic
  │                                    │                          │
  │  POST /api/ai/insights             │                          │
  │  { system, messages }  ──────────► │  x-api-key: (from .env) │
  │                                    │ ────────────────────────►│
  │                                    │ ◄────────────────────────│
  │  ◄──────── { text: "..." }         │                          │
```

`ANTHROPIC_API_KEY` lives only in `Server/.env`.  
Vite proxies all `/api` requests to `localhost:3001` during dev.

---

## CSV Format

Both column name variants are accepted:

```csv
date,production_kwh
2026-01-01,373
```

```csv
date,site_name,daily_production_kwh,weather,anomaly_detected
2026-01-01,My Site,373,Cloudy,Yes
```

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| Separate Server for AI | API key never touches the browser |
| `ts-node` + CommonJS in Server | Avoids ESM/CJS conflicts — the root cause of previous startup failures |
| Frontend-only CSV parsing | No file upload endpoint needed; PapaParse works client-side |
| `computeMetrics` pure function | Easy to test, no side effects |
| Embedded demo data | Zero-friction demo without needing a file upload |

---

## Tradeoffs

- **No persistent storage** — data lives in React state, cleared on refresh
- **No auth** — appropriate for a local analytics tool
- **Lightweight CSV validation** — catches structural issues, not semantic ones (e.g. duplicate dates)
- **`claude-haiku`** — fast and cheap; the task is short-context summarisation

---

## Future Improvements

- Stream AI responses token-by-token
- Weather API overlay on the chart
- Anomaly detection (z-score based)
- Multi-site CSV comparison
- Export chart as PNG / summary as PDF
- Persistent history (PostgreSQL + auth)
