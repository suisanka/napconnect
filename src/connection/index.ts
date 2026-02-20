import type { Dispose } from '@/types/common'
import type { Connection, ConnectionEventHandlers, OpenConnectionOptions } from '@/types/connection'
import type { ProtocolReply, ProtocolRequest } from '@/types/protocol'
import type { Transport } from '@/types/transport'
import { nanoid } from 'nanoid'
import { ReadyStates } from '@/types/transport'
import { PubSubImpl } from '@/utils/pubsub'

const NAPCAT_NOTICE_NOTIFY_MAP: Record<string, { notice_type: string, sub_type: string }> = {
  input_status: {
    notice_type: 'friend',
    sub_type: 'input',
  },
  profile_like: {
    notice_type: 'friend',
    sub_type: 'like',
  },
  title: {
    notice_type: 'group',
    sub_type: 'title',
  },
}

const NAPCAT_NOTICE_EVENT_MAP: Record<string, { notice_type: string, sub_type: string }> = {
  friend_add: {
    notice_type: 'friend',
    sub_type: 'increase',
  },
  friend_recall: {
    notice_type: 'friend',
    sub_type: 'recall',
  },
  offline_file: {
    notice_type: 'friend',
    sub_type: 'offline_file',
  },
  client_status: {
    notice_type: 'client',
    sub_type: 'status',
  },
  group_admin: {
    notice_type: 'group',
    sub_type: 'admin',
  },
  group_ban: {
    notice_type: 'group',
    sub_type: 'ban',
  },
  group_card: {
    notice_type: 'group',
    sub_type: 'card',
  },
  group_upload: {
    notice_type: 'group',
    sub_type: 'upload',
  },
  group_decrease: {
    notice_type: 'group',
    sub_type: 'decrease',
  },
  group_increase: {
    notice_type: 'group',
    sub_type: 'increase',
  },
  group_msg_emoji_like: {
    notice_type: 'group',
    sub_type: 'reaction',
  },
  essence: {
    notice_type: 'group',
    sub_type: 'essence',
  },
  group_recall: {
    notice_type: 'group',
    sub_type: 'recall',
  },
}

export class ConnectionImpl extends PubSubImpl<ConnectionEventHandlers> implements Connection {
  private _transport: Transport | undefined
  private _disposeTransportEvents: Dispose | undefined
  private _reconnectAttempts = 0
  private _reconnectTimer: any | undefined
  private _manualClose = false
  private _isReconnecting = false
  private _callbacks = new Map<string, { resolve: (data: any) => void, reject: (err: any) => void, timer: NodeJS.Timeout }>()

  constructor(private readonly _options: OpenConnectionOptions) {
    super()
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

  private async _connect(reconnecting = false): Promise<void> {
    try {
      const transportOrPromise = this._options.transport(this._options.token)
      const transport = await transportOrPromise
      this._transport = transport
      if (reconnecting) {
        this.emit('connection.reconnect', this._transport, this)
      }
      this._bindTransportEvents(transport)
    }
    catch (error) {
      this.emit('connection.error', error, this)
      throw error
    }
  }

  request<P, R = any>(method: string, args?: P): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const echo = nanoid()
      const request: ProtocolRequest = {
        action: method,
        params: args,
        echo,
      }

      const timer = setTimeout(() => {
        if (this._callbacks.has(echo)) {
          this._callbacks.delete(echo)
          const error = new Error(`API Request Timeout: ${method}`)
          this.emit('connection.error', error, this)
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
      const pending = this._callbacks.get(data.echo)
      if (pending) {
        clearTimeout(pending.timer)
        this._callbacks.delete(data.echo)
        this.emit('connection.reply', data as ProtocolReply, this)

        if (data.status === 'ok' || data.retcode === 0) {
          pending.resolve(data.data)
        }
        else {
          pending.reject(new Error(data.message || `API Error: ${data.retcode}`))
        }
        return
      }
    }

    // Handle Event
    if (data.post_type) {
      // Apply NapCat mapping logic
      if (data.post_type === 'notice') {
        const isNotify = data.notice_type === 'notify'
        const isPoke = data.sub_type === 'poke'
        const isGroup = !!data.group_id

        const { notice_type, sub_type } = isNotify
          ? isPoke
            ? { notice_type: isGroup ? 'group' : 'friend', sub_type: 'poke' }
            : NAPCAT_NOTICE_NOTIFY_MAP[data.sub_type] || {}
          : NAPCAT_NOTICE_EVENT_MAP[data.notice_type] || {}

        if (notice_type)
          data.notice_type = notice_type
        if (sub_type)
          data.sub_type = sub_type
      }

      this.emit('connection.event', data, this)
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

    if (data.post_type) {
      emit(data.post_type) // e.g. 'notice'

      if (data.post_type === 'meta_event') {
        if (data.meta_event_type) {
          emit(`meta.${data.meta_event_type}`) // e.g. 'meta.heartbeat'
          if (data.sub_type) {
            emit(`meta.${data.meta_event_type}.${data.sub_type}`)
          }
        }
      }
      else if (data.post_type === 'message') {
        if (data.message_type) {
          emit(`message.${data.message_type}`) // e.g. 'message.private'
          if (data.sub_type) {
            emit(`message.${data.message_type}.${data.sub_type}`)
          }
        }
      }
      else if (data.post_type === 'message_sent') {
        emit('message.sent') // ProtocolEventNamePaths maps 'message.sent'
        // Note: _reference.ts treats message_sent as post_type 'message_sent'.
        // But ProtocolEventNamePaths has it under 'message.sent'.
        // So we emit 'message.sent' here.
      }
      else if (data.post_type === 'notice') {
        if (data.notice_type) {
          emit(`notice.${data.notice_type}`) // e.g. 'notice.group'
          if (data.sub_type) {
            emit(`notice.${data.notice_type}.${data.sub_type}`) // e.g. 'notice.group.increase'
          }
        }
      }
      else if (data.post_type === 'request') {
        if (data.request_type) {
          emit(`request.${data.request_type}`) // e.g. 'request.friend'
          if (data.sub_type) {
            emit(`request.${data.request_type}.${data.sub_type}`)
          }
        }
      }
    }
  }

  private _scheduleReconnect() {
    const { reconnect } = this._options
    if (!reconnect || this._manualClose)
      return

    const { attempts, interval } = reconnect

    if (attempts !== 'always' && this._reconnectAttempts >= attempts) {
      // Reconnect failed
      return
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
