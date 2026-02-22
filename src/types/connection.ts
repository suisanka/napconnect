import type { MaybePromiseLike } from '@/types/common'
import type { ProtocolEvent } from '@/types/event'
import type { ProtocolReadableStream, ProtocolReply, ProtocolRequest, ProtocolStreamCompleteMessage } from '@/types/protocol'
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
  'connection.reply.stream': [data: ProtocolReply, connection: Connection]
}

export type ConnectionEventHandlers = Omit<ConnectionBasicEventHandlers, never>

export type ConnectionPubSub = PubSubOff<ConnectionEventHandlers>

export type ConnectionStreamResult<R = any> = [stream: ProtocolReadableStream, result: Promise<ProtocolStreamCompleteMessage<R>>]

export interface Connection extends ConnectionPubSub {
  readonly transport: Transport
  connect: () => Promise<void>
  close: () => void
  request: (<const P, const R = any>(method: string, args: P, stream?: false) => Promise<R>)
    & (<const P, const R = any>(method: string, args: P, stream: true) => Promise<ConnectionStreamResult<R>>)
}

export interface OpenConnectionOptions {
  transport: (token: string) => MaybePromiseLike<Transport>
  token?: string
  timeout?: number
  reconnect: false | {
    interval: number
    attempts: 'always' | number
  }
}

export type OpenConnection = (options: OpenConnectionOptions) => Connection
