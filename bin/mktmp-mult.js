#! /usr/bin/env node

const path      = require('path')
const inquirer  = require('inquirer')
const copyFile = require('../src/copyFile')

const CURRENT_DIR = process.cwd()
const TMP_PATH = path.resolve(__dirname, '../tmp')
const VUE_TMP_DIR = path.resolve(TMP_PATH, './tmp.vue')
const SCSS_TMP_DIR = path.resolve(TMP_PATH, './tmp.scss')
const RELATIVEPATH = CURRENT_DIR.indexOf('src') > -1 ? './' : './src'

// program
//     .version(require('../package').version, '-v, --version')
//     .usage('[options] <argv>')
//     .parse(process.argv)

// program.on('--help', function(){
//     console.log('')
//     console.log('Examples:');
//     console.log('  $ mktmp --help');
//     console.log('  $ mktmp -h');
// })

inquirer.prompt([
    {
        
        type: 'input',
        name: 'filelist',
        message: 'Enter a list of file names separated by commas: ',
    }
])
    .then(({filelist}) => {
        let fileList = filelist.split(',')
        for(let i = 0, len = fileList.length; i < len; i++) {
            createFile(fileList[i])
        }
    })



function createFile(filename) {
    let VUE_DIR = path.resolve(CURRENT_DIR, RELATIVEPATH, `./components/${filename}.vue`)
    let SCSS_DIR = path.resolve(CURRENT_DIR, RELATIVEPATH, `./styles/${filename}.scss`)
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