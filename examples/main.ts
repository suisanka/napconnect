#!/usr/bin/env bun
import { open } from 'napcon'
import {
  findMessageSegment,
  isSameNumericId,
  matchEvent,
  sendRequest,
} from 'napcon/utils'

using connection = open(
  () => new WebSocket(import.meta.env.NAPCAT_URL!),
)

connection.on(
  'protocol.event',
  matchEvent('message.group', async (message) => {
    const segment = findMessageSegment(
      'at',
      message.message,
      segment => isSameNumericId(segment.data.qq, message.self_id),
    )

    if (!segment) {
      return
    }

    await sendRequest(connection, 'send_msg', {
      group_id: message.group_id,
      message: `Hello, ${message.sender.nickname}!`,
    })
  }),
)

await connection.connect()
