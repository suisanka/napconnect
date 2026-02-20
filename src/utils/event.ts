import type { ConnectionEventHandlers } from '@/types'

export function defineHandler<const K extends keyof ConnectionEventHandlers>(
  type: K,
  handler: (...args: ConnectionEventHandlers[K]) => void,
): (...args: ConnectionEventHandlers[K]) => void {
  return handler
}
