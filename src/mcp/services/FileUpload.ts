import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { logInfo } from '../Logger'

export type UploadOptions = {
  file: string | Buffer
  url: string
  uploadKey: string
  uploadFields: Record<string, string>
}

export class FileUpload {
  private getProxyAgent(url: string) {
    const HTTPS_PROXY = process.env['HTTPS_PROXY']
    const HTTP_PROXY = process.env['HTTP_PROXY']

    try {
      const parsedUrl = new URL(url)

      const isHttp = parsedUrl.protocol === 'http:'
      const isHttps = parsedUrl.protocol === 'https:'

      const proxy = isHttps ? HTTPS_PROXY : isHttp ? HTTP_PROXY : null

      if (proxy) {
        logInfo(`FileUpload: Using proxy ${proxy}`)
        return isHttps ? new HttpsProxyAgent(proxy) : new HttpProxyAgent(proxy)
      }
    } catch (err) {
      logInfo(
        `FileUpload: Skipping proxy for ${url}. Reason: ${(err as Error).message}`
      )
    }
    return undefined
  }

  public async uploadFile(options: UploadOptions): Promise<void> {
    const { file, url, uploadKey, uploadFields } = options

    logInfo(`FileUpload: upload file start ${url}`)
    logInfo(`FileUpload: upload fields`, uploadFields)
    logInfo(`FileUpload: upload key ${uploadKey}`)

    // Dynamically import node-fetch to support ESM-only module
    const {
      default: fetch,
      File,
      fileFrom,
      FormData,
    } = await import('node-fetch')

    const form = new FormData()
    Object.entries(uploadFields).forEach(([key, value]) => {
      form.append(key, value)
    })

    // MinIO needs to add the key specifically here and it is not included in the uploadFields as it is for AWS
    if (!form.has('key')) {
      form.append('key', uploadKey)
    }

    if (typeof file === 'string') {
      logInfo(`FileUpload: upload file from path ${file}`)
      form.append('file', await fileFrom(file))
    } else {
      logInfo(`FileUpload: upload file from buffer`)
      form.append('file', new File([file], 'file'))
    }

    const agent = this.getProxyAgent(url)
    const response = await fetch(url, {
      method: 'POST',
      body: form,
      agent,
    })

    if (!response.ok) {
      logInfo(`FileUpload: error from S3 ${response.body} ${response.status}`)
      throw new Error(`Failed to upload the file: ${response.status}`)
    }

    logInfo(`FileUpload: upload file done`)
  }
}
