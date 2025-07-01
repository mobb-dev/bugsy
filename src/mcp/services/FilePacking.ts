import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - istextorbinary module doesn't have proper TypeScript declarations
import { FileUtils } from '../../features/analysis/scm/FileUtils'
import { MCP_MAX_FILE_SIZE } from '../core/configs'
import { logInfo } from '../Logger'

export class FilePacking {
  public async packFiles(
    sourceDirectoryPath: string,
    filesToPack: string[]
  ): Promise<Buffer> {
    logInfo(`FilePacking: packing files from ${sourceDirectoryPath}`)

    const zip = new AdmZip()
    let packedFilesCount = 0

    logInfo('FilePacking: compressing files')
    for (const filepath of filesToPack) {
      const absoluteFilepath = path.join(sourceDirectoryPath, filepath)

      // Use FileUtils to check if file should be packed
      if (!FileUtils.shouldPackFile(absoluteFilepath, MCP_MAX_FILE_SIZE)) {
        logInfo(
          `FilePacking: ignoring ${filepath} because it is excluded or invalid`
        )
        continue
      }

      let data: Buffer
      try {
        data = fs.readFileSync(absoluteFilepath)
      } catch (fsError) {
        logInfo(
          `FilePacking: failed to read ${filepath} from filesystem: ${fsError}`
        )
        continue
      }

      zip.addFile(filepath, data)
      packedFilesCount++
    }

    const zipBuffer = zip.toBuffer()
    logInfo(
      `FilePacking: read ${packedFilesCount} source files. total size: ${zipBuffer.length} bytes`
    )
    logInfo('FilePacking: Files packed successfully')
    return zipBuffer
  }
}
