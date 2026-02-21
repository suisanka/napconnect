import type { Connection, ConnectionStreamResult } from '@/types'
import type { ProtocolMessageSendSegment } from '@/types/message'
import type { ProtocolReply, ProtocolReplyStreamResponse } from '@/types/protocol'

export interface ClientMethods {
  send_private_msg: (params: {
    user_id: number | string
    message: string | ProtocolMessageSendSegment | (string | ProtocolMessageSendSegment)[]
    group_id?: number | string
    auto_escape?: boolean
  }) => Promise<ProtocolReply<{ message_id: number }>>

  send_group_msg: (params: {
    group_id: number | string
    message: string | ProtocolMessageSendSegment | (string | ProtocolMessageSendSegment)[]
    auto_escape?: boolean
  }) => Promise<ProtocolReply<{ message_id: number }>>

  send_msg: (params: {
    message_type?: 'private' | 'group'
    user_id?: number | string
    group_id?: number | string
    message: string | ProtocolMessageSendSegment | (string | ProtocolMessageSendSegment)[]
    auto_escape?: boolean
  }) => Promise<ProtocolReply<{ message_id: number }>>

  delete_msg: (params: { message_id: number }) => Promise<ProtocolReply<void>>

  get_msg: (params: { message_id: number }) => Promise<ProtocolReply<{
    time: number
    message_type: 'private' | 'group'
    message_id: number
    real_id: number
    sender: {
      user_id: number
      nickname: string
      card?: string
      sex?: 'male' | 'female' | 'unknown'
      age?: number
    }
    message: ProtocolMessageSendSegment[]
  }>>

  get_forward_msg: (params: { id: string }) => Promise<ProtocolReply<{
    message: (ProtocolMessageSendSegment & { data: { name?: string, uin?: string, content?: ProtocolMessageSendSegment[] } })[]
  }>>

  send_like: (params: { user_id: number | string, times?: number }) => Promise<ProtocolReply<void>>

  set_msg_emoji_like: (params: {
    message_id: number
    emoji_id: string
    set?: boolean
  }) => Promise<ProtocolReply<void>>

  set_group_kick: (params: {
    group_id: number | string
    user_id: number | string
    reject_add_request?: boolean
  }) => Promise<ProtocolReply<void>>

  set_group_ban: (params: {
    group_id: number | string
    user_id: number | string
    duration?: number
  }) => Promise<ProtocolReply<void>>

  set_group_whole_ban: (params: {
    group_id: number | string
    enable?: boolean
  }) => Promise<ProtocolReply<void>>

  set_group_admin: (params: {
    group_id: number | string
    user_id: number | string
    enable?: boolean
  }) => Promise<ProtocolReply<void>>

  set_group_card: (params: {
    group_id: number | string
    user_id: number | string
    card?: string
  }) => Promise<ProtocolReply<void>>

  set_group_name: (params: {
    group_id: number | string
    group_name: string
  }) => Promise<ProtocolReply<void>>

  set_group_leave: (params: {
    group_id: number | string
    is_dismiss?: boolean
  }) => Promise<ProtocolReply<void>>

  set_group_special_title: (params: {
    group_id: number | string
    user_id: number | string
    special_title?: string
    duration?: number
  }) => Promise<ProtocolReply<void>>

  set_group_sign: (params: {
    group_id: number | string
  }) => Promise<ProtocolReply<void>>

  set_friend_add_request: (params: {
    flag: string
    approve?: boolean
    remark?: string
  }) => Promise<ProtocolReply<void>>

  delete_friend: (params: {
    user_id: number | string
    temp_block?: boolean
    temp_both_del?: boolean
  }) => Promise<ProtocolReply<void>>

  set_group_add_request: (params: {
    flag: string
    sub_type?: 'add' | 'invite'
    approve?: boolean
    reason?: string
  }) => Promise<ProtocolReply<void>>

  get_login_info: () => Promise<ProtocolReply<{
    user_id: number
    nickname: string
  }>>

