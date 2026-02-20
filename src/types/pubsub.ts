export type TypedOnFunction<T extends Record<string, (args: any) => any>>
  = <K extends keyof T>(
    type: K,
    listener: T[K],
    once?: boolean,
  ) => void

export interface SubHalf<T extends Record<string, any> = Record<string, any>> {
  on: TypedOnFunction<T>
}

export interface OffHalf<T extends Record<string, any> = Record<string, any>> {
  off: (type: keyof T, listener: (...args: any[]) => any) => void
}

export interface PubHalf<T extends Record<string, any> = Record<string, any>> {
  emit: <const K extends keyof T>(type: K, ...args: any[]) => void
}

export type SubOff<T extends Record<string, any> = Record<string, any>> = SubHalf<T> & OffHalf<T>
export type PubSub<T extends Record<string, any> = Record<string, any>> = PubHalf<T> & SubHalf<T>
export type PubSubOff<T extends Record<string, any> = Record<string, any>> = PubSub<T> & OffHalf<T>
