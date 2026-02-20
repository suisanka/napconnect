import type { ProtocolMessageEvent } from './event'

export type ProtocolMessageSegment = ProtocolMessageRecvSegment | ProtocolMessageSendSegment

export type ProtocolMessageRecvSegment // 接受的消息段
  = | ProtocolMessageTextSegment
    | ProtocolMessageAtSegment
    | ProtocolMessageReplySegment
    | ProtocolMessageFaceSegment
    | ProtocolMessageDiceRecvSegment
    | ProtocolMessageRpsRecvSegment
    | ProtocolMessagePokeRecvSegment
    | ProtocolMessageImageRecvSegment
    | ProtocolMessageRecordRecvSegment
    | ProtocolMessageVideoRecvSegment
    | ProtocolMessageFileRecvSegment
    | ProtocolMessageJsonRecvSegment
    | ProtocolMessageMusicRecvSegment
    | ProtocolMessageForwardRecvSegment
    | ProtocolMessageMarkdownSegment
    | ProtocolMessageMiniAppSegment
    | ProtocolMessageLocationSegment
    | ProtocolMessageXmlSegment
    | ProtocolMessageOnlineFileSegment
    | ProtocolMessageFlashTransferSegment

export type ProtocolMessageSendSegment // 发送的消息段
  = | ProtocolMessageTextSegment
    | ProtocolMessageAtSegment
    | ProtocolMessageReplySegment
    | ProtocolMessageFaceSegment
    | ProtocolMessageMfaceSendSegment
    | ProtocolMessageDiceSendSegment
    | ProtocolMessageRpsSendSegment
    | ProtocolMessagePokeSendSegment
    | ProtocolMessageImageSendSegment
    | ProtocolMessageRecordSendSegment
    | ProtocolMessageVideoSendSegment
    | ProtocolMessageFileSendSegment
    | ProtocolMessageJsonSendSegment
    | ProtocolMessageMusicSendSegment
    | ProtocolMessageContactSendSegment
    | ProtocolMessageMarkdownSegment
    | ProtocolMessageMiniAppSegment
    | ProtocolMessageLocationSegment
    | ProtocolMessageXmlSegment
    | ProtocolMessageOnlineFileSegment
    | ProtocolMessageFlashTransferSegment

// Text
export interface ProtocolMessageTextSegment {
  type: 'text'
  data: {
    text: string
  }
}

export interface ProtocolMessageMarkdownSegment {
  type: 'markdown'
  data: {
    content: string
  }
}

export interface ProtocolMessageAtSegment {
  type: 'at'
  data: {
    qq: string // @全体 = "all"
    name?: string
  }
}

export interface ProtocolMessageReplySegment {
  type: 'reply'
  data: {
    id: string
  }
}

export interface ProtocolMessageFaceSegment {
  type: 'face'
  data: {
    id: string
  }
}

export interface ProtocolMessageMfaceSendSegment {
  type: 'mface'
  data: {
    emoji_id: string // [发]
    emoji_package_id: string // [发]
    key: string // [发]
    summary?: string // [选]
  }
}

// Dice
export interface ProtocolMessageDiceRecvSegment {
  type: 'dice'
  data: {
    result: '1' | '2' | '3' | '4' | '5' | '6' // [收]
  }
}

export interface ProtocolMessageDiceSendSegment {
  type: 'dice'
  data: Record<string, never>
}

// Rps
export interface ProtocolMessageRpsRecvSegment {
  type: 'rps'
  data: {
    result: '1' | '2' | '3' // [收]
  }
}
export interface ProtocolMessageRpsSendSegment {
  type: 'rps'
  data: Record<string, never>
}

// Poke
export interface ProtocolMessagePokeRecvSegment {
  type: 'poke'
  data: {
    type: string
    id: string
  }
}
export interface ProtocolMessagePokeSendSegment {
  type: 'poke'
  data: {
    type: string
    id: string
  }
}