  get_stranger_info: (params: {
    user_id: number | string
    no_cache?: boolean
  }) => Promise<ProtocolReply<{
    user_id: number
    nickname: string
    sex: 'male' | 'female' | 'unknown'
    age: number
  }>>

  get_friend_list: () => Promise<ProtocolReply<{
    user_id: number
    nickname: string
    remark: string
  }[]>>

  get_group_info: (params: {
    group_id: number | string
    no_cache?: boolean
  }) => Promise<ProtocolReply<{
    group_id: number
    group_name: string
    member_count: number
    max_member_count: number
  }>>

  get_group_list: (params?: {
    no_cache?: boolean
  }) => Promise<ProtocolReply<{
    group_id: number
    group_name: string
    member_count: number
    max_member_count: number
    group_remark: string
    group_all_shut: number
  }[]>>

  get_group_member_info: (params: {
    group_id: number | string
    user_id: number | string
    no_cache?: boolean
  }) => Promise<ProtocolReply<{
    group_id: number
    user_id: number
    nickname: string
    card: string
    sex: 'male' | 'female' | 'unknown'
    age: number
    area: string
    join_time: number
    last_sent_time: number
    level: string
    role: 'owner' | 'admin' | 'member'
    unfriendly: boolean
    title: string
    title_expire_time: number
    card_changeable: boolean
  }>>

  get_group_member_list: (params: {
    group_id: number | string
  }) => Promise<ProtocolReply<{
    group_id: number
    user_id: number
    nickname: string
    card: string
    sex: 'male' | 'female' | 'unknown'
    age: number
    area: string
    join_time: number
    last_sent_time: number
    level: string
    role: 'owner' | 'admin' | 'member'
    unfriendly: boolean
    title: string
    title_expire_time: number
    card_changeable: boolean
  }[]>>

