import type { PubSubOff } from '@/types/pubsub'
import { noop } from './value'

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

  on<const K extends keyof T>(type: K, ...listeners: Array<(...args: T[K]) => void>) {
    const inner = this._inner(type, true)!
    if (listeners.length === 0) {
      return noop
    }
    else if (listeners.length === 1) {
      inner.add(listeners[0]!)
      return () => inner.delete(listeners[0]!)
    }
    else {
      for (const fn of listeners) {
        inner.add(fn)
      }
      return () => {
        this.off(type, ...listeners)
      }
    }
  }

  off(type: keyof T, ...listeners: Array<(...args: any[]) => any>) {
    const inner = this._inner(type)
    if (inner) {
      if (listeners.length === 0) {
        return false
      }
      else if (listeners.length === 1) {
        return inner.delete(listeners[0]!)
      }
      else {
        let success = true
        for (const listener of listeners) {
          success &&= inner.delete(listener)
        }
        return success
      }
    }
  }

  emit<const K extends keyof T>(type: K, ...args: T[K]) {
    const listeners = this._inner(type)
    if (listeners) {
      const p = Promise.resolve()
      for (const listener of listeners) {
        p.then(() => listener(...args))
          .catch(this._uncaughtEvents?.includes(type) ? null : this.onerror)
      }
    }
  }
}
