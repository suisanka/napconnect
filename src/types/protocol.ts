export interface ProtocolRequest<T = any> {
  action: string
  params: T
  echo?: string
  stream?: 'normal-action' | 'stream-action'
}

export interface ProtocolStreamDataMessage {
  type: 'stream'
  data_type: 'data_chunk'
  data: string
}

export interface ProtocolStreamCompleteMessage<T> {
  type: 'response'
  data_type: 'data_complete'
  data: T
}

export interface ProtocolStreamErrorMessage {
  type: 'error'
  data_type: 'error'
}

export type ProtocolStreamMessage<T = any>
  = | ProtocolStreamDataMessage
    | ProtocolStreamCompleteMessage<T>
    | ProtocolStreamErrorMessage

export type ProtocolReplyStream<T = any>
  = ProtocolReply<ProtocolStreamMessage<T>>

export type ProtocolReplyStreamResponse<T = any>
  = ProtocolReplyOk<ProtocolStreamCompleteMessage<T>>

export type ProtocolReadableStream = ReadableStream<ProtocolStreamDataMessage>

export interface ProtocolReplyOk<T = any> {
  status: 'ok'
  retcode: number
  data: T
  echo?: string
  message: string
  wording: string
  stream: 'normal-action' | 'stream-action'
}

export interface ProtocolReplyFailed {
  status: 'failed'
  retcode: number
  data?: null
  message: string
  wording: string
  echo?: string
  stream: 'normal-action' | 'stream-action'
}

export type ProtocolReply<T = any> = ProtocolReplyOk<T> | ProtocolReplyFailed
