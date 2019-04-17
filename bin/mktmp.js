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
    .option('-t, --template <template url>', 'template url')
    .parse(process.argv)

program.on('--help', function(){
    console.log('')
    console.log('Examples:');
    console.log('  $ mktmp --help');
    console.log('  $ mktmp -h');
})

const argv = process.argv[2]
const commandList = ['mult', 'init']
const defaultCommand = 'default'
let command = ''

if (commandList.indexOf(argv) > -1) command = argv
else command = defaultCommand

require(`./mktmp-${command}`)
