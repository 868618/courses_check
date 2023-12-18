import os from 'os'
import path from 'path'
import * as glob from 'glob'
import fs from 'fs-extra'
import lodash from 'lodash'

import fire from './fire'
import word2pdf from './word2pdf'
import autorename from './autorename'

const targetPath = path.join(os.homedir(), 'Desktop', 'target')

const checkedPath = path.join(os.homedir(), 'Desktop', 'checked')

const options = { windowsPathsNoEscape: true }

fs.ensureDirSync(checkedPath)

const instance = fire({
  maxEngines: os.cpus().length,

  mode: 'single',

  async data() {
    const list = glob.sync(path.join(targetPath, '*/'), options)

    return lodash.chunk(list, 100)
  },

  tasks: [
    async (dirs) => {
      for (const dir of <string[]>dirs) {
        const files = glob.sync(path.join(dir, '*'), {
          ...options,
          ignore: {
            ignored: (p) => p.name.endsWith('.png') && p.name.length == 27,
          },
        })

        const docs = files.filter((f) => /docx?$/gi.test(f))

        const willCopyFiles = lodash.difference(files, docs)

        for (const file of willCopyFiles) {
          const targetFilePath = file.replace(targetPath, checkedPath)

          fs.copySync(file, targetFilePath, { overwrite: true })
        }

        for (const docFile of docs) {
          const tempPdfFilePath = await word2pdf(docFile)

          const targetPdfFilePath = autorename(docFile, 'pdf')

          const targetFilePath = targetPdfFilePath.replace(
            targetPath,
            checkedPath,
          )

          fs.moveSync(tempPdfFilePath, targetFilePath)

          fs.rmdirSync(path.dirname(tempPdfFilePath))
        }
      }
    },
  ],
})

instance.go()
