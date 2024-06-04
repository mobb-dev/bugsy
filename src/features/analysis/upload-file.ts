import Debug from 'debug'
import fetch, { File, fileFrom, FormData } from 'node-fetch'

const debug = Debug('mobbdev:upload-file')

export async function uploadFile({
  file,
  url,
  uploadKey,
  uploadFields,
}: {
  file: string | Buffer
  url: string
  uploadKey: string
  uploadFields: Record<string, string>
}) {
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
    form.append('file', await fileFrom(file))
  } else {
    debug('upload file from buffer')
    form.append('file', new File([file], 'file'))
  }
  const response = await fetch(url, {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    debug('error from S3 %s %s', response.body, response.status)
    throw new Error(`Failed to upload the file: ${response.status}`)
  }
  debug('upload file done')
}
