export interface TransportEventHandlers {
  message: (data: any) => void
  open: () => void
  error: (error: any) => void
  close: () => void
}

export type ReadyState = (typeof ReadyStates)[keyof typeof ReadyStates]

export const ReadyStates = {
  PENDING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const

export interface TransportCommon {
  readonly readyState: ReadyState
  send: (data: string | ArrayBuffer) => void
  close: () => void
}

export interface Transport extends TransportCommon {
  addEventListener: ((
    type: 'message',
    listener: (event: { data: any }) => void,
  ) => void) & ((
    type: 'open',
    listener: () => void,
  ) => void) & ((
    type: 'error',
    listener: (error: any) => void,
  ) => void) & ((
    type: 'close',
    listener: () => void,
  ) => void)
  removeEventListener: (type: string, listener: (...args: any[]) => any) => void
}
