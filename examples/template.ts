#!/usr/bin/env bun
import { open } from 'napcon'
import {
  defineHandler,
  findMessageSegment,
  isSameNumericId,
  matchEvent,
  NumericSet,
  sendRequest,
  t,
  template,
} from 'napcon/utils'
import z from 'zod'

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

const hello = template({
  props: z.object({
    name: z.string(),
  }),
  build: props => t.text(`Hello, ${props.name}!`),
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
      message: hello({ name: message.sender.nickname }),
    })
  },
)

connection.on(
  'protocol.event',
  matchEvent('message.group', handleGroupMessage),
)

connection.on('connection.connected', () => {
  console.log('Connected')
})

connection.on('connection.disconnected', () => {
  console.log('Disconnected')
})

connection.on('protocol.event', (event) => {
  console.log('Event', event)
})

await connection.connect()
