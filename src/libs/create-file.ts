const exportAnalysisHooks = ( text:string, filename:string ) => {
    const blob = new Blob([text], { type: 'application/json' })
      const fileName = filename || '本地文件';
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
    }
}
export default exportAnalysisHooks;