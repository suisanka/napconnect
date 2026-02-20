import type { Connection, ConnectionEventHandlers } from '../types/connection'
import { PubSubImpl } from '../utils/pubsub'

export class ConnectionImpl extends PubSubImpl<ConnectionEventHandlers, ConnectionImpl> implements Connection {
  private 
}
