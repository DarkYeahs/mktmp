#! /usr/bin/env node

const program   = require('commander')
const path      = require('path')
const fs        = require('fs')
const colors    = require('colors')

program
    .version(require('../package').version, '-v, --version')
    .usage('[options] <argv>')
    .option('-f, --filename <filename>', 'file name')
    .option('-p, --pathname <pathname>', 'relative path name')
    .parse(process.argv)

program.on('--help', function(){
    console.log('')
    console.log('Examples:');
    console.log('  $ mktmp --help');
    console.log('  $ mktmp -h');
})

let filename = process.argv[2]

function make_red(txt) {
    return colors.red(txt)
}

if (!process.argv.slice(2).length) {
    program.outputHelp(make_red)
    return
}

if (!(program.filename || filename)) {
    throw new Error('请输入文件名')
}

if (program.filename) filename = program.filename

const CURRENT_DIR = process.cwd()
let relativePath = ''

if (CURRENT_DIR.indexOf('src') > -1) relativePath = './'
else relativePath = './src'

if (program.pathname) relativePath = program.pathname

const TMP_PATH = path.resolve(__dirname, '../tmp')
const VUE_DIR = path.resolve(CURRENT_DIR, relativePath, `./components/${filename}.vue`)
const SCSS_DIR = path.resolve(CURRENT_DIR, relativePath, `./styles/${filename}.scss`)
const VUE_TMP_DIR = path.resolve(TMP_PATH, './tmp.vue')
const SCSS_TMP_DIR = path.resolve(TMP_PATH, './tmp.scss')
const className = filename.replace(/_/g, '-')

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

async function copyFile(tmpPath, aimsPath) {

    const readRes = await readFile(tmpPath)
    const writeRes = await writeFile(aimsPath, readRes)

    return writeRes
}
    