import type { Dispose } from '@/types/common'
import type { Connection, ConnectionEventHandlers, OpenConnectionOptions } from '@/types/connection'
import type { ProtocolReadableStream, ProtocolReplyStream, ProtocolRequest } from '@/types/protocol'
import type { Transport } from '@/types/transport'
import { nanoid } from 'nanoid'
import { ReadyStates } from '@/types/transport'
import { PubSubImpl } from '@/utils/pubsub'

export class ConnectionImpl extends PubSubImpl<ConnectionEventHandlers> implements Connection {
  private _transport: Transport | undefined
  private _disposeTransportEvents: Dispose | undefined
  private _reconnectAttempts = 0
  private _reconnectTimer: any | undefined
  private _manualClose = false
  private _isReconnecting = false
  private _callbacks = new Map<string, { resolve: (data: any) => void, reject: (err: any) => void, timer: NodeJS.Timeout }>()
  private _streams = new Map<string, { enqueue: (data: any) => void, raise: (err: any) => void, complete: (value: any) => void, close: () => void }>()

  constructor(private readonly _options: OpenConnectionOptions) {
    super(err => this._handleError(err), ['connection.error'])
  }

  get transport(): Transport {
    if (!this._transport) {
      throw new Error('Transport not connected')
    }
    return this._transport
  }

  async connect(): Promise<void> {
    this._manualClose = false
    await this._connect()
  }

  private _handleError(error: any) {
    this.emit('connection.error', error, this)
  }

  private async _connect(reconnecting = false): Promise<void> {
    try {
      const transportOrPromise = this._options.transport(this._options.token ?? '')
      const transport = await transportOrPromise
      this._transport = transport
      if (reconnecting) {
        this.emit('connection.reconnect', this._transport, this)
      }
      this._bindTransportEvents(transport)
    }
    catch (error) {
      this._handleError(error)
      throw error
    }
  }

  private _createStream(echo: string): [ReadableStream<any>, Promise<any>] {
    const deferred = { resolve: null, reject: null } as any
    const promise = new Promise<any>((res, rej) => {
      deferred.resolve = res
      deferred.reject = rej
    })

    return [new ReadableStream<any>({
      start: (controller) => {
        this._streams.set(echo, {
          enqueue: data => controller.enqueue(data),
          raise: (err) => {
            deferred.reject?.(err)
            controller.error(err)
          },
          complete: (value) => {
            deferred.resolve?.(value)
            controller.close()
          },
          close: () => controller.close(),
        })
      },
      cancel: () => {
        this._streams.delete(echo)
        deferred.reject?.(new Error('Stream canceled'))
      },
    }), promise]
  }

  request<const P, const R = any>(method: string, args: P, stream?: false): Promise<R>
  request<const P, const R = any>(method: string, args: P, stream: true): Promise<[ProtocolReadableStream, Promise<R>]>
  request<P, R = any>(method: string, args?: P, stream?: boolean): Promise<R | [ProtocolReadableStream, Promise<R>]> {
    return new Promise<any>((resolve, reject) => {
      const echo = nanoid()
      const request: ProtocolRequest = {
        action: method,
        params: args,
        echo,
        stream: stream ? 'stream-action' : 'normal-action',
      }

      if (stream) {
        const result = this._createStream(echo)
        try {
          this.emit('connection.request', request, this)
          this.transport.send(JSON.stringify(request))
          resolve(result)
        }
        catch (error) {
          this._streams.delete(echo)
          this._handleError(error)
          reject(error)
        }
        return
      }

      const timer = setTimeout(() => {
        if (this._callbacks.has(echo)) {
          this._callbacks.delete(echo)
          const error = new Error(`API Request Timeout: ${method}`)

          this._handleError(error)
          reject(error)
        }
      }, this._options.timeout ?? 30000) // 30s timeout

      this._callbacks.set(echo, { resolve, reject, timer })

      try {
        this.emit('connection.request', request, this)
        this.transport.send(JSON.stringify(request))
      }
      catch (error) {
        clearTimeout(timer)
        this._callbacks.delete(echo)
        this._handleError(error)
        reject(error)
      }
    })
  }

