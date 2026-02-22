export function isSameNumericId(id1: string | number, id2: string | number) {
  return Object.is(id1.toString(), id2.toString())
}

export function isNull(value: any): value is null | undefined {
  return Object.is(value, void 0)
}

export class NumericSet implements Iterable<string> {
  private _size = 0
  private _record: Record<string | number, true> = {}

  constructor(ids?: Iterable<string | number>) {
    if (!ids) {
      return
    }

    for (const id of ids) {
      this._record[id] = true
      this._size++
    }
  }

  clear() {
    this._record = {}
    this._size = 0
  }

  has(id: string | number): boolean {
    return !!this._record[id]
  }

  remove(id: string | number): boolean {
    if (this._record[id]) {
      delete this._record[id]
      this._size--
      return true
    }
    return false
  }

  add(id: string | number): this {
    if (!this._record[id]) {
      this._record[id] = true
      this._size++
    }
    return this
  }

  get size() {
    return this._size
  }

  [Symbol.iterator](): IterableIterator<string> {
    return Object.keys(this._record).values()
  }

  static split(str?: string, sep = ',') {
    return str ? new NumericSet(str.trim().split(sep)) : new NumericSet()
  }
}

// eslint-disable-next-line antfu/top-level-function
export const noop = () => { /* noop */ }