// Image
export interface ProtocolMessageImageRecvSegment {
  type: 'image'
  data: {
    file: string
    name?: string // [发] [选]
    summary?: string // [选]
    sub_type?: number // [选]
    file_id?: string // [收]
    url?: string // [收]
    path?: string // [收]
    file_size?: number // [收]
    file_unique?: string // [收]
  }
}
export interface ProtocolMessageImageSendSegment {
  type: 'image'
  data: {
    file: string
    name?: string // [发] [选]
    summary?: string // [选]
    sub_type?: number // [选]
  }
}

// Contact
export interface ProtocolMessageContactSendSegment {
  type: 'contact'
  data: {
    type: 'qq' | 'group'
    id: string
  }
}
// Note: ProtocolMessageContactRecvSegment is implicitly omitted as it was not in the original Recv union.

// Record
export interface ProtocolMessageRecordRecvSegment {
  type: 'record'
  data: {
    file: string
    url?: string // [收]
    path?: string // [收]
    file_id?: string // [收]
    file_size?: number // [收]
    file_unique?: string // [收]
  }
}
export interface ProtocolMessageRecordSendSegment {
  type: 'record'
  data: {
    file: string
    name?: string // [发] [选]
  }
}

// Video
export interface ProtocolMessageVideoRecvSegment {
  type: 'video'
  data: {
    file: string
    url?: string // [收]
    path?: string // [收]
    file_id?: string // [收]
    file_size?: number // [收]
    file_unique?: string // [收]
  }
}
export interface ProtocolMessageVideoSendSegment {
  type: 'video'
  data: {
    file: string
    name?: string // [发] [选]
    thumb?: string // [发] [选]
  }
}

// File
export interface ProtocolMessageFileRecvSegment {
  type: 'file'
  data: {
    file: string
    path?: string // [收]
    url?: string // [收]
    file_id?: string // [收]
    file_size?: number // [收]
    file_unique?: string // [收]
  }
}
export interface ProtocolMessageFileSendSegment {
  type: 'file'
  data: {
    file: string
    name?: string // [发] [选]
  }
}

// Json
export interface ProtocolMessageJsonRecvSegment {
  type: 'json'
  data: {
    data: string | object
  }
}
export interface ProtocolMessageJsonSendSegment {
  type: 'json'
  data: {
    data: string | object
  }
}

// Music
export interface ProtocolMessageMusicRecvSegment {
  type: 'music'
  data: {
    type?: 'qq' | '163' | 'kugou' | 'kuwo' | 'migu' | 'custom'
    id?: string
    url?: string
    audio?: string
    title?: string
    image?: string
    singer?: string
  }
}
export interface ProtocolMessageMusicSendSegment {
  type: 'music'
  data: {
    type: 'qq' | '163' | 'kugou' | 'kuwo' | 'migu' | 'custom' // [发]
    id?: string // [发]
    url?: string // [发] 点击后跳转目标 URL
    audio?: string // [发] 音乐 URL
    title?: string // [发]
    image?: string // [发] [选]
    singer?: string // [发] [选]
  }
}

// Forward (Recv)
export interface ProtocolMessageForwardRecvSegment {
  type: 'forward'
  data: {
    id: string
    content?: ProtocolMessageEvent
  }
}

export type ProtocolMessageNode
  = | ProtocolMessageRefNode
    | ProtocolMessageContentNode

export interface ProtocolMessageRefNode {
  type: 'node'
  data: {
    id: string
    content?: ProtocolMessageRecvSegment[]
  }
}

export interface ProtocolMessageContentNode {
  type: 'node'
  data: {
    user_id: string
    nickname: string
    id?: string
    content: ProtocolMessageSegment[]
  }
}

export interface ProtocolMessageMiniAppSegment {
  type: 'miniapp'
  data: {
    data: string
  }
}

export interface ProtocolMessageLocationSegment {
  type: 'location'
  data: {
    lat: string | number
    lon: string | number
    title?: string
    content?: string
  }
}

export interface ProtocolMessageXmlSegment {
  type: 'xml'
  data: {
    data: string
  }
}

export interface ProtocolMessageOnlineFileSegment {
  type: 'onlinefile'
  data: {
    msgId: string
    elementId: string
    fileName: string
    fileSize: string
    isDir: boolean
  }
}

export interface ProtocolMessageFlashTransferSegment {
  type: 'flashtransfer'
  data: {
    fileSetId: string
  }
}
