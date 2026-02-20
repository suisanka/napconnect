import type { MaybePromiseLike } from '@/types/common'
import type { ProtocolEvent, ProtocolEventNamePaths, ProtocolEventNames } from '@/types/event'
import type { ProtocolReply, ProtocolRequest } from '@/types/protocol'
import type { PubSubOff } from '@/types/pubsub'
import type { Transport } from '@/types/transport'

export interface ConnectionBasicEventHandlers {
  'connection.connected': [transport: Transport, connection: Connection]
  'connection.disconnected': [transport: Transport, connection: Connection]
  'connection.reconnect': [transport: Transport, connection: Connection]
  'connection.request': [event: ProtocolRequest, connection: Connection]
  'connection.reply': [event: ProtocolReply, connection: Connection]
  'connection.event': [event: ProtocolEvent, connection: Connection]
  'connection.error': [error: any, connection: Connection]
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
  [T in ProtocolEventNames]: [event: _GetProtocolEventByName<T, ProtocolEventNamePaths>, connection: Connection]
}

export type ConnectionEventHandlers = Omit<ConnectionBasicEventHandlers & ProtocolEventHandlers, never>

export type ConnectionPubSub = PubSubOff<ConnectionEventHandlers>

export interface Connection extends ConnectionPubSub {
  readonly transport: Transport
  connect: () => Promise<void>
  request: <const P, const R = any>(method: string, args?: P) => Promise<R>
}

export interface OpenConnectionOptions {
  transport: (token: string) => MaybePromiseLike<Transport>
  token: string
  timeout?: number
  reconnect: false | {
    interval: number
    attempts: 'always' | number
  }
}

export type OpenConnection = (options: OpenConnectionOptions) => Connection
