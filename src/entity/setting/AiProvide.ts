import BaseEntity from '@/entity/Base'

export interface AiModel {
  // 标识符
  identifier: string
  // 模型模型
  name: string
  // 是否支持思考
  thinking: boolean
  // 如果支持思考，思考深度
  thinkingDepth: 'high' | 'max'
}

export interface AiProvideCore {
  // 提供方名称
  name: string
  // 提供方名称
  baseUrl: string
  // 提供方密钥
  key: string

  models: Array<AiModel>
}

export interface AiProvide extends BaseEntity, AiProvideCore {}

export interface AiProvideForm extends AiProvideCore {
  id?: string
}
