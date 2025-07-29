# 活動聊天機器人前端

這是一個使用 Vue 3 和 Element Plus 開發的活動聊天機器人前端專案。提供自然語言查詢、活動分析和推薦功能。

## 功能特點

- 💬 自然語言聊天介面
- 📊 活動數據視覺化分析
- 🔍 進階活動搜尋與篩選
- 📱 響應式設計，支援各種裝置
- 🎨 現代化 UI 設計

## 技術棧

- Vue 3
- Element Plus
- Vite
- Vue Router
- Pinia
- ECharts
- Axios

## 系統需求

- Node.js 20.11.1 (LTS) 或更高版本
- npm 10.2.4 或更高版本

## 環境設置

### 使用 nvm 安裝 Node.js

1. 安裝 nvm

Windows:
```bash
# 使用 nvm-windows
# 下載並安裝 nvm-windows: https://github.com/coreybutler/nvm-windows/releases
```

macOS/Linux:
```bash
# 使用 curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 或使用 wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

2. 重新載入終端機設定
```bash
# Windows PowerShell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# macOS/Linux
source ~/.bashrc  # 或 source ~/.zshrc
```

3. 安裝 Node.js
```bash
# 安裝最新的 LTS 版本
nvm install --lts

# 或安裝特定版本（推薦）
nvm install 20.11.1

# 使用已安裝的版本
nvm use 20.11.1
```

4. 驗證安裝
```bash
node --version  # 應顯示 v20.11.1
npm --version   # 應顯示 10.2.4 或更高
```

## 安裝步驟

1. 克隆專案
```bash
git clone <repository-url>
cd event-chatbot-frontend
```

2. 安裝依賴
```bash
npm install
```

3. 啟動開發伺服器
```bash
npm run dev
```

4. 建置生產版本
```bash
npm run build
```

## 環境配置

### Vite 配置

專案使用 Vite 作為建置工具，主要配置在 `vite.config.js` 中：

```javascript
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api/analysis': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api/recommend': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api/activity': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 環境配置文件

專案使用不同的環境配置文件來管理開發和生產環境的設定：

1. 開發環境配置 (`.env.development`):
```
# Development environment configuration
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=EventChatBot (Development)
```

2. 生產環境配置 (`.env.production`):
```
# Production environment configuration
NODE_ENV=production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_TITLE=EventChatBot
```

3. 使用不同環境的命令：
```bash
# 開發環境
npm run dev          # 啟動開發伺服器
npm run build:dev    # 使用開發環境配置進行構建

# 生產環境
npm run build        # 使用生產環境配置進行構建
```

注意事項：
- 環境配置文件應添加到 `.gitignore` 中
- 可以根據需要添加更多環境變量
- 所有以 `VITE_` 開頭的變量都會被注入到前端代碼中

### API 代理說明

開發環境中的 API 請求流程：

1. 前端發送請求到 Vite 開發伺服器（例如：`http://localhost:5173/api/chat`）
2. Vite 根據代理配置將請求轉發到後端服務：
   - `/api/chat` → `http://127.0.0.1:8000/chat`
   - `/api/analysis/*` → `http://127.0.0.1:8000/analysis/*`
   - `/api/recommend` → `http://127.0.0.1:8000/recommend`
   - `/api/activity/*` → `http://127.0.0.1:8000/activity/*`

代理配置的作用：
- 自動移除 `/api` 前綴，確保與後端 API 路徑一致
- 處理跨域（CORS）問題
- 在開發環境中提供統一的 API 前綴
- 方便本地開發和測試

注意：在生產環境中，需要配置 Web 伺服器（如 Nginx）來處理這些 API 請求的轉發。

## 專案結構

```
event-chatbot-frontend/
├── src/
│   ├── assets/          # 靜態資源
│   ├── views/           # 頁面組件
│   ├── router/          # 路由配置
│   ├── App.vue          # 根組件
│   └── main.js          # 入口文件
├── public/              # 公共資源
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
└── package.json         # 專案配置
```

