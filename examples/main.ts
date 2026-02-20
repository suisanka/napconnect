import {
  defineHandler,
  findMessageSegment,
  isSameNumericId,
  NumericSet,
  open,
  sendRequest,
  sendRequestStream,
  useGuardAsync,
} from 'napconnect'

const groupAllowlist = NumericSet.fromSplit(import.meta.env.GROUP_ALLOWLIST || '')

const connection = open({
  transport: token => new WebSocket(`${import.meta.env.NAPCAT_ENDPOINT}/?access_token=${token}`),
  token: import.meta.env.NAPCAT_TOKEN,
  reconnect: {
    interval: 3000,
    attempts: 15,
  },
})

connection.on('connection.connected', () => {
  console.log('Connected')
})

connection.on('connection.disconnected', () => {
  console.log('Disconnected')
})

connection.on('connection.event', (event) => {
  console.log('Event', event)
})

const handleGroupMessage = defineHandler(
  'message.group',
  useGuardAsync(
    [
      message => groupAllowlist.has(message.group_id),
      (message) => {
        const segment = findMessageSegment('at', message.message)
        return segment && isSameNumericId(segment.data.qq, message.self_id)
      },
    ],
    async (message) => {
      await sendRequest(connection, '_mark_all_as_read')

      await sendRequest(connection, 'send_group_msg', {
        auto_escape: true,
        group_id: message.group_id,
        message: 'Hello from napconnect',
      })

      const [stream, res] = await sendRequestStream(connection, 'test_download_stream', {})

      console.log('Stream start', stream, res)

      for await (const reply of stream) {
        console.log('Stream reply', reply)
        await sendRequest(connection, 'send_group_msg', {
          auto_escape: true,
          group_id: message.group_id,
          message: `Stream data: ${reply.data.data}`,
        })
      }

      console.log('Stream response', await res)
    },
  ),
)

connection.on('message.group', handleGroupMessage)

await connection.connect()
