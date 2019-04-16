#! /usr/bin/env node

const program    = require('commander')
const path       = require('path')
const fs         = require('fs')

program
    .version(require('../package').version, '-v, --version')
    .usage('[options] <file ...>')
    .option('-f, --filename <filename>', 'file name')
    .parse(process.argv)

program.on('--help', function(){
    console.log('')
    console.log('Examples:');
    console.log('  $ custom-help --help');
    console.log('  $ custom-help -h');
})

if (!program.filename) {
    throw new Error('请输入文件名')
}

const CURRENT_DIR = process.cwd()
let relativePath = ''

if (CURRENT_DIR.indexOf('src') > -1) relativePath = './'
else relativePath = './src'
const TMP_PATH = path.resolve(__dirname, '../tmp')
const VUE_DIR = path.resolve(CURRENT_DIR, relativePath, `./components/${program.filename}.vue`)
const SCSS_DIR = path.resolve(CURRENT_DIR, relativePath, `./styles/${program.filename}.scss`)
const VUE_TMP_DIR = path.resolve(TMP_PATH, './tmp.vue')
const SCSS_TMP_DIR = path.resolve(TMP_PATH, './tmp.scss')

const className = program.filename.replace(/_/g, '-')

let vueCopy = copyFile(VUE_TMP_DIR, VUE_DIR)
let scssCopy = copyFile(SCSS_TMP_DIR, SCSS_DIR)

Promise.all([vueCopy, scssCopy])
    .then(() => {
        console.log('success!')
    })
    .catch(e => {
        console.log(e)
    })


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

function writeFile(path, content) {
    let promise = new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            reject('存在该文件')
            return
        }
        content = content.replace(/\{\$className\}/g, className)
        content = content.replace(/\{\$fileName\}/g, program.filename)
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

function copyFile(tmpPath, aimsPath) {
    const promise = new Promise((resolve, reject) => {
        readFile(tmpPath)
            .then(data => {
                writeFile(aimsPath, data)
                    .then(() => {
                        resolve()
                    })
                    .catch(e => {
                        reject(e)
                    })
            })
            .catch(e => {
                reject(e)
            })
    })

    return promise
}
    