const fs = require('fs-extra')
const path = require('path')

// 文档构建输出目录
const docsDistPath = path.resolve(__dirname, '../packages/docs/.vitepress/dist')
// 主应用的公共目录，docs 子目录
const appPublicDocsPath = path.resolve(__dirname, '../packages/app/public/docs')

async function copyDocs() {
  try {
    // 确保目标目录存在
    await fs.ensureDir(appPublicDocsPath)
    
    // 清空目标目录
    await fs.emptyDir(appPublicDocsPath)
    
    // 复制文档构建输出到主应用公共目录
    await fs.copy(docsDistPath, appPublicDocsPath)
    
    console.log('文档已成功复制到主应用公共目录')
  } catch (err) {
    console.error('复制文档时出错:', err)
    process.exit(1)
  }
}

copyDocs()