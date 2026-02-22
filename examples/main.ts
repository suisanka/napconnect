#!/usr/bin/env bun
import { open } from 'napcon'
import {
  findMessageSegment,
  isSameNumericId,
  matchEvent,
  sendRequest,
} from 'napcon/utils'

const connection = open(
  () => new WebSocket(import.meta.env.NAPCAT_URL!),
)

connection.on(
  'connection.event',
  matchEvent('message.group', async (message) => {
    if (!findMessageSegment(
      'at',
      message.message,
      segment => isSameNumericId(segment.data.qq, message.self_id),
    )) {
      return
    }

    await sendRequest(connection, 'send_msg', {
      group_id: message.group_id,
      message: `Hello, ${message.sender.nickname}!`,
    })
  }),
)

await connection.connect()
