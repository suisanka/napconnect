#!/usr/bin/env bun
import { open } from 'napcon'
import {
  defineHandler,
  findMessageSegment,
  isSameNumericId,
  matchEvent,
  NumericSet,
  sendRequest,
  sendRequestStream,
} from 'napcon/utils'

const allowlist = NumericSet.split(import.meta.env.GROUP_ALLOWLIST)

const connection = open({
  transport: token => new WebSocket(
    `${import.meta.env.NAPCAT_ENDPOINT}/?access_token=${token}`,
  ),
  token: import.meta.env.NAPCAT_TOKEN,
  reconnect: {
    interval: 3000,
    attempts: 15,
  },
})

const handleGroupMessage = defineHandler(
  'message.group',
  async (message) => {
    if (!allowlist.has(message.group_id)) {
      return
    }

    const segment = findMessageSegment(
      'at',
      message.message,
      segment => isSameNumericId(segment.data.qq, message.self_id),
    )
    if (segment == null) {
      return
    }

    await sendRequest(connection, 'send_msg', {
      auto_escape: true,
      group_id: message.group_id,
      message: 'Hello from napconnect',
    })

    const [stream, res] = await sendRequestStream(
      connection,
      'test_download_stream',
    )

    console.log('Stream start:', stream, res)

    for await (const reply of stream) {
      await sendRequest(connection, 'send_group_msg', {
        auto_escape: true,
        group_id: message.group_id,
        message: `Stream data: ${reply.data}`,
      })
    }

    console.log('Stream end:', await res)
  },
)

connection.on(
  'connection.event',
  matchEvent('message.group', handleGroupMessage),
)

connection.on('connection.connected', () => {
  console.log('Connected')
})

connection.on('connection.disconnected', () => {
  console.log('Disconnected')
})

connection.on('connection.event', (event) => {
  console.log('Event', event)
})

await connection.connect()
