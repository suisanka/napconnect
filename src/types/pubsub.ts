export interface SubHalf<T extends Record<string, any[]>> {
  // eslint-disable-next-line ts/method-signature-style
  on<const K extends keyof T>(
    type: K,
    listener: (...args: T[K]) => void,
    once?: boolean,
  ): void
}
export interface OffHalf<T extends Record<string, any> = Record<string, any>> {
  off: (type: keyof T, listener: (...args: any[]) => any) => void
}

export interface PubHalf<T extends Record<string, any> = Record<string, any>> {
  emit: <const K extends keyof T>(type: K, ...args: any[]) => void
}

export type SubOff<T extends Record<string, any[]> = Record<string, any[]>> = SubHalf<T> & OffHalf<T>
export type PubSub<T extends Record<string, any[]> = Record<string, any[]>> = PubHalf<T> & SubHalf<T>
export type PubSubOff<T extends Record<string, any[]> = Record<string, any[]>> = PubSub<T> & OffHalf<T>
