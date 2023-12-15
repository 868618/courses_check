import fs from "fs-extra"
import * as glob from "glob"
import path from "path"
import os from "os"
import lodash from "lodash"

import clearpdfByHash from "./clearpdfByHash"
import fire from "./fire"
import autorename from "./autorename"
import word2pdf from "./word2pdf"

process.env.NODE_GLOB_WINDOWS_PATHS_NO_ESCAPE = "true"

const instance = fire({
  maxEngines: 8,

  mode: "single",

  async data() {
    const desktopPath = path.join(os.homedir(), "Desktop")

    const basePath = path.join(desktopPath, "uuu")

    const list = glob.sync(path.join(basePath, "*/"))
    return lodash.chunk(list, 100)
  },

  tasks: [
    async (data) => {
      for (const dirPath of data as string[]) {
        const docFiles = glob.sync(path.join(dirPath, "*.{doc,docx}"))

        for (const docFile of docFiles) {
          const tempPdfFilePath = await word2pdf(docFile)

          const targetPdfFilePath = autorename(docFile, "pdf")

          fs.moveSync(tempPdfFilePath, targetPdfFilePath)

          fs.rmdirSync(path.dirname(tempPdfFilePath))

          fs.rmSync(docFile)
        }

        await clearpdfByHash(dirPath)
      }

      return data
    },
  ],

  monitor: {
    async letter(worker) {
      console.log("AT-[ worker &&&&&********** ]", worker?.id)
    },
  },
})

instance.go()
