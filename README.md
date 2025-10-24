# Pomodoro Board · Do-List × Pomodoro × Markdown (MERN)

以 Vite + React + TypeScript 打造的三欄生產力面板，整合：
- 左欄：待辦清單（Do‑List）
- 中欄：番茄鐘（自動切換專注/休息、儲存 Session）
- 右欄：Markdown 記事本（即時預覽、可下載 txt / Word）

後端採 Express + Mongoose，連線 MongoDB（環境變數 `MONGODB_URI`）。前端狀態由 React Context（useReducer）管理，並以 localStorage 進行基本持久化。內建 GitHub Actions CI：型別檢查與建置。

---

## ✨ 功能概覽
- Do‑List：新增 / 完成 / 刪除（與後端同步）
- 番茄鐘：開始 / 暫停 / 重置；倒數歸零自動切換 Phase；結束即記錄 Session；今日完成番茄數即時統計
- Markdown 記事本：編輯即時預覽；一鍵下載 `.txt` 或 Word (`.doc`)
- 背景聲 Soundscape：可選輕音樂 / 白噪音循環播放（需自行放音檔於 `client/public/Music/`）
- 前端持久化 LocalStorage、後端 MongoDB Atlas
- CI：GitHub Actions（Node 20，執行 Type Check + Build）

---

## 🧱 專案結構
```
pomodoro-board/
├─ client/                # 前端（Vite + React + TS）
│  ├─ public/             # 靜態資源（Music/ 請自行放 mp3）
│  └─ src/
│     ├─ components/
│     ├─ context/         # AppProvider / reducer / types
│     ├─ services/        # API 呼叫封裝
│     └─ styles/
├─ server/                # 後端（Node + Express + Mongoose）
│  └─ src/
│     ├─ models/          # Todo / Note / Setting / Session
│     ├─ routes/          # todos / notes / settings / sessions
│     └─ index.js         # 入口，掛載 CORS / 路由 / Mongo 連線
├─ .github/workflows/     # CI / Release / Packages workflows
├─ package.json           # workspaces（client + server）
└─ .gitignore
```

---

## ⚙️ 需求條件
- Node.js 20+
- MongoDB（建議 MongoDB Atlas），提供 `MONGODB_URI`

---

## 🚀 開發啟動
1. 設定後端環境變數
   - 複製 `server/.env.example` → `server/.env`
   - 設定 `MONGODB_URI`（MongoDB Atlas 連線字串）
   - `PORT` 預設 `5000`，`CLIENT_ORIGIN` 預設 `http://localhost:5174`
2. 安裝依賴
   ```bash
   npm install
   ```
3. 啟動
   ```bash
   # 視窗 A：若要同時啟動前後端
   npm run dev

   # 視窗 B：只啟動後端（若視窗 A 沒啟後端）
   npm -w server run dev
   ```
4. 驗收
   - 前端：`http://localhost:5174/`
   - 健康檢查：`http://localhost:5000/api/health` 應回 `{ "ok": true }`

---

## 🔊 背景音樂（可選）
- 將音檔放在 `client/public/Music/`：
  - `client/public/Music/light_music.mp3`
  - `client/public/Music/White_noise.mp3`
- 前端以 `/Music/<檔名>.mp3`（5174）讀取並循環播放
- 建議使用 < 100 MB 的 mp3 以利開發與部署（大型檔可改用 CDN / 物件儲存）

---

## 🔌 API 速覽
- Base：`/api`
- `GET /health` — 健康檢查
- Todos：`GET /todos`, `POST /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`
- Notes：`GET /notes`, `POST /notes`, `PATCH /notes/:id`
- Settings：`GET /settings`, `PUT /settings`
- Sessions：`POST /sessions`, `GET /sessions/stats`（近 7 天 phase + totalSec + count）

---

## 🧭 設計重點
- React Context + useReducer 管理狀態，可快速擴充
- localStorage lazy 初始化，避免覆蓋既有資料
- 番茄鐘倒數 → 儲存 Session → 切換 Phase → 停止計時
- 今日番茄數：從 `/sessions/stats` 取得並即時更新
- CORS 以 `CLIENT_ORIGIN` 控制
- Monorepo：根 `package.json` 使用 workspaces 管理 client/server

---

## 🧪 CI（GitHub Actions）
- 觸發：push / pull request
- Node 20，執行：
  - `npm ci`
  - `npm -w client run typecheck`
  - `npm -w client run build`

---

## 🚢 部署建議
- 前端（Vite 靜態）：Vercel / Netlify
  - 設 `VITE_API_BASE_URL` 指向後端服務（如 Render）
- 後端（Express）：Render / Railway / Fly.io
  - 設 `MONGODB_URI`、`CLIENT_ORIGIN`
- 音樂檔：大型檔案建議改放於 CDN 或提供下載指引

---

## 📦 GitHub Releases / Packages
- 推送 `v*` 標籤會觸發兩個 workflow：
  1. **Release**：建置前端並在 GitHub Release 附上 `client-dist.zip`
  2. **Publish Packages**：發佈到 GitHub Packages
     - `@professor03/pomodoro-board-client`（包含 `dist/`）
     - `@professor03/pomodoro-board-server`（包含 `src/`）
- 基本操作：
  ```bash
  git tag v0.1.0
  git push origin v0.1.0
  ```
- 安裝 GitHub Packages 套件：
  ```bash
  npm install @professor03/pomodoro-board-server --registry=https://npm.pkg.github.com
  ```

---

## 📝 指令速查
- 安裝依賴：`npm install`
- 啟動開發：`npm run dev`
- 前端型別檢查：`npm -w client run typecheck`
- 前端建置：`npm -w client run build`

---

## ✅ 提交規範
- 建議採用 Conventional Commits，例如：
  - `feat: add Pomodoro auto-switch & session save`
  - `fix: rollback todo toggle on failure`
  - `chore: add CI workflow`

---

## 📄 授權
此專案主要用於學習 / 展示，可依實際需求調整授權政策。
