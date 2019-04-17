
const path      = require('path')
// const readline  = require('readline')
const fs        = require('fs')
const program   = require('commander')
const inquirer  = require('inquirer')
const execa     = require('execa')
const rm        = require('rimraf').sync

const readFile  = require('../src/readFile')

const CURRENT_PATH = process.cwd()
const year = (new Date()).getFullYear() + ''
const template = program.template
const defaultTemplateURL = 'ssh://git@git-cc.nie.netease.com:32200/gzchenyetao/template.git'
const defaultRouterTemplateURL = 'ssh://git@git-cc.nie.netease.com:32200/gzchenyetao/template_router.git'


let questionList = [
    {
        type: 'input',
        name: 'projectName',
        message: 'project name:',
      },
      {
          type: 'list',
          name: 'platform',
          message: 'platform:',
          choices: ['m', 'pc']
      },
      {
          type: 'list',
          name: 'type',
          message: 'type:',
          choices: [year, 'daily']
      }
]

if (program.rawArgs[3] === '-h' || program.rawArgs[3] === '--help') {
    program.outputHelp()
    process.exit(0)
}

if (!template) {
    questionList.push(
        {
            type: 'confirm',
            name: 'needRouter',
            message: 'need router:',
            default: false,
        }
    )
}

inquirer.prompt(questionList)
    .then((answers) => {
        handleUserAnswer(answers)
    })

function handleTemplate(template, needRouter) {
    if (!template) {
        if (needRouter) return defaultRouterTemplateURL
        return defaultTemplateURL
    }

    return template
}

async function handleUserAnswer(answers) {
    const url = handleTemplate(template, answers.needRouter)
    const aimsPath = path.resolve(CURRENT_PATH, answers.projectName)

    if (fs.existsSync(aimsPath)) {
        throw new Error('当前目录下存在该项目')
    }

    await execa('git', ['clone', url, answers.projectName])
    // await execa('cd', [answers.projectName])
    // await execa('cd', ['..'])
    if (!template) await changePackageFile(path.resolve(aimsPath, 'package.json'), answers)
    rm(`${answers.projectName}/.git`)
    console.log(`cd ${answers.projectName} & npm install`)
    process.exit(0)
}

async function changePackageFile(path, answers) {
    let content = await readFile(path)
    const promise = new Promise((resolve, reject) => {

        content = content.replace('${template}', answers.projectName)
                        .replace('${platform}', answers.platform)
                        .replace('${type}', answers.type)

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