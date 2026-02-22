import type { ZodType } from 'zod'
import type { MaybeArray, ProtocolMessageSendSegment } from '@/types'

export interface MessageTemplateInitial<T> {
  props: ZodType<T>
  build: (props: T) => MaybeArray<ProtocolMessageSendSegment>
}

export interface AsyncMessageTemplateInitial<T> {
  props: ZodType<T>
  build: (props: T) => Promise<MaybeArray<ProtocolMessageSendSegment>>
}

export type MessageTemplate<T> = (data: T) => ProtocolMessageSendSegment[]
export type AsyncMessageTemplate<T> = (data: T) => Promise<MaybeArray<ProtocolMessageSendSegment>>

export function template<T>({ props, build }: MessageTemplateInitial<T>): MessageTemplate<T> {
  return (data: T) => {
    const parsed = props.safeParse(data)
    if (!parsed.success) {
      throw new Error(parsed.error.message)
    }
    const segments = build(parsed.data)
    return Array.isArray(segments) ? segments : [segments]
  }
}

export function asyncTemplate<T>({ props, build }: AsyncMessageTemplateInitial<T>): AsyncMessageTemplate<T> {
  return async (data: T) => {
    const parsed = await props.safeParseAsync(data)
    if (!parsed.success) {
      throw new Error(parsed.error.message)
    }
    const segments = await build(parsed.data)
    return Array.isArray(segments) ? segments : [segments]
  }
}
