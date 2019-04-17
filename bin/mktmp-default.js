// const fs        = require('fs')
const colors    = require('colors')
const path      = require('path')
const program   = require('commander')
const copyFile  = require('../src/copyFile')

const TMP_PATH = path.resolve(__dirname, '../tmp')
const CURRENT_DIR = process.cwd()
const VUE_TMP_DIR = path.resolve(TMP_PATH, './tmp.vue')
const SCSS_TMP_DIR = path.resolve(TMP_PATH, './tmp.scss')
const RELATIVEPATH = CURRENT_DIR.indexOf('src') > -1 ? './' : './src'

// program
//     .version(require('../package').version, '-v, --version')
//     .usage('[options] <argv>')
//     .option('-f, --filename <filename>', 'file name')
//     .option('-p, --pathname <pathname>', 'relative path name')
//     .parse(process.argv)

// program.on('--help', function(){
//     console.log('')
//     console.log('Examples:');
//     console.log('  $ mktmp --help');
//     console.log('  $ mktmp -h');
// })


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

createFile(filename)

function createFile(filename) {
    let VUE_DIR = path.resolve(CURRENT_DIR, (program.pathname || RELATIVEPATH), `./components/${filename}.vue`)
    let SCSS_DIR = path.resolve(CURRENT_DIR,(program.pathname || RELATIVEPATH), `./styles/${filename}.scss`)
    let vueCopy = copyFile(VUE_TMP_DIR, VUE_DIR, filename)
    let scssCopy = copyFile(SCSS_TMP_DIR, SCSS_DIR, filename)

    Promise.all([vueCopy, scssCopy])
        .then(() => {
            console.log('create success!')
        })
        .catch(e => {
            console.log(e)
        })
}