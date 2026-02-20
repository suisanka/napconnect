export interface ProtocolRequest<T = any> {
  action: string
  params: T
  echo?: string
}

export interface ProtocolReplyOk<T = any> {
  status: 'ok'
  retcode: number
  data: T
  echo?: string
}

export interface ProtocolReplyFailed {
  status: 'failed'
  retcode: number
  data?: null
  message?: string
  echo?: string
}

export type ProtocolReply<T = any> = ProtocolReplyOk<T> | ProtocolReplyFailed
