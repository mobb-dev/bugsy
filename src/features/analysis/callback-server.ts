import * as http from 'node:http'
import * as querystring from 'node:querystring'
import { clearTimeout, setTimeout } from 'node:timers'

import Debug from 'debug'
import open from 'open'
import { z } from 'zod'

const debug = Debug('mobbdev:web-login')

type CallbackResponse = { token: string }
export async function callbackServer({
  url,
  redirectUrl,
}: {
  url: string
  redirectUrl: string
}): Promise<CallbackResponse> {
  debug('web login start')

  let responseResolver: ({ token }: CallbackResponse) => void
  let responseRejecter: (value: unknown) => void
  const responseAwaiter = new Promise<CallbackResponse>((resolve, reject) => {
    responseResolver = resolve
    responseRejecter = reject
  })
  const timerHandler = setTimeout(() => {
    debug('timeout happened')
    responseRejecter(new Error('No login happened in three minutes.'))
  }, 180000)

  const server = http.createServer((req, res) => {
    debug('incoming request')
    let body = ''

    req.on('data', (chunk) => {
      debug('http server get chunk %s', chunk)
      body += chunk
    })

    req.on('end', () => {
      debug('http server end %s', body)
      res
        .writeHead(301, {
          Location: redirectUrl,
        })
        .end()
      const safeBody = z
        .object({ token: z.string() })
        .safeParse(querystring.parse(body))
      if (!safeBody.success) {
        return responseRejecter(new Error('Failed to parse the response'))
      }
      responseResolver({ token: safeBody.data.token })
    })
  })

  debug('http server starting')
  const port = await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server?.address()
      if (typeof address === 'string' || address == null) {
        reject(new Error('Failed to get port'))
      } else {
        resolve(address.port)
      }
    })
  })
  debug('http server started on port %d', port)

  debug('opening the browser on %s', `${url}?port=${port}`)
  await open(`${url}?port=${port}`)

  try {
    debug('waiting for http request')
    return await responseAwaiter
  } finally {
    debug('http server close')
    clearTimeout(timerHandler)
    server.close()
  }
}
