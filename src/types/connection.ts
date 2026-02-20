import type { MaybePromiseLike } from '@/types/common'
import type { ProtocolEvent, ProtocolEventNamePaths, ProtocolEventNames } from '@/types/event'
import type { ProtocolReply, ProtocolRequest } from '@/types/protocol'
import type { PubSubOff } from '@/types/pubsub'
import type { Transport } from '@/types/transport'

export interface ConnectionBasicEventHandlers {
  'connection.connected': (connection: Connection) => void
  'connection.disconnected': (connection: Connection) => void
  'connection.reconnect': (transport: Transport, connection: Connection) => void
  'connection.request': (event: ProtocolRequest, connection: Connection) => void
  'connection.reply': (event: ProtocolReply, connection: Connection) => void
  'connection.event': (event: ProtocolEvent, connection: Connection) => void
  'connection.error': (error: any, connection: Connection) => void
}

type _GetProtocolEventByName<K extends string, T extends Record<string | number, any>>
  = K extends `${infer O}.${infer R}`
    ? _GetProtocolEventByName<R, T[O]>
    : K extends keyof T
      ? T[K] extends Record<'_', any>
        ? T[K]['_']
        : T[K]
      : never

export type ProtocolEventHandlers = {
  [T in ProtocolEventNames]: (event: _GetProtocolEventByName<T, ProtocolEventNamePaths>, connection: Connection) => void
}

export type ConnectionEventHandlers = ConnectionBasicEventHandlers & ProtocolEventHandlers

export type ConnectionPubSub = PubSubOff<ConnectionEventHandlers>

export interface Connection extends ConnectionPubSub {
  readonly transport: Transport
  connect: () => Promise<void>
  request: <const P, const R = any>(method: string, args?: P) => Promise<R>
}

export interface CreateConnectionOptions {
  transport: () => MaybePromiseLike<Transport>
  token: string
  reconnect: false | {
    interval: number
    attempts: 'always' | number
  }
}

export type CreateConnection = (options: CreateConnectionOptions) => Connection
