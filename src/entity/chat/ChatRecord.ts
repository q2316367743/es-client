import Base from '@/entity/Base'

/**
 * 聊天记录
 */
export interface ChatRecord extends Base {
  // 记录名字，默认取第一次对话的前 10 个字符
  name: string
}
