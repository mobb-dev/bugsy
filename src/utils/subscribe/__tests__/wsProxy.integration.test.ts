/**
 * Integration test: verifies that createWSClient can tunnel WebSocket
 * connections through an HTTP CONNECT proxy.
 *
 * All infrastructure is in-process — no external services required.
 */
import http from 'node:http'
import net from 'node:net'

import { HttpsProxyAgent } from 'https-proxy-agent'
import { describe, expect, it } from 'vitest'
import { WebSocketServer } from 'ws'

import { createWSClient } from '../subscribe'

function listenEphemeral(
  server: http.Server | net.Server
): Promise<{ port: number; close: () => Promise<void> }> {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as net.AddressInfo
      resolve({
        port: addr.port,
        close: () => new Promise<void>((r) => server.close(() => r())),
      })
    })
  })
}

describe('WebSocket proxy integration', () => {
  it('tunnels a WebSocket connection through a CONNECT proxy', async () => {
    // ---- 1. Start a target WebSocket server ----
    const wss = new WebSocketServer({ port: 0, host: '127.0.0.1' })
    const wsPort = await new Promise<number>((resolve) => {
      wss.on('listening', () => {
        resolve((wss.address() as net.AddressInfo).port)
      })
    })

    // Echo back whatever the client sends
    wss.on('connection', (ws) => {
      ws.on('message', (msg) => ws.send(msg))
    })

    // ---- 2. Start a CONNECT tunneling proxy ----
    let connectHandlerFired = false
    const proxyServer = http.createServer((_req, res) => {
      // We only handle CONNECT, reject normal requests
      res.writeHead(405)
      res.end()
    })

    proxyServer.on('connect', (req, clientSocket, head) => {
      connectHandlerFired = true
      const [hostname, port] = req.url!.split(':')

      const targetSocket = net.connect(
        { host: hostname, port: Number(port) },
        () => {
          clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n')
          targetSocket.write(head)
          targetSocket.pipe(clientSocket)
          clientSocket.pipe(targetSocket)
        }
      )

      targetSocket.on('error', () => clientSocket.destroy())
      clientSocket.on('error', () => targetSocket.destroy())
    })

    const proxy = await listenEphemeral(proxyServer)

    try {
      // ---- 3. Create a WSClient that routes through the proxy ----
      const agent = new HttpsProxyAgent(`http://127.0.0.1:${proxy.port}`)

      const client = createWSClient({
        apiKey: 'test-key',
        type: 'apiKey',
        url: `ws://127.0.0.1:${wsPort}`,
        proxyAgent: agent,
      })

      // ---- 4. Verify the CONNECT tunnel is used ----
      // We can't easily do a full graphql-ws handshake without a real
      // GraphQL server, but we can verify the proxy's CONNECT handler
      // fires by attempting a connection.
      //
      // graphql-ws will try to open a WebSocket and do the graphql
      // subprotocol handshake. The WS server won't speak graphql-ws,
      // so the client will error, but the CONNECT tunnel should have
      // been established.
      const connectionAttempt = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Timed out waiting for connection')),
          5000
        )

        client.subscribe(
          { query: '{ __typename }' },
          {
            next: () => {
              // unexpected success
            },
            error: () => {
              clearTimeout(timeout)
              // Expected: graphql-ws handshake failure since the WS
              // server doesn't speak the graphql-transport-ws subprotocol
              resolve()
            },
            complete: () => {
              clearTimeout(timeout)
              resolve()
            },
          }
        )
      })

      await connectionAttempt

      // The critical assertion: the CONNECT handler must have fired,
      // proving the proxy agent was actually used for tunneling
      expect(connectHandlerFired).toBe(true)
    } finally {
      // ---- Cleanup ----
      await proxy.close()
      await new Promise<void>((resolve) => wss.close(() => resolve()))
    }
  })
})
