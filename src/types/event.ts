import type { ProtocolMessageRecvSegment } from '@/types/message'

export type ProtocolEventPostTypes = 'meta_event' | 'notice' | 'request' | 'message' | 'message_sent'

export interface ProtocolEventCommon {
  time: number
  self_id: number
  [x: string]: unknown
}

export interface ProtocolMetaEventCommon extends ProtocolEventCommon {
  post_type: 'meta_event'
}

export interface ProtocolMetaHeartbeatEvent extends ProtocolMetaEventCommon {
  meta_event_type: 'heartbeat'

  status: {
    online?: boolean
    good: boolean
  }
  interval: number
}

export type ProtocolMetaLifecycleEventSubTypes = 'enable' | 'disable' | 'connect'
export interface ProtocolMetaLifecycleEvent extends ProtocolMetaEventCommon {
  meta_event_type: 'lifecycle'
  sub_type: ProtocolMetaLifecycleEventSubTypes
}

export type ProtocolMetaEvent = ProtocolMetaHeartbeatEvent | ProtocolMetaLifecycleEvent

export interface ProtocolNoticeEventCommon extends ProtocolEventCommon {
  post_type: 'notice'
}

export interface ProtocolNoticeGroupEventCommon extends ProtocolNoticeEventCommon {
  group_id: number
  user_id: number
}

export interface ProtocolNoticeFriendAddEvent extends ProtocolNoticeEventCommon {
  notice_type: 'friend_add'
  user_id: number
}

export interface ProtocolNoticeFriendRecallEvent extends ProtocolNoticeEventCommon {
  notice_type: 'friend_recall'
  user_id: number
  message_id: number
}

export type ProtocolNoticeGroupIncreaseEventSubTypes = 'approve' | 'invite'
export interface ProtocolNoticeGroupIncreaseEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'group_increase'
  operator_id: number
  sub_type: ProtocolNoticeGroupIncreaseEventSubTypes
}

export type ProtocolNoticeGroupDecreaseEventSubTypes = 'leave' | 'kick' | 'kick_me' | 'disband'

export interface ProtocolNoticeGroupDecreaseEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'group_decrease'
  operator_id: number
  sub_type: ProtocolNoticeGroupDecreaseEventSubTypes
}

export type ProtocolNoticeGroupAdminEventSubTypes = 'set' | 'unset'

export interface ProtocolNoticeGroupAdminEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'group_admin'
  sub_type: ProtocolNoticeGroupAdminEventSubTypes
}

export type ProtocolNoticeGroupBanEventSubTypes = 'ban' | 'lift_ban'
export interface ProtocolNoticeGroupBanEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'group_ban'
  operator_id: number
  sub_type: ProtocolNoticeGroupBanEventSubTypes
  duration: number // in seconds
}

export interface ProtocolNoticeGroupUploadFile {
  id: string
  name: string
  size: number
  busid: number
}

export interface ProtocolNoticeGroupUploadEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'group_upload'
  file: ProtocolNoticeGroupUploadFile
}

export interface ProtocolNoticeGroupRecallEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'group_recall'
  operator_id: number
  message_id: number
}

export interface ProtocolNoticeGroupCardEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'group_card'
  card_new: string
  card_old: string
}

export interface ProtocolNoticeNotifyGroupNameEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'notify'
  sub_type: 'group_name'
  name_new: string
}

export interface ProtocolNoticeNotifyGroupTitleEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'notify'
  sub_type: 'title'
  title: string
}

export type ProtocolNoticeGroupEssenceEventSubTypes = 'add' | 'delete'
export interface ProtocolNoticeGroupEssenceEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'essence'
  message_id: number
  sender_id: number
  operator_id: number
  sub_type: ProtocolNoticeGroupEssenceEventSubTypes
}

export interface ProtocolMessageEmojiLike {
  emoji_id: string
  count: number
}

export interface ProtocolNoticeGroupMessageEmojiLikeEvent extends ProtocolNoticeGroupEventCommon {
  notice_type: 'group_msg_emoji_like'
  message_id: number
  likes: ProtocolMessageEmojiLike[]
}

