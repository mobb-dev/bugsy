import path from 'node:path'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

import { getModuleRootDir } from '../../utils'
import type { LanguageServerServiceClient } from './proto/exa/language_server_pb/LanguageServerService'
import type { ProtoGrpcType } from './proto/language_server'

const PROTO_PATH = path.join(
  getModuleRootDir(),
  'src/features/codeium_intellij/proto/exa/language_server_pb/language_server.proto'
)

function loadProto(): ProtoGrpcType {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [
      path.join(getModuleRootDir(), 'src/features/codeium_intellij/proto'),
    ],
  })
  return grpc.loadPackageDefinition(
    packageDefinition
  ) as unknown as ProtoGrpcType
}

const PROTO = loadProto()

function createCsrfInterceptor(csrfToken: string): grpc.Interceptor {
  return (options, nextCall) => {
    return new grpc.InterceptingCall(nextCall(options), {
      start(metadata, listener, next) {
        metadata.set('x-codeium-csrf-token', csrfToken)
        next(metadata, listener)
      },
    })
  }
}

export type PromisifiedClient<T> = {
  [K in keyof T]: T[K] extends (
    req: infer Req,
    cb: (err: Error | null, res?: infer Res) => void
  ) => void
    ? (req: Req) => Promise<Res>
    : T[K]
}

function promisifyClient<T extends object>(client: T): PromisifiedClient<T> {
  return new Proxy(client, {
    get(target, prop) {
      const method = target[prop as keyof T]
      if (typeof method === 'function') {
        return (request: unknown) =>
          new Promise((resolve, reject) => {
            const grpcMethod = method as (
              req: unknown,
              cb: (err: Error | null, res: unknown) => void
            ) => void
            grpcMethod.call(target, request, (err, res) => {
              if (err) reject(err)
              else if (res) resolve(res)
              else reject(new Error('No response'))
            })
          })
      }
      return method
    },
  }) as PromisifiedClient<T>
}

export async function getGrpcClient(port: number, csrf: string) {
  const client = promisifyClient(
    new PROTO.exa.language_server_pb.LanguageServerService(
      `localhost:${port}`,
      grpc.credentials.createInsecure(),
      { interceptors: [createCsrfInterceptor(csrf)] }
    ) as LanguageServerServiceClient
  )

  try {
    // The first call just ot verify the client is alive.
    await client.GetAllCascadeTrajectories({})
  } catch (e) {
    console.log(e)
    return null
  }

  return client
}