  get_group_honor_info: (params: {
    group_id: number | string
    type: 'talkative' | 'performer' | 'legend' | 'strong_newbie' | 'emotion' | 'all'
  }) => Promise<ProtocolReply<{
    group_id: number
    current_talkative?: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
    }
    talkative_list?: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
    }[]
    performer_list?: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
    }[]
    legend_list?: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
    }[]
    strong_newbie_list?: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
    }[]
    emotion_list?: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
    }[]
  }>>

  get_cookies: (params: { domain: string }) => Promise<ProtocolReply<{ cookies: string, bkn: string }>>

  get_csrf_token: () => Promise<ProtocolReply<{ token: number }>>

  get_credentials: (params: { domain: string }) => Promise<ProtocolReply<{ cookies: string, token: number }>>

  get_record: (params: { file: string, out_format: string }) => Promise<ProtocolReply<{ file: string, url?: string }>>

  get_image: (params: { file: string }) => Promise<ProtocolReply<{ file: string, url?: string }>>

  can_send_image: () => Promise<ProtocolReply<{ yes: boolean }>>
  can_send_record: () => Promise<ProtocolReply<{ yes: boolean }>>

  get_status: () => Promise<ProtocolReply<{
    online: boolean
    good: boolean
  }>>

  get_version_info: () => Promise<ProtocolReply<{
    app_name: string
    app_version: string
    protocol_version: string
  }>>

  clean_cache: () => Promise<ProtocolReply<void>>

  _send_group_notice: (params: {
    group_id: number | string
    content: string
    image?: string
    pinned?: number
    type?: number
    confirm_required?: number
    is_show_edit_card?: number
    tip_window_type?: number
  }) => Promise<ProtocolReply<void>>

  _get_group_notice: (params: {
    group_id: number | string
  }) => Promise<ProtocolReply<{
    sender_id: number
    publish_time: number
    notice_id: string
    message: {
      text: string
      image: string[]
    }
    read_num: number
  }[]>>

  get_essence_msg_list: (params: {
    group_id: number | string
  }) => Promise<ProtocolReply<{
    msg_seq: number
    msg_random: number
    sender_id: number
    sender_nick: string
    operator_id: number
    operator_nick: string
    message_id: number
    operator_time: number
    content: string[]
  }[]>>

  set_essence_msg: (params: { message_id: number }) => Promise<ProtocolReply<void>>

  delete_essence_msg: (params: { message_id: number }) => Promise<ProtocolReply<void>>

  get_online_clients: (params?: { no_cache?: boolean }) => Promise<ProtocolReply<{
    app_id: number
    device_name: string
    device_kind: string
  }[]>>

  ocr_image: (params: { image: string }) => Promise<ProtocolReply<{
    texts: {
      text: string
      coordinates: any[]
    }[]
  }>>

  translate_en2zh: (params: { words: string[] }) => Promise<ProtocolReply<{
    words: string[]
  }>>

  get_robot_uin_range: () => Promise<ProtocolReply<{
    minUin: string
    maxUin: string
  }[]>>

  set_online_status: (params: {
    status: number | string
    ext_status: number | string
    battery_status: number | string
  }) => Promise<ProtocolReply<void>>

  upload_group_file: (params: {
    group_id: number | string
    file: string
    name: string
    folder?: string
    folder_id?: string
    upload_file?: boolean
  }) => Promise<ProtocolReply<{ file_id?: string }>>

  get_group_msg_history: (params: {
    group_id: number | string
    message_seq?: string | number
    count?: number
    reverse_order?: boolean
  }) => Promise<ProtocolReply<{
    messages: any[]
  }>>

  send_group_forward_msg: (params: {
    group_id: number | string
    messages: any[]
  }) => Promise<ProtocolReply<{
    message_id: number
    forward_id: string
  }>>

  mark_msg_as_read: (params: {
    group_id?: number | string
    user_id?: number | string
  }) => Promise<ProtocolReply<void>>

  upload_private_file: (params: {
    user_id: number | string
    file: string
    name: string
  }) => Promise<ProtocolReply<void>>

  get_file: (params: {
    file: string
    file_id?: string
  }) => Promise<ProtocolReply<{
    file?: string
    url?: string
    file_size?: string
    file_name?: string
    base64?: string
  }>>

  handle_quick_operation: (params: {
    context: Record<string, any>
    operation: Record<string, any>
  }) => Promise<ProtocolReply<void>>

  get_group_file_url: (params: {
    group_id: number | string
    file_id: string
  }) => Promise<ProtocolReply<{ url: string }>>

  get_private_file_url: (params: {
    user_id?: number | string
    file_id: string
  }) => Promise<ProtocolReply<{ url: string }>>

  clean_stream_temp_file: (params: Record<string, never>) => Promise<ProtocolReply<void>>

  del_group_album_media: (params: {
    group_id: string | number
    album_id: string
    lloc: string
  }) => Promise<ProtocolReply<{ result: any }>>

  set_group_album_media_like: (params: {
    group_id: string | number
    album_id: string
    lloc: string
    id: string
    set?: boolean
  }) => Promise<ProtocolReply<{ result: any }>>

  do_group_album_comment: (params: {
    group_id: string | number
    album_id: string
    lloc: string
    content: string
  }) => Promise<ProtocolReply<{ result: any }>>

  get_group_album_media_list: (params: {
    group_id: string | number
    album_id: string
    attach_info?: string
  }) => Promise<ProtocolReply<{
    media_list: {
      media_id: string
      url: string
    }[]
  }>>

  get_qun_album_list: (params: {
    group_id: string | number
  }) => Promise<ProtocolReply<{
    album_id: string
    album_name: string
    cover_url: string
    create_time: number
  }[]>>

  upload_image_to_qun_album: (params: {
    group_id: string | number
    album_id: string
    album_name: string
    file: string
  }) => Promise<ProtocolReply<{ result: any }>>

  set_group_add_option: (params: {
    group_id: string | number
    add_type: number
    group_question?: string
    group_answer?: string
  }) => Promise<ProtocolReply<void>>

  set_group_robot_add_option: (params: {
    group_id: string | number
    robot_member_switch?: number
    robot_member_examine?: number
  }) => Promise<ProtocolReply<void>>

  set_group_search: (params: {
    group_id: string | number
    no_code_finger_open?: number
    no_finger_open?: number
  }) => Promise<ProtocolReply<void>>

  get_group_info_ex: (params: {
    group_id: string | number
  }) => Promise<ProtocolReply<Record<string, any>>>

  set_group_todo: (params: {
    group_id: string | number
    message_id: string
    message_seq?: string
  }) => Promise<ProtocolReply<void>>

  group_poke: (params: {
    group_id: string | number
    user_id: string | number
    target_id: string | number
  }) => Promise<ProtocolReply<void>>

  set_group_kick_members: (params: {
    group_id: string | number
    user_id: (string | number)[]
    reject_add_request?: boolean
  }) => Promise<ProtocolReply<void>>

  create_collection: (params: {
    rawData: string
    brief: string
  }) => Promise<ProtocolReply<{ result: number, errMsg: string }>>

  set_self_longnick: (params: {
    longNick: string
  }) => Promise<ProtocolReply<void>>

  set_qq_avatar: (params: {
    file: string
  }) => Promise<ProtocolReply<void>>

  get_clientkey: () => Promise<ProtocolReply<{ clientkey: string }>>

  get_ai_characters: (params: {
    group_id: string | number
    chat_type?: number | string
  }) => Promise<ProtocolReply<{
    type: string
    characters: {
      character_id: string
      character_name: string
      preview_url: string
    }[]
  }[]>>

  set_doubt_friends_add_request: (params: {
    flag: string
    approve?: boolean
  }) => Promise<ProtocolReply<void>>

  get_doubt_friends_add_request: (params: {
    count?: number
  }) => Promise<ProtocolReply<{
    user_id: number
    nickname: string
    age: number
    sex: string
    reason: string
    flag: string
  }[]>>

  nc_get_packet_status: () => Promise<ProtocolReply<void>>

  set_restart: () => Promise<ProtocolReply<void>>

  get_group_system_msg: (params: {
    count?: number | string
  }) => Promise<ProtocolReply<{
    invited_requests: any[]
    InvitedRequest: any[]
    join_requests: any[]
  }>>

  set_friend_remark: (params: {
    user_id: string | number
    remark: string
  }) => Promise<ProtocolReply<void>>

  get_recent_contact: (params: {
    count?: number | string
  }) => Promise<ProtocolReply<{
    lastestMsg: any
    peerUin: string
    remark: string
    msgTime: string
    chatType: number
    msgId: string
    sendNickName: string
    sendMemberName: string
    peerName: string
  }[]>>

  get_rkey: () => Promise<ProtocolReply<{
    type: string
    rkey: string
    created_at: number
    ttl: number
  }[]>>

  get_rkey_server: () => Promise<ProtocolReply<{
    private_rkey: string
    group_rkey: string
    expired_time: number
    name: string
  }>>

  fetch_custom_face: (params: {
    count?: number | string
  }) => Promise<ProtocolReply<string[]>>

  nc_get_user_status: (params: {
    user_id: string | number
  }) => Promise<ProtocolReply<{
    status: number
    ext_status: number
  }>>

  nc_get_rkey: () => Promise<ProtocolReply<{
    key: string
    expired: number
  }[]>>

  get_mini_app_ark: (params: Record<string, any>) => Promise<ProtocolReply<{
    data: { ark: any }
  }>>

  send_packet: (params: {
    cmd: string
    data: string
    rsp?: boolean | string
  }) => Promise<ProtocolReply<string | null>>

  bot_exit: () => Promise<ProtocolReply<void>>

  get_collection_list: (params: {
    category: string
    count?: string
  }) => Promise<ProtocolReply<{
    errCode: number
    errMsg: string
    collectionSearchList: {
      collectionItemList: any[]
      hasMore: boolean
      bottomTimeStamp: string
    }
  }>>

  fetch_emoji_like: (params: {
    message_id: number | string
    emojiId: number | string
    emojiType: number | string
    count?: number | string
    cookie?: string
  }) => Promise<ProtocolReply<{
    emojiLikesList: {
      tinyId: string
      nickName: string
      headUrl: string
    }[]
    cookie: string
    isLastPage: boolean
    isFirstPage: boolean
    result: number
    errMsg: string
  }>>

  get_emoji_likes: (params: {
    group_id?: string
    message_id: string
    emoji_id: string
    emoji_type?: string
    count?: number
  }) => Promise<ProtocolReply<{
    emoji_like_list: {
      user_id: string
      nick_name: string
    }[]
  }>>

  ArkShareGroup: (params: {
    group_id: string
  }) => Promise<ProtocolReply<string>>

  ArkSharePeer: (params: {
    user_id?: string
    group_id?: string
    phone_number?: string
  }) => Promise<ProtocolReply<{ ark: any }>>

  click_inline_keyboard_button: (params: {
    group_id: string
    bot_appid: string
    button_id?: string
    callback_data?: string
    msg_seq?: string
  }) => Promise<ProtocolReply<void>>

  move_group_file: (params: {
    group_id: string
    file_id: string
    current_parent_directory: string
    target_parent_directory: string
  }) => Promise<ProtocolReply<{ ok: boolean }>>

  rename_group_file: (params: {
    group_id: string
    file_id: string
    current_parent_directory: string
    new_name: string
  }) => Promise<ProtocolReply<{ ok: boolean }>>

  trans_group_file: (params: {
    group_id: string
    file_id: string
  }) => Promise<ProtocolReply<{ ok: boolean }>>

  create_flash_task: (params: {
    files: string[] | string
    name?: string
    thumb_path?: string
  }) => Promise<ProtocolReply<{ task_id: string }>>

  get_flash_file_list: (params: {
    fileset_id: string
  }) => Promise<ProtocolReply<{
    file_name: string
    size: number
  }[]>>

  get_flash_file_url: (params: {
    fileset_id: string
    file_name?: string
    file_index?: number
  }) => Promise<ProtocolReply<{ url: string }>>

  send_flash_msg: (params: {
    fileset_id: string
    user_id?: string
    group_id?: string
  }) => Promise<ProtocolReply<{ message_id: number }>>

  get_share_link: (params: {
    fileset_id: string
  }) => Promise<ProtocolReply<string>>

  get_fileset_info: (params: {
    fileset_id: string
  }) => Promise<ProtocolReply<{
    fileset_id: string
    file_list: any[]
  }>>

  get_online_file_msg: (params: {
    user_id: string
  }) => Promise<ProtocolReply<void>>

  send_online_file: (params: {
    user_id: string
    file_path: string
    file_name?: string
  }) => Promise<ProtocolReply<void>>

  send_online_folder: (params: {
    user_id: string
    folder_path: string
    folder_name?: string
  }) => Promise<ProtocolReply<void>>

  receive_online_file: (params: {
    user_id: string
    msg_id: string
    element_id: string
  }) => Promise<ProtocolReply<void>>

  refuse_online_file: (params: {
    user_id: string
    msg_id: string
    element_id: string
  }) => Promise<ProtocolReply<void>>

  cancel_online_file: (params: {
    user_id: string
    msg_id: string
  }) => Promise<ProtocolReply<void>>

  download_fileset: (params: {
    fileset_id: string
  }) => Promise<ProtocolReply<void>>

  get_fileset_id: (params: {
    share_code: string
  }) => Promise<ProtocolReply<{ fileset_id: string }>>

  get_friends_with_category: () => Promise<ProtocolReply<{
    categoryId: number
    categoryName: string
    categoryMbCount: number
    buddyList: any[]
  }[]>>

  get_profile_like: (params: {
    user_id: string
    start?: number | string
    count?: number | string
  }) => Promise<ProtocolReply<{
    uid: string
    time: string
    favoriteInfo: any
    voteInfo: any
  }>>

  set_diy_online_status: (params: {
    face_id: number | string
    face_type: number | string
    wording: string
  }) => Promise<ProtocolReply<string>>

  get_unidirectional_friend_list: () => Promise<ProtocolReply<{
    uin: number
    uid: string
    nick_name: string
    age: number
    source: string
  }[]>>

  get_guild_list: () => Promise<ProtocolReply<{
    guild_id: string
    guild_name: string
  }[]>>

  get_guild_service_profile: (params: {
    guild_id: string
  }) => Promise<ProtocolReply<{
    guild_id: string
    guild_name: string
    guild_display_id: string
  }>>

  get_ai_record: (params: {
    character: string
    group_id: string
    text: string
  }) => Promise<ProtocolReply<string>>

  send_group_ai_record: (params: {
    character: string
    group_id: string
    text: string
  }) => Promise<ProtocolReply<void>>

  set_group_remark: (params: {
    group_id: number | string
    remark: string
  }) => Promise<ProtocolReply<void>>

  get_group_ignored_notifies: (params?: {
    group_id?: number | string
  }) => Promise<ProtocolReply<{
    invited_requests?: any[]
    InvitedRequest?: any[]
    join_requests?: any[]
  }>>

  _del_group_notice: (params: {
    group_id: number | string
    notice_id: string
  }) => Promise<ProtocolReply<void>>

  get_group_shut_list: (params: {
    group_id: number | string
  }) => Promise<ProtocolReply<{
    user_id: number
    nickname: string
    shut_up_time: number
  }[]>>

  set_input_status: (params: {
    user_id: number | string
    event_type: number
  }) => Promise<ProtocolReply<void>>

  set_qq_profile: (params: {
    nickname: string
    personal_note?: string
    sex?: number | string
  }) => Promise<ProtocolReply<void>>

  get_group_root_files: (params: {
    group_id: number | string
    file_count?: number
  }) => Promise<ProtocolReply<{
    files: any[]
    folders: any[]
  }>>

  check_url_safely: (params: {
    url: string
  }) => Promise<ProtocolReply<{
    level: number
  }>>

  get_group_at_all_remain: (params: {
    group_id: number | string
  }) => Promise<ProtocolReply<{
    can_at_all: boolean
    remain_at_all_count_for_group: number
    remain_at_all_count_for_uin: number
  }>>

  send_forward_msg: (params: {
    message_type?: 'private' | 'group'
    user_id?: number | string
    group_id?: number | string
    message: any
    auto_escape?: boolean
    source?: string
    news?: any[]
    summary?: string
    prompt?: string
  }) => Promise<ProtocolReply<{
    message_id: number
    res_id: string
    forward_id: string
  }>>

  send_private_forward_msg: (params: {
    user_id: number | string
    message: any
    auto_escape?: boolean
    source?: string
    news?: any[]
    summary?: string
    prompt?: string
  }) => Promise<ProtocolReply<{
    message_id: number
    res_id: string
    forward_id: string
  }>>

  download_file: (params: {
    url: string
    base64?: string
    name?: string
    headers?: string | string[]
  }) => Promise<ProtocolReply<{
    file: string
  }>>

  get_friend_msg_history: (params: {
    user_id: number | string
    message_seq?: number | string
    count?: number
    reverse_order?: boolean
    disable_get_url?: boolean
    parse_mult_msg?: boolean
    quick_reply?: boolean
  }) => Promise<ProtocolReply<{
    messages: any[]
  }>>

  set_group_portrait: (params: {
    group_id: number | string
    file: string
  }) => Promise<ProtocolReply<{
    result: number
    errMsg: string
  }>>

  _get_model_show: (params: {
    model: string
  }) => Promise<ProtocolReply<{
    variants: {
      model_show: string
      need_pay: boolean
    }[]
  }>>

  _set_model_show: (params: {
    model: string
    model_show: string
  }) => Promise<ProtocolReply<void>>

  delete_group_file: (params: {
    group_id: number | string
    file_id: string
  }) => Promise<ProtocolReply<void>>

  create_group_file_folder: (params: {
    group_id: number | string
    folder_name: string
    name?: string
  }) => Promise<ProtocolReply<{
    result: any
    groupItem: any
  }>>

  delete_group_folder: (params: {
    group_id: number | string
    folder_id: string
  }) => Promise<ProtocolReply<void>>

  get_group_file_system_info: (params: {
    group_id: number | string
  }) => Promise<ProtocolReply<{
    file_count: number
    limit_count: number
    used_space: number
    total_space: number
  }>>

  get_group_files_by_folder: (params: {
    group_id: number | string
    folder_id: string
    file_count?: number
  }) => Promise<ProtocolReply<{
    files: any[]
    folders: any[]
  }>>

  forward_friend_single_msg: (params: {
    message_id: number | string
    group_id?: number | string
    user_id: number | string
  }) => Promise<ProtocolReply<void>>

  forward_group_single_msg: (params: {
    message_id: number | string
    group_id: number | string
    user_id?: number | string
  }) => Promise<ProtocolReply<void>>

  mark_group_msg_as_read: (params: {
    user_id?: number | string
    group_id: number | string
    message_id?: number | string
  }) => Promise<ProtocolReply<void>>

  mark_private_msg_as_read: (params: {
    user_id: number | string
    group_id?: number | string
    message_id?: number | string
  }) => Promise<ProtocolReply<void>>

  _mark_all_as_read: () => Promise<ProtocolReply<void>>

  send_poke: (params: {
    user_id: number | string
    group_id?: number | string
    target_id?: number | string
  }) => Promise<ProtocolReply<void>>

  upload_file_stream: (params: {
    stream_id: string
    chunk_data?: string
    chunk_index?: number
    total_chunks?: number
    file_size?: number
    expected_sha256?: string
    is_complete?: boolean
    filename?: string
    reset?: boolean
    verify_only?: boolean
    file_retention?: number
  }) => Promise<ProtocolReply<{
    type: string
    stream_id: string
    status: string
    received_chunks: number
    total_chunks: number
  }>>
}