export interface ProtocolNoticeNotifyPokeEventCommon extends ProtocolNoticeEventCommon {
  notice_type: 'notify'
  sub_type: 'poke'
  target_id: number
  user_id: number
  [x: string]: any
}

export interface ProtocolNoticeNotifyGroupPokeEvent extends ProtocolNoticeNotifyPokeEventCommon {
  group_id: number
  raw_info: any
}

export interface ProtocolNoticeNotifyFriendPokeEvent extends ProtocolNoticeNotifyPokeEventCommon {
  sender_id: number
  raw_info: any
}

export type ProtocolNoticeNotifyPokeEvent
  = | ProtocolNoticeNotifyGroupPokeEvent
    | ProtocolNoticeNotifyFriendPokeEvent

export interface ProtocolNoticeNotifyProfileLikeEvent extends ProtocolNoticeEventCommon {
  notice_type: 'notify'
  sub_type: 'profile_like'
  operator_id: number
  operator_nick: string
  times: number
  time: number
}

export interface ProtocolNoticeNotifyInputStatusEvent extends ProtocolNoticeEventCommon {
  notice_type: 'notify'
  sub_type: 'input_status'
  status_text: string
  event_type: number
  user_id: number
  group_id?: number
}

export interface ProtocolNoticeBotOfflineEvent extends ProtocolNoticeEventCommon {
  notice_type: 'bot_offline'
  user_id: number
  tag: string
  message: string
}

export type ProtocolNoticeNotifyEvent
  = | ProtocolNoticeNotifyGroupNameEvent
    | ProtocolNoticeNotifyGroupTitleEvent
    | ProtocolNoticeNotifyProfileLikeEvent
    | ProtocolNoticeNotifyInputStatusEvent

export type ProtocolNoticeGroupEvent
  = | ProtocolNoticeGroupIncreaseEvent
    | ProtocolNoticeGroupDecreaseEvent
    | ProtocolNoticeGroupAdminEvent
    | ProtocolNoticeGroupBanEvent
    | ProtocolNoticeGroupUploadEvent
    | ProtocolNoticeGroupCardEvent
    | ProtocolNoticeGroupEssenceEvent
    | ProtocolNoticeGroupMessageEmojiLikeEvent
    | ProtocolNoticeGroupRecallEvent

export type ProtocolNoticeFriendEvent
  = | ProtocolNoticeFriendAddEvent
    | ProtocolNoticeFriendRecallEvent

export type ProtocolNoticeEvent
  = | ProtocolNoticeNotifyEvent
    | ProtocolNoticeGroupEvent
    | ProtocolNoticeFriendEvent

export interface ProtocolRequestEventCommon {
  post_type: 'request'
  request_type: 'friend' | 'group'
}

export interface ProtocolFriendRequestEvent extends ProtocolRequestEventCommon {
  request_type: 'friend'
  user_id: number
  comment: string
  flag: string
}

export interface ProtocolGroupRequestEvent extends ProtocolRequestEventCommon {
  request_type: 'group'
  user_id: number
  comment: string
  flag: string
  sub_type: string
}

export type ProtocolRequestEvent
  = | ProtocolFriendRequestEvent
    | ProtocolGroupRequestEvent

export interface ProtocolMessageEventCommon extends ProtocolEventCommon {
  post_type: 'message'
  message_id: number
  message_type: 'private' | 'group'
  user_id: number
  message: string | ProtocolMessageRecvSegment[]
  message_format: 'string' | 'array'
  font: string
  raw_message: string
}

export type ProtocolMessagePrivateEventSubTypes = 'friend' | 'group' | 'other'

export interface ProtocolMessagePrivateEvent extends ProtocolMessageEventCommon {
  message_type: 'private'
  user_id: number
  sub_type: ProtocolMessagePrivateEventSubTypes
  sender: {
    user_id: number
    nickname: string
    sex: 'male' | 'female' | 'unknown'
    age: number
    area?: string
  }
}

