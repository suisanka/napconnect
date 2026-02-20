import type { Dispose } from '@/types'
import type { Transport, TransportEventHandlers } from '@/types/transport'

export function registerTransportEventHandlers(
  transport: Transport,
  handlers: TransportEventHandlers,
): Dispose {
  const on = transport.on ?? transport.addEventListener as any
  const off = transport.off ?? transport.removeEventListener as any

  for (const type in handlers) {
    on(type as any, (handlers as any)[type])
  }

  return () => {
    for (const type in handlers) {
      off(type, (handlers as any)[type])
    }
  }
}
