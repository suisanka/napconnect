import type { PubSubOff } from '@/types/pubsub'

export class PubSubImpl<T extends Record<string, any[]> = Record<string, any[]>> implements PubSubOff<T> {
  private readonly listeners = new Map<keyof T, Set<(...args: any[]) => any>>()

  constructor(private onerror?: (error: Error) => void, private _uncaughtEvents?: (keyof T)[]) {
    this.onerror = onerror
  }

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

  on<const K extends keyof T>(type: K, listener: (...args: T[K]) => void, once?: boolean) {
    const inner = this._inner(type, true)!
    const fn = once
      ? (...args: T[K]) => {
          inner.delete(fn)
          listener.call(this, ...args)
        }
      : listener.bind(this)

    inner.add(fn)
  }

  off(type: keyof T, listener: (...args: any[]) => any) {
    this._inner(type)?.delete(listener)
  }

  emit<const K extends keyof T>(type: K, ...args: T[K]) {
    const listeners = this._inner(type)
    const p = Promise.resolve()
    if (listeners) {
      for (const listener of listeners) {
        p.then(() => listener(...args))
          .catch(this._uncaughtEvents?.includes(type) ? null : this.onerror)
      }
    }
  }
}