export interface ProtocolMessageGroupEvent extends ProtocolMessageEventCommon {
  message_type: 'group'
  group_id: number
  anonymous?: any
  sender: {
    user_id: number
    nickname: string
    card: string
    role: 'owner' | 'admin' | 'member'
    title: string
    level: string
    sex: 'male' | 'female' | 'unknown'
    age: number
    area: string
  }
}

export type ProtocolMessageEvent
  = | ProtocolMessagePrivateEvent
    | ProtocolMessageGroupEvent

export interface ProtocolMessageSentEvent extends Omit<ProtocolMessageEventCommon, 'post_type'> {
  post_type: 'message_sent'
  target_id: number
}

export type ProtocolEvent
  = | ProtocolMetaEvent
    | ProtocolNoticeEvent
    | ProtocolRequestEvent
    | ProtocolMessageEvent
    | ProtocolMessageSentEvent

type _GenerateProtocolEventNames<T extends Record<string | number, any>, O extends string = ''>
  = {
    [K in Exclude<keyof T, '_'>]: K extends string | number
      ? T[K] extends Record<'_', any>
        ? `${O}${K}` | _GenerateProtocolEventNames<T[K], `${O}${K}.`>
        : `${O}${K}`
      : never
  }[Exclude<keyof T, '_'>]

export interface ProtocolEventNamePaths {
  meta: {
    _: ProtocolMetaEvent
    heartbeat: ProtocolMetaHeartbeatEvent
    lifecycle: {
      _: ProtocolMetaLifecycleEvent
      enable: ProtocolMetaLifecycleEvent
      disable: ProtocolMetaLifecycleEvent
      connect: ProtocolMetaLifecycleEvent
    }
  }
  notice: {
    _: ProtocolNoticeEvent
    essence: {
      _: ProtocolNoticeGroupEssenceEvent
      add: ProtocolNoticeGroupEssenceEvent
      delete: ProtocolNoticeGroupEssenceEvent
    }
    group: {
      _: ProtocolNoticeGroupEvent
      recall: ProtocolNoticeGroupRecallEvent
      increase: ProtocolNoticeGroupIncreaseEvent
      decrease: ProtocolNoticeGroupDecreaseEvent
      admin: {
        _: ProtocolNoticeGroupAdminEvent
        set: ProtocolNoticeGroupAdminEvent
        unset: ProtocolNoticeGroupAdminEvent
      }
      ban: ProtocolNoticeGroupBanEvent
      upload: ProtocolNoticeGroupUploadEvent
      card: ProtocolNoticeGroupCardEvent

      reaction: ProtocolNoticeGroupMessageEmojiLikeEvent
    }
    bot: {
      _: ProtocolNoticeBotOfflineEvent
      offline: ProtocolNoticeBotOfflineEvent
    }
    notify: {
      _: ProtocolNoticeNotifyEvent
      name: ProtocolNoticeNotifyGroupNameEvent
      title: ProtocolNoticeNotifyGroupTitleEvent
      poke: ProtocolNoticeNotifyPokeEvent
      profile_like: ProtocolNoticeNotifyProfileLikeEvent
      input_status: ProtocolNoticeNotifyInputStatusEvent
    }
    friend: {
      _: ProtocolNoticeFriendEvent
      add: ProtocolNoticeFriendAddEvent
      recall: ProtocolNoticeFriendRecallEvent
    }
  }
  request: {
    _: ProtocolRequestEvent
    friend: ProtocolFriendRequestEvent
    group: ProtocolGroupRequestEvent
  }
  message: {
    _: ProtocolMessageEvent
    private: {
      _: ProtocolMessagePrivateEvent
      friend: ProtocolMessagePrivateEvent
      group: ProtocolMessagePrivateEvent
      other: ProtocolMessagePrivateEvent
    }
    group: ProtocolMessageGroupEvent
    sent: ProtocolMessageSentEvent
  }
}

export type ProtocolEventNames = _GenerateProtocolEventNames<ProtocolEventNamePaths>
