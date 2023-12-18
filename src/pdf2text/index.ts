// import PDFParser from "pdf2json"
import { exec } from 'child_process'

export default async (pdfFilePath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const command = `pdftotext -f 1 -l 1 "${pdfFilePath}" -`

    exec(command, (error, stdout, stderr) => {
      error
        ? reject({ error, stderr })
        : resolve(stdout.trim().replace(/\s/gi, ''))
    })
  })