export interface ClientStreamMethods {
  download_file_record_stream: (params: {
    file: string
    file_id?: string
    chunk_size?: number
    out_format?: string
  }) => Promise<ConnectionStreamResult<ProtocolReplyStreamResponse<{ file: string }>>>

  download_file_image_stream: (params: {
    file: string
    file_id?: string
    chunk_size?: number
  }) => Promise<ConnectionStreamResult<ProtocolReply<{ file: string }>>>

  test_download_stream: (params: {
    error?: boolean
  }) => Promise<ConnectionStreamResult<ProtocolReply<{ success: boolean }>>>

  download_file_stream: (params: {
    file: string
    file_id?: string
    chunk_size?: number
  }) => Promise<ConnectionStreamResult<ProtocolReply<{
    type: string
    data_type: string
    file_name: string
    file_size: number
  }>>>
}

export function sendRequest<const T extends keyof ClientMethods>(
  conn: Connection,
  method: T,
  ...params: Parameters<ClientMethods[T]>
): ReturnType<ClientMethods[T]> {
  return conn.request(method, params[0]) as any
}

export function sendRequestStream<const T extends keyof ClientStreamMethods>(
  conn: Connection,
  method: T,
  ...params: Parameters<ClientStreamMethods[T]>
): ReturnType<ClientStreamMethods[T]> {
  return conn.request(method, params[0], true) as any
}

export type SendRequestResult<T extends keyof ClientMethods> = Awaited<ReturnType<ClientMethods[T]>>
export type SendRequestStreamResult<T extends keyof ClientStreamMethods> = Awaited<ReturnType<ClientStreamMethods[T]>>