## 部署指南

### 開發環境

1. 確保後端 API 服務運行在 `http://127.0.0.1:8000`
2. 運行開發伺服器：
```bash
npm run dev
```
3. 訪問 `http://localhost:5173`

### 生產環境

1. 建置專案：
```bash
npm run build
```

2. 部署 `dist` 目錄到 Web 伺服器

3. 配置 Nginx（範例）：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;  # 移除結尾的斜線
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

實際SSL 配置範例：
```nginx
server {
    listen       5000 ssl;
    server_name  eventgo.widm.csie.ncu.edu.tw;

    ssl_certificate      D://Portable//nginx-1.24.0-ssl//ssl//eventgoca//eventgo.widm.csie.ncu.edu.tw-chain.pem;
    ssl_certificate_key  D://Portable//nginx-1.24.0-ssl//ssl//eventgoca//eventgo.widm.csie.ncu.edu.tw-key.pem;

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    root   D:\production\EventChatBotFrontend\web\html;
    index  index.html index.htm;

    # 處理 API 請求
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 處理所有其他請求
    location / {
        try_files $uri $uri/ /index.html;  # 將所有非 API 請求轉發到 index.html
    }
}
```

這樣修改後：
- API 請求（`/api/*`）會被轉發到後端服務
- 所有其他請求（如 `/analysis`、`/chat` 等）都會返回 `index.html`
- Vue Router 會接管路由處理，實現客戶端路由

注意事項：
- 確保 `root` 路徑指向正確的構建輸出目錄
- 所有靜態資源（如 JS、CSS 文件）應該放在 `root` 目錄下
- 如果使用子目錄部署，需要相應調整 `root` 路徑

### 後端部署

1. 安裝依賴：
```bash
# 使用 conda（推薦）
conda env create -f environment.yml
conda activate event-chatbot

# 或使用 pip
pip install -r requirements.txt
```

2. 配置環境變量：
```bash
# 創建 .env 文件
OPENAI_API_KEY=your_api_key_here
EVENTGO_API_BASE=https://eventgo.widm.csie.ncu.edu.tw:3006
```

3. 啟動後端服務：
```bash
# 方式一：使用 uvicorn（推薦）
uvicorn main:app --host 0.0.0.0 --port 8000

# 方式二：直接運行 Python
python main.py
```

4. 使用 Gunicorn 進行生產部署（推薦）：
```bash
# 安裝 gunicorn
pip install gunicorn

# 啟動服務
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

注意事項：
- 確保服務器防火牆已開放 8000 端口
- 建議使用 Gunicorn 作為 WSGI 服務器
- 可以配置 systemd 服務來管理後端進程
- 建議使用 Nginx 作為反向代理

## API 整合

專案與以下 API 端點整合：

- `/chat` - 聊天介面
- `/analysis/monthly` - 月度活動分析
- `/analysis/geographic` - 地理分布分析
- `/analysis/categories` - 類別分布分析
- `/recommend` - 活動推薦

## 開發指南

### 新增頁面

1. 在 `src/views` 創建新的 Vue 組件
2. 在 `src/router/index.js` 添加路由配置

### 修改主題

主題顏色可在 `src/assets/main.css` 中修改：

```css
:root {
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
}
```

## 常見問題

1. 如果遇到 CORS 問題，請確保後端 API 已正確配置 CORS 或使用 Vite 的代理功能。

2. 如果圖表無法顯示，請檢查：
   - ECharts 是否正確引入
   - 容器元素是否有固定高度
   - 數據格式是否正確

3. nvm 相關問題：
   - Windows 用戶如果遇到權限問題，請以管理員身份運行命令提示符
   - 如果 nvm 命令無法使用，請確保已正確設置環境變量
   - 切換 Node.js 版本後，可能需要重新安裝全局包

4. API 代理問題：
   - 確保後端服務運行在正確的地址和端口
   - 檢查 vite.config.js 中的代理配置是否正確
   - 如果修改了後端服務地址，需要相應更新代理配置
