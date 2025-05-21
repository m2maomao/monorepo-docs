## 基于PNPM的Monorepo项目详细搭建步骤
## 1.项目初始化
### 1.1 创建项目根目录
```bash
mkdir pnpm-monorepo-demo
cd pnpm-monorepo-demo
```
### 1.2 初始化根目录package.json
```bash
pnpm init
```
修改生成的`package.json`为：
```
{
  "name": "pnpm-monorepo-demo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @demo/app dev",
    "build": "pnpm --filter @demo/app build",
    "test": "pnpm -r test"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```
### 1.3 创建 PNPM 工作区配置
```
touch pnpm-workspace.yaml
```
修改`pnpm-workspace.yaml`为：
```
packages:
  - 'packages/*'
  - 'tools/*'
```
## 2.创建应用包
### 2.1 创建应用包目录
```
mkdir -p packages/app
cd packages/app
pnpm init
```
修改生成的`package.json`为：
```
{
  "name": "@demo/app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@demo/utils": "workspace:*"
  }
}
```
### 2.2 安装React和Vite
```
pnpm add react react-dom
pnpm add -D vite @vitejs/plugin-react typescript
```
### 2.3 配置Vite
```
touch vite.config.ts
```
内容
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```
### 2.4 创建应用代码
```
mkdir src
touch src/main.tsx src/App.tsx index.html
```
index.html
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Monorepo Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
```
src/main.tsx
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
src/App.tsx
```
import { formatDate } from '@demo/utils';

const App = () => {
  return (
    <div>
      <h1>Monorepo Demo App</h1>
      <p>Today is: {formatDate(new Date())}</p>
    </div>
  )
}

export default App;
```
## 3.创建工具包(@demo/utils)
### 3.1 创建工具包目录
```
cd ../../
mkdir -p tools/utils
cd tools/utils
pnpm init
```
修改生成的`package.json`为：
```
{
  "name": "@demo/utils",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```
### 3.2 安装TypeScript
```
pnpm add -D typescript
```
### 3.3 配置TypeScript
```
npx tsc --init
```
修改生成的`tsconfig.json`为：
```
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "outDir": "./dist",
    "declaration": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```
### 3.4 创建工具代码
```
mkdir src
touch src/index.ts
```
内容：
```
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```
## 4.构建工具包
### 4.1 构建工具包
```
pnpm build
```
### 4.2 在应用包中链接工具包
确保应用包中的`package.json`中有：
```
"dependencies": {
  "@demo/utils": "workspace:*"
}
```
然后在根目录运行：
```
pnpm install
```
## 5.项目最终结构
pnpm-monorepo-demo/
|- node_modules
|- packages/
|   |- app/
|       |- tsconfig.json
|       |- package.json
|       |- vite.config.ts
|       |- index.html
|       |- src/
|           |- main.tsx
|           |- App.tsx
|- tools/
|   |- utils/
|       |- dist/
|       |- package.json
|       |- tsconfig.json
|       |- src/
|           |- index.ts
|- package.json
|- pnpm-workspace.yaml
|- pnpm-lock.yaml
## 6.启动项目
在根目录运行
```
pnpm dev
```
## 7.添加共享配置（可选）
### 7.1 创建共享ESLint配置
```
mkdir -p configs/eslint
cd configs/eslint
pnpm init
```
修改 `package.json`
```
{
  "name": "@demo/eslint-config",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react": "^7.0.0"
  }
}
```
创建`index.js`:
```
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    // 自定义规则
  }
}
```
### 7.2 在应用包中使用共享配置
在子包的`package.json`中添加：
```
"devDependencies": {
  "@demo/eslint-config": "workspace:*"
}
```
## 8.常用命令总结
1、安装所有依赖：
```
pnpm install
```
2、启动开发服务器：
```
pnpm dev
```
3、构建所有包：
```
pnpm build
```
4、只构建特定包：
```
pnpm --filter @demo/app build
```
5、运行所有测试：
```
pnpm -r test
```
6、添加全局依赖：
```
pnpm add -w lodash
```
7、给特定包添加依赖：
```
pnpm --filter @demo/app add react-router-dom
```
