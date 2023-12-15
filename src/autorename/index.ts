import path from "path"
import fs from "fs-extra"

export default (
  filePath: string,
  extName: string,
  targetPath?: string,
): string => {
  const { dir, name } = path.parse(filePath)

  const targetDirPath = targetPath
    ? path.isAbsolute(targetPath)
      ? targetPath
      : path.join(__dirname, targetPath)
    : dir

  let targetFilePath = path.join(
    targetDirPath,
    name.replace(/(\(|（)\d+(\)|）)$/, "") + `.${extName}`,
  )

  if (fs.existsSync(targetFilePath)) {
    let count = 1

    let newFileName =
      name.replace(/(\(|（)\d+(\)|）)$/, "") + `(${count})` + `.${extName}`

    targetFilePath = path.join(targetDirPath, newFileName)

    while (fs.existsSync(targetFilePath)) {
      count++
      newFileName =
        name.replace(/(\(|（)\d+(\)|）)$/, "") + `(${count})` + `.${extName}`
      targetFilePath = path.join(targetDirPath, newFileName)
    }
  }

  return targetFilePath
}
