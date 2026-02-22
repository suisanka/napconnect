import type { ConnectionBasicPubSubHandlers, ConnectionEventHandler, ProtocolEventHandlers } from '@/types'

export type ConnectionOrProtocolEventHandlers = ConnectionBasicPubSubHandlers & ProtocolEventHandlers & {}

export function defineHandler<const K extends keyof ConnectionOrProtocolEventHandlers>(
  type: K,
  handler: (...args: ConnectionOrProtocolEventHandlers[K]) => void,
): (...args: ConnectionOrProtocolEventHandlers[K]) => void {
  return handler
}

const cachedMatchers = new Map<string, (event: any) => boolean>()

function createMatcher(type: keyof ProtocolEventHandlers): (event: any) => boolean {
  if (cachedMatchers.has(type)) {
    return cachedMatchers.get(type)!
  }

  if (type === 'message.sent') {
    const matcher = (event: any) => event.post_type === 'message_sent'
    cachedMatchers.set(type, matcher)
    return matcher
  }

  let [typeA, typeB, typeC, typeD] = type.split('.')
  if (typeA === 'meta') {
    typeA = 'meta_event'
  }
  if (typeA === 'notice') {
    if (typeB === 'group') {
      if (typeC === 'reaction') {
        typeB = 'group_msg_emoji_like'
        typeC = undefined
      }
      else if (typeC === 'essence') {
        typeB = 'essence'
        typeC = typeD
      }
      else if (typeC) {
        typeB = `group_${typeC}`
        typeC = typeD
      }
      else {
        typeB = 'group_'
      }
    }
    else if (typeB === 'friend' || typeB === 'bot') {
      if (typeC) {
        typeB = `${typeB}_${typeC}`
        typeC = undefined
      }
      else {
        typeB = `${typeB}_`
      }
    }
    else if (typeB === 'notify') {
      if (typeC === 'group_name' || typeC === 'group_title') {
        // no change needed as typeC already matches the subtype
      }
    }
  }

  const matcher = (event: any) => {
    if (event.post_type !== typeA)
      return false

    if (typeB) {
      const actualTypeB = event[`${typeA!}_type`]!

      if (typeB.endsWith('_')) {
        if (!actualTypeB?.startsWith(typeB)) {
          // Special case for notice.group matching essence events
          if (typeB === 'group_' && actualTypeB === 'essence') {
            // allow
          }
          else {
            return false
          }
        }
      }
      else {
        if (actualTypeB !== typeB) {
          return false
        }
      }
    }

    if (typeC) {
      if (event.sub_type !== typeC) {
        return false
      }
    }

    return true
  }

  cachedMatchers.set(type, matcher)
  return matcher
}

export function matchEvent<const K extends keyof ProtocolEventHandlers>(
  type: K,
  handler: (...args: ProtocolEventHandlers[K]) => void,
): ConnectionEventHandler {
  const matcher = createMatcher(type)
  return defineHandler('connection.event', (event: any, connection) => {
    if (matcher(event)) {
      (handler as any)(event, connection)
    }
  })
}

export { matchEvent as when }

export interface EventMatcher<
  K extends keyof ProtocolEventHandlers,
> {
  (event: any): event is ProtocolEventHandlers[K]
}

export function createEventMatcher<const K extends keyof ProtocolEventHandlers>(
  type: K,
): EventMatcher<K> {
  return createMatcher(type) as EventMatcher<K>
}

export function composeEvent(...handlers: ConnectionEventHandler[]): ConnectionEventHandler {
  const p = Promise.resolve()
  return (event, connection) => {
    for (const handler of handlers) {
      p.then(() => handler(event, connection))
    }
  }
}
