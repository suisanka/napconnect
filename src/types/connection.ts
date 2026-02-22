import type { MaybePromiseLike } from '@/types/common'
import type { ProtocolEvent } from '@/types/event'
import type { ProtocolReadableStream, ProtocolReply, ProtocolRequest, ProtocolStreamCompleteMessage } from '@/types/protocol'
import type { PubSubOff } from '@/types/pubsub'
import type { Transport } from '@/types/transport'

export interface ConnectionBasicPubSubHandlers {
  'connection.connected': [transport: Transport, connection: Connection]
  'connection.disconnected': [transport: Transport, connection: Connection]
  'connection.reconnect': [transport: Transport, connection: Connection]
  'connection.request': [event: ProtocolRequest, connection: Connection]
  'connection.reply': [event: ProtocolReply, connection: Connection]
  'protocol.event': [event: ProtocolEvent, connection: Connection]
  'connection.error': [error: any, connection: Connection]
  'connection.reply.stream': [data: ProtocolReply, connection: Connection]
  [x: string]: any[]
}

export type ProtocolEventHandler = (event: ProtocolEvent, connection: Connection) => void
export type ConnectionPubSub = PubSubOff<ConnectionBasicPubSubHandlers>
export type ConnectionStreamResult<R = any> = [stream: ProtocolReadableStream, result: Promise<ProtocolStreamCompleteMessage<R>>]

export interface Connection extends ConnectionPubSub, Disposable {
  readonly transport: Transport
  connect: () => Promise<void>
  close: () => void
  request: (<const P, const R = any>(method: string, args: P, stream?: false) => Promise<R>)
    & (<const P, const R = any>(method: string, args: P, stream: true) => Promise<ConnectionStreamResult<R>>)
}

export type TransportFactory = (token?: string) => MaybePromiseLike<Transport>

export interface OpenConnectionOptions {
  transport: TransportFactory
  token?: string
  timeout?: number
  reconnect?: false | {
    interval: number
    attempts: 'always' | number
  }
}

export type OpenConnection = ((options: OpenConnectionOptions) => Connection)
  & ((transport: TransportFactory, token?: string) => Connection)
