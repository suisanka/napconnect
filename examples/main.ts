#!/usr/bin/env bun
import { open } from 'napcon'
import {
  hasMention,
  matchEvent,
  respond,
} from 'napcon/utils'

using connection = open(
  () => new WebSocket(import.meta.env.NAPCAT_URL!),
)

connection.on(
  'protocol.event',
  matchEvent('message.group', async (message) => {
    if (!hasMention(message))
      return

    await respond(connection, message, `Hello, ${message.sender.nickname}!`)
  }),
)

await connection.connect()
