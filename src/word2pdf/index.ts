import libre from 'libreoffice-convert'
import os from 'os'
import path from 'path'
import fs from 'fs-extra'

export default (wordFilePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wordtopdf'))

    const { name } = path.parse(wordFilePath)

    const targetExtName = '.pdf'

    const targetFilePath = path.join(tempDir, name + targetExtName)

    const docxBuf = fs.readFileSync(wordFilePath)

    libre.convert(docxBuf, '.pdf', undefined, (err, data) => {
      if (err) {
        reject(err)
      } else {
        fs.writeFileSync(targetFilePath, data)
        resolve(targetFilePath)
      }
    })
  })
}
