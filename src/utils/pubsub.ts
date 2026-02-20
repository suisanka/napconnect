import type { PubSubOff } from '@/types/pubsub'

export class PubSubImpl<T extends Record<string, any> = Record<string, any>> implements PubSubOff<T> {
  private readonly listeners = new Map<keyof T, Set<(...args: any) => any>>()

  private _inner(type: keyof T, create?: boolean) {
    let listeners = this.listeners.get(type)
    if (!listeners) {
      if (!create) {
        return
      }
      listeners = new Set()
      this.listeners.set(type, listeners)
    }
    return listeners
  }

  on(type: keyof T, listener: (...args: any[]) => any, once?: boolean) {
    const inner = this._inner(type, true)!
    const fn = once
      ? (...args: any[]) => {
          inner.delete(listener)
          listener.call(this, ...args)
        }
      : listener.bind(this)

    inner.add(fn)
  }

  off(type: keyof T, listener: (...args: any[]) => any) {
    this._inner(type)?.delete(listener)
  }

  emit(type: keyof T, ...args: any[]) {
    const listeners = this._inner(type)
    const promise = Promise.resolve()
    if (listeners) {
      for (const listener of listeners) {
        promise.then(() => listener(...args))
      }
    }
  }
}
