const fs = require('fs')

function writeFile(path, content, filename) {
    let className = filename.replace(/_/g, '-')
    let promise = new Promise((resolve, reject) => {
        const dir = path.split('\\').slice(0, -1).join('\\')
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        if (fs.existsSync(path)) {
            reject('存在该文件')
            return
        }
        content = content.replace(/\{\$className\}/g, className)
        content = content.replace(/\{\$fileName\}/g, filename)
        fs.writeFile(path, content, (err) => {
            if(err) {
                reject(err)
                return
            }
        
            resolve()
        })
    })

    return promise
}

module.exports = writeFile
