# Pomodoro Board — Do-List × Pomodoro × Markdown (MERN)

一個以 Vite + React + TypeScript 打造的三欄生產力面板，整合：
- 左：待辦清單（Do‑List）
- 中：番茄鐘（自動切換專注/休息、保存 Session）
- 右：Markdown 記事本（即時預覽、可下載 txt/Word）

後端採 Express + Mongoose，連線 MongoDB（環境變數 `MONGODB_URI`）。前端狀態由 React Context（useReducer）管理，並使用 localStorage 做基礎持久化。附 GitHub Actions CI（型別檢查 & build）。

---

## ✨ 功能
- Do‑List：新增/完成/刪除（與後端同步）
- 番茄鐘：開始/暫停/重置；倒數歸零自動切換 Phase；結束即存一筆 Session 至後端；今日完成番茄數即時統計
- Markdown 記事本：編輯即時預覽；一鍵下載 `.txt` 或 Word (`.doc`)
- 背景聲 Soundscape（可選）：輕音樂/白噪音循環播放（需自行放音檔於 `client/public/Music/`）
- 持久化：前端 localStorage；後端 MongoDB Atlas
- CI：GitHub Actions（Node 20，前端 Type Check & Build）

---

## 🧱 專案結構
```
pomodoro-board/
├─ client/              # 前端（Vite + React + TS）
│  ├─ public/           # 靜態資源（Music/ 請自行放 mp3）
│  └─ src/
│     ├─ components/
│     ├─ context/       # AppProvider / reducer / types
│     ├─ services/      # API 呼叫封裝
│     └─ styles/
├─ server/              # 後端（Node + Express + Mongoose）
│  └─ src/
│     ├─ models/        # Todo / Note / Setting / Session
│     ├─ routes/        # todos / notes / settings / sessions
│     └─ index.js       # 入口，掛載 CORS / 路由 / Mongo 連線
├─ .github/workflows/ci.yml
├─ package.json         # workspaces（client + server）
└─ .gitignore
```

---

## ⚙️ 需求條件
- Node.js 20+
- MongoDB（建議 MongoDB Atlas），提供 `MONGODB_URI`

---

## 🚀 開發啟動
1) 建立後端環境變數
- 複製 `server/.env.example` → `server/.env`
- 設定 `MONGODB_URI`（MongoDB Atlas 連線字串）
- `PORT` 可預設 `5000`
- `CLIENT_ORIGIN` 預設 `http://localhost:5174`

2) 安裝依賴
```
npm install
```

3) 啟動
- 建議兩個終端視窗：
```
# 視窗 A：同時啟動（若你只設定了 Vite，請另開視窗 B 啟動後端）
npm run dev

# 視窗 B：只啟動後端（如果視窗 A 沒有啟動後端的話）
npm -w server run dev
```

4) 驗收
- 前端：`http://localhost:5174/`
- 健康檢查：`http://localhost:5000/api/health` 應回 `{"ok": true}`

---

## 🔊 背景音樂（可選）
- 將音檔放在 `client/public/Music/`：
  - `client/public/Music/light_music.mp3`
  - `client/public/Music/White_noise.mp3`
- 前端會用 `/Music/<檔名>.mp3` 由 Vite（5174）提供並循環播放
- 注意音檔大小，建議使用小於 100 MB 的 mp3 以利開發與部署

---

## 🔌 API 速覽
- Base：`/api`
- `GET /health`：健康檢查
- `GET /todos`、`POST /todos`、`PATCH /todos/:id`、`DELETE /todos/:id`
- `GET /notes`、`POST /notes`、`PATCH /notes/:id`
- `GET /settings`、`PUT /settings`
- `POST /sessions`、`GET /sessions/stats`（回傳近 7 天 phase/總秒數/次數）

---

## 🧭 設計重點
- 前端狀態管理：React Context + useReducer（可快速擴充）
- localStorage：初始載入時 lazy 初始化，避免覆蓋舊資料
- 番茄鐘：倒數歸零→存 Session→切換 phase→停止計時
- 今日番茄數：從 `/sessions/stats` 取回，倒數完成即時累加
- CORS：後端以 `CLIENT_ORIGIN` 控制；開發預設 `5174`
- Monorepo：根 `package.json` 使用 workspaces 管理 client/server

---

## 🧪 CI（GitHub Actions）
- 觸發：push / PR
- Node 20，執行：
  - `npm ci`
  - 前端 `typecheck` / `build`

---

## 🚢 部署建議
- 前端（Vite 靜態）：Vercel / Netlify
  - 設 `VITE_API_BASE_URL` 指向後端域名（例如 Render）
- 後端（Express）：Render / Railway / Fly.io
  - 環境變數：`MONGODB_URI`、`CLIENT_ORIGIN`（填前端域名）
- 音檔：
  - 若檔案較大，建議使用 CDN / 物件儲存（S3、Cloudflare R2）或提供下載指引

---

## 📝 指令速查
- 安裝依賴：`npm install`
- 啟動：`npm run dev`
- 前端型別檢查：`npm -w client run typecheck`
- 前端建置：`npm -w client run build`

---

## ✅ 貢獻/提交規範
- Commit：建議採用 Conventional Commits
  - `feat: add Pomodoro auto-switch & session save`
  - `fix: rollback todo toggle on failure`
  - `chore: add CI workflow`

---

## 📄 授權
此專案用於學習/展示用途，依實際需求可自訂授權。
