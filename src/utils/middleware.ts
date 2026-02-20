import type { MaybeArray, MaybePromiseLike } from '@/types'

export function useGuard<const T extends [unknown] | unknown[]>(filter: MaybeArray<(...args: T) => boolean | null | undefined>, transform: (...args: T) => void): (...args: T) => void {
  return (...args: T) => {
    const res = Array.isArray(filter)
      ? filter.every(f => !!f(...args))
      : !!filter(...args)
    if (res) {
      return transform(...args)
    }
    return undefined
  }
}

export function useGuardAsync<const T extends [unknown] | unknown[]>(filter: MaybeArray<(...args: T) => MaybePromiseLike<boolean | null | undefined>>, transform: (...args: T) => Promise<void>): (...args: T) => Promise<void> {
  return async (...args: T) => {
    const res = Array.isArray(filter)
      ? await Promise.all(filter.map(f => f(...args))).then(results => results.every(v => !!v))
      : await filter(...args) !== false
    if (res) {
      return transform(...args)
    }
    return undefined
  }
}

useGuard.async = useGuardAsync
