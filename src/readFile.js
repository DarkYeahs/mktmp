const fs = require('fs')

function readFile(path) {
    let promise = new Promise((resolve, reject) => {
        fs.readFile(path, {encoding:"utf-8"}, (err, fd) => {
            if (err) {
                reject(err)
                return
            }
        
            resolve(fd)
        })
    })

    return promise
}

module.exports = readFile