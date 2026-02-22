import type { Numeric } from '@/types/common'
import { createMessageSegment } from '@/utils'

export function text(str: string) {
  return createMessageSegment('text', { text: str })
}

export function at(userId: Numeric | 'all', name?: string) {
  return createMessageSegment('at', { qq: userId.toString(), name })
}

export function reply(messageId: Numeric) {
  return createMessageSegment('reply', { id: messageId.toString() })
}

export function face(id: Numeric) {
  return createMessageSegment('face', { id: id.toString() })
}

export function mface(emojiId: Numeric, emojiPackageId: Numeric, key: string, summary?: string) {
  return createMessageSegment('mface', { emoji_id: emojiId.toString(), emoji_package_id: emojiPackageId.toString(), key, summary })
}

export function dice() {
  return createMessageSegment('dice', {})
}

export function rps() {
  return createMessageSegment('rps', {})
}

export function poke(type: string, id: string) {
  return createMessageSegment('poke', { type, id })
}

export function image(file: string, name?: string, summary?: string, subType?: number) {
  return createMessageSegment('image', { file, name, summary, sub_type: subType })
}

export function record(file: string, name?: string) {
  return createMessageSegment('record', { file, name })
}

export function video(file: string, name?: string, thumb?: string) {
  return createMessageSegment('video', { file, name, thumb })
}

export function file(file: string, name?: string) {
  return createMessageSegment('file', { file, name })
}

export function json(data: string | object) {
  return createMessageSegment('json', { data })
}

export function music(type: 'qq' | '163' | 'kugou' | 'kuwo' | 'migu' | 'custom', id?: string, url?: string, audio?: string, title?: string, image?: string, singer?: string) {
  return createMessageSegment('music', { type, id, url, audio, title, image, singer })
}

export function contact(type: 'qq' | 'group', id: string) {
  return createMessageSegment('contact', { type, id })
}

export function markdown(content: string) {
  return createMessageSegment('markdown', { content })
}

export function miniapp(data: string) {
  return createMessageSegment('miniapp', { data })
}

export function location(lat: string | number, lon: string | number, title?: string, content?: string) {
  return createMessageSegment('location', { lat, lon, title, content })
}

export function xml(data: string) {
  return createMessageSegment('xml', { data })
}

export function onlinefile(msgId: string, elementId: string, fileName: string, fileSize: string, isDir: boolean) {
  return createMessageSegment('onlinefile', { msgId, elementId, fileName, fileSize, isDir })
}

export function flashtransfer(fileSetId: string) {
  return createMessageSegment('flashtransfer', { fileSetId })
}
