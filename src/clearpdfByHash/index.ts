import path from "path"
import crypto from "crypto"
import fs from "fs"
import * as glob from "glob"
// import lodash from "lodash"
import pdf2text from "../pdf2text"

export default async (dirPath: string) => {
  process.env.NODE_GLOB_WINDOWS_PATHS_NO_ESCAPE = "true"

  const pdfFilePaths = glob
    .sync(path.join(dirPath, "*.pdf"))
    .sort((a, b) => a.length - b.length)

  // console.log("AT-[ pdfFilePaths &&&&&********** ]", pdfFilePaths)

  const result: { pdfFilePath: string; hash: string }[] = []

  for (const pdfFilePath of pdfFilePaths) {
    let hash = ""

    try {
      const text = await pdf2text(pdfFilePath)

      hash = crypto.createHash("md5").update(text.slice(0, 150)).digest("hex")
    } catch (error) {
      console.log("AT-[ error &&&&&********** ]", error)
      // fs.rmSync(pdfFilePath)
    } finally {
      result.push({ pdfFilePath, hash })
    }
  }

  // const result = await Promise.all(
  //   pdfFilePaths.map((pdfFilePath) =>
  //     pdf2text(pdfFilePath)
  //       .then((text) => ({
  //         pdfFilePath,
  //         hash: crypto
  //           .createHash("md5")
  //           .update(text.slice(0, 150))
  //           .digest("hex"),
  //       }))
  //       .catch(() => ({ pdfFilePath, hash: "" })),
  //   ),
  // )

  result
    .filter((i) => i.hash)
    .reduce((pre, cur) => {
      pre.includes(cur.hash) ? fs.rmSync(cur.pdfFilePath) : pre.push(cur.hash)
      return pre
    }, [] as string[])
}
