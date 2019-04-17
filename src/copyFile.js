const readFile = require('./readFile')
const writeFile = require('./writeFile')

async function copyFile(tmpPath, aimsPath, filename) {

    const readRes = await readFile(tmpPath)
    const writeRes = await writeFile(aimsPath, readRes, filename)

    return writeRes
}

module.exports = copyFile
