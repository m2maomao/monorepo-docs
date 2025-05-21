import { defineConfig, Plugin } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

// 创建一个处理目录访问的插件
function directoryIndexPlugin(): Plugin {
  return {
    name: 'directory-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 处理以 /docs/ 开头的请求
        if (req.url === '/docs' || req.url === '/docs/') {
          const indexPath = path.join(process.cwd(), 'public/docs/index.html')
          
          if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf-8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            return res.end(content)
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  // 确保 publicDir 设置正确（默认为 'public'）
  publicDir: 'public',
  build: {
    // 确保构建时复制 public 目录
    copyPublicDir: true
  },
  plugins: [directoryIndexPlugin()]
})
