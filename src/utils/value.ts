import type { Numeric } from '@/types/common'

export function isSameNumericId(id1: Numeric, id2: Numeric) {
  return Object.is(id1.toString(), id2.toString())
}

export function isNull(value: any): value is null | undefined {
  return Object.is(value, void 0)
}

export class NumericSet implements Iterable<string> {
  private _size = 0
  private _record: Record<Numeric, true> = Object.create(null)

  constructor(ids?: Iterable<Numeric>) {
    if (!ids) {
      return
    }

    for (const id of ids) {
      this._record[id] = true
      this._size++
    }
  }

  clear() {
    this._record = Object.create(null)
    this._size = 0
  }

  has(id: Numeric): boolean {
    return !!this._record[id]
  }

  remove(id: Numeric): boolean {
    if (this._record[id]) {
      delete this._record[id]
      this._size--
      return true
    }
    return false
  }

  add(id: Numeric): this {
    if (!this._record[id]) {
      this._record[id] = true
      this._size++
    }
    return this
  }

  get size() {
    return this._size
  }

  * [Symbol.iterator](): IterableIterator<string> {
    for (const id in this._record) {
      yield id
    }
  }

  static split(str?: string, sep = ',') {
    return str ? new NumericSet(str.trim().split(sep)) : new NumericSet()
  }
}

// eslint-disable-next-line antfu/top-level-function
export const noop = () => { /* noop */ }