  private _bindTransportEvents(transport: Transport) {
    this._disposeTransportEvents?.()

    const onOpen = () => {
      this.emit('connection.connected', transport, this)
      if (this._isReconnecting) {
        this._isReconnecting = false
        this._reconnectAttempts = 0
        clearTimeout(this._reconnectTimer)
      }
    }

    const onMessage = (event: { data: any }) => {
      const data = typeof event.data === 'string'
        ? (() => {
            try {
              return JSON.parse(event.data)
            }
            catch {
              return null
            }
          })()
        : event.data

      if (data) {
        this._handleMessage(data)
      }
    }

    const onError = (error: any) => {
      this.emit('connection.error', error, this)
    }

    const onClose = () => {
      this._disposeTransportEvents?.()
      this._disposeTransportEvents = undefined

      this.emit('connection.disconnected', transport, this)
      this._transport = undefined

      // Clear all pending streams
      for (const [_, { raise }] of this._streams) {
        raise(new Error('Connection closed'))
      }
      this._streams.clear()

      // Clear all pending requests
      for (const [_, { reject, timer }] of this._callbacks) {
        clearTimeout(timer)
        reject(new Error('Connection closed'))
      }
      this._callbacks.clear()

      if (!this._manualClose) {
        this._scheduleReconnect()
      }
    }

    transport.addEventListener('open', onOpen)
    transport.addEventListener('message', onMessage)
    transport.addEventListener('error', onError)
    transport.addEventListener('close', onClose)

    if (transport.readyState === ReadyStates.OPEN) {
      onOpen()
    }

    this._disposeTransportEvents = () => {
      transport.removeEventListener('open', onOpen)
      transport.removeEventListener('message', onMessage)
      transport.removeEventListener('error', onError)
      transport.removeEventListener('close', onClose)
    }
  }

  private _handleMessage(data: any) {
    if (!data)
      return

    // Handle Reply
    if (data.echo) {
      this.emit('connection.reply', data, this)
      if (data.stream === 'stream-action') {
        this.emit('connection.reply.stream', data, this)

        const stream = this._streams.get(data.echo)
        if (!stream)
          return

        const message = data as ProtocolReplyStream
        if (message.status === 'ok') {
          if (message.data!.type === 'stream' && message.data!.data_type === 'data_chunk') {
            stream.enqueue(message)
          }
          else if (message.data!.type === 'response' && message.data!.data_type === 'data_complete') {
            this._streams.delete(data.echo)
            stream.complete(message.data!.data)
          }
        }
        else if (message.status === 'failed') {
          this._streams.delete(data.echo)
          stream.raise(new Error(`Stream Error: ${message.message || `code ${message.retcode}`}`))
        }
        return
      }

      const pending = this._callbacks.get(data.echo)
      if (pending) {
        clearTimeout(pending.timer)
        this._callbacks.delete(data.echo)

        if (data.status === 'ok') {
          pending.resolve(data.data)
        }
        else {
          pending.reject(new Error(`Request Error: ${data.message || `code ${data.retcode}`}`))
        }
        return
      }
    }

    // Handle Event
    if (data.post_type) {
      this._dispatchProtocolEvents(data)
    }
  }

  private _dispatchProtocolEvents(data: any) {
    // Emit hierarchical events
    // e.g. notice -> notice.group -> notice.group.increase
    // Helper to emit safely
    const emit = (type: string) => {
      this.emit(type as any, data, this)
    }

    emit('connection.event')
    let typeA = data.post_type

    if (typeA === 'message_sent') {
      emit('message.sent')
      return
    }

    const originalTypeA = typeA
    if (typeA === 'meta_event') {
      typeA = 'meta'
    }
    emit(typeA)

    const typeB = data[`${originalTypeA}_type`]
    let parts: string[] = []

    if (typeB === 'group_msg_emoji_like') {
      parts = ['group', 'reaction']
    }
    else if (typeB && typeB.includes('_')) {
      parts = typeB.split('_')
    }
    else if (typeB) {
      parts = [typeB]
    }

    let currentPath = typeA
    for (const part of parts) {
      currentPath += `.${part}`
      emit(currentPath)
    }

    if (data.sub_type) {
      emit(`${currentPath}.${data.sub_type}`)
    }
  }

  private _scheduleReconnect() {
    const { reconnect } = this._options
    if (!reconnect || this._manualClose)
      return

    const { attempts, interval } = reconnect

    if (attempts !== 'always' && this._reconnectAttempts >= attempts) {
      // Reconnect failed
      return this.emit('connection.error', new Error('Reconnect failed'), this)
    }

    this._isReconnecting = true
    this._reconnectAttempts++

    if (this._reconnectTimer)
      clearTimeout(this._reconnectTimer)

    this._reconnectTimer = setTimeout(() => {
      this._connect(true).catch(() => {
        this._scheduleReconnect()
      })
    }, interval)
  }
}

export function open(options: OpenConnectionOptions): Connection {
  const conn = new ConnectionImpl(options)
  return conn
}
