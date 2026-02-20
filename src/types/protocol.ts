export interface ProtocolRequest<T = any> {
  action: string
  params: T
  echo?: string
}

export interface ProtocolReply<T = any> {
  status: 'ok' | 'failed'
  retcode: number
  data: T
  echo?: string
}
