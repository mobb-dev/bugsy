import Debug from 'debug'
import fetch, { File, fileFrom, FormData } from 'node-fetch'

import { getProxyAgent } from './graphql/gql'

const debug = Debug('mobbdev:upload-file')

export async function uploadFile({
  file,
  url,
  uploadKey,
  uploadFields,
  logger,
}: {
  file: string | Buffer
  url: string
  uploadKey: string
  uploadFields: Record<string, string>
  logger?: (message: string, data?: unknown) => void
}) {
  const logInfo =
    logger ||
    ((_message: string, _data?: unknown) => {
      /*noop*/
    })

  logInfo(`FileUpload: upload file start ${url}`)
  logInfo(`FileUpload: upload fields`, uploadFields)
  logInfo(`FileUpload: upload key ${uploadKey}`)

  debug('upload file start %s', url)
  debug('upload fields %o', uploadFields)
  debug('upload key %s', uploadKey)
  const form = new FormData()
  Object.entries(uploadFields).forEach(([key, value]) => {
    form.append(key, value)
  })

  //minio needs to add the key specifically here and it is not included in the uploadFields as it is for AWS
  if (!form.has('key')) {
    form.append('key', uploadKey)
  }
  if (typeof file === 'string') {
    debug('upload file from path %s', file)
    logInfo(`FileUpload: upload file from path ${file}`)

    form.append('file', await fileFrom(file))
  } else {
    debug('upload file from buffer')
    logInfo(`FileUpload: upload file from buffer`)
    form.append('file', new File([new Uint8Array(file)], 'file'))
  }
  const agent = getProxyAgent(url)
  const response = await fetch(url, {
    method: 'POST',
    body: form,
    agent,
  })

  if (!response.ok) {
    debug('error from S3 %s %s', response.body, response.status)
    logInfo(`FileUpload: error from S3 ${response.body} ${response.status}`)
    throw new Error(`Failed to upload the file: ${response.status}`)
  }
  debug('upload file done')
  logInfo(`FileUpload: upload file done`)
}
