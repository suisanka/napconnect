import type { ProtocolMessageSegment, ProtocolMessageSendSegment } from '@/types/message'

export function isMessageSegment<const T extends ProtocolMessageSendSegment['type'], R extends Extract<ProtocolMessageSegment, { type: T }>>(type: T, value: any): value is R
export function isMessageSegment(type: null, value: any): value is ProtocolMessageSegment
export function isMessageSegment(type: any, value: any): boolean {
  return value != null && typeof value === 'object' && typeof value.type === 'string' && (type ? value.type === type : true)
}

// helper function to create a send segment
export function createMessageSegment<const T extends ProtocolMessageSendSegment['type'], R extends Extract<ProtocolMessageSendSegment, { type: T }>>(
  type: T,
  data: R['data'],
): R {
  return { type, data } as R
}

export function findMessageSegment<const T extends ProtocolMessageSendSegment['type'], R extends Extract<ProtocolMessageSegment, { type: T }>>(type: T, message?: ProtocolMessageSegment[] | string, cond?: (segment: R) => boolean): R | undefined {
  return message && Array.isArray(message)
    ? message.find(segment => isMessageSegment(type, segment) && cond != null && cond(segment as R)) as R | undefined
    : undefined
}
