import type { Connection, Numeric, ProtocolMessageAtSegment, ProtocolMessageEvent, ProtocolMessageSegment, ProtocolSendableMessage } from '@/types'
import { sendRequest } from '@/utils/methods'
import { findMessageSegment, isMessageSegment } from '@/utils/segment'
import { isSameNumericId, toArray } from '@/utils/value'

export function findMention(message: ProtocolMessageSegment[] | string, uid: Numeric): ProtocolMessageAtSegment | undefined {
  return findMessageSegment('at', message, segment => isSameNumericId(segment.data.qq, uid))
}

export function hasMention({ message, self_id }: ProtocolMessageEvent, uid?: Numeric): boolean {
  return findMention(message, uid ?? self_id) != null
}

export function respond(connection: Connection, event: ProtocolMessageEvent, message: ProtocolSendableMessage, quote = false) {
  return sendRequest(connection, 'send_msg', {
    message: quote ? [{ type: 'reply', data: { id: event.message_id } }, ...toArray(message)] as ProtocolSendableMessage : message,
    message_type: event.message_type,
    ...(event.message_type === 'group'
      ? { group_id: event.group_id }
      : { user_id: event.user_id }),
    auto_escape: true,
  })
}

export function extractText(message: ProtocolMessageSegment[] | string): string[]
export function extractText(message: ProtocolMessageSegment[] | string, sep: string): string
export function extractText(message: ProtocolMessageSegment[] | string, sep?: string): string[] | string {
  const content = Array.isArray(message)
    ? filterSegments('text', message).map(segment => segment.data.text)
    : [message]

  return sep
    ? content.join(sep)
    : content
}

export function filterSegments<const T extends ProtocolMessageSegment['type']>(type: T, message: ProtocolMessageSegment[] | string, cond?: (segment: Extract<ProtocolMessageSegment, { type: T }>) => boolean): Array<Extract<ProtocolMessageSegment, { type: T }>> {
  return Array.isArray(message)
    ? message.filter(segment => isMessageSegment(type, segment) && cond?.(segment as any)) as Array<Extract<ProtocolMessageSegment, { type: T }>>
    : []
}
