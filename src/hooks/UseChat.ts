import OpenAI from 'openai'
import type {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionTool,
  ChatCompletionMessageToolCall
} from 'openai/resources/chat/completions'
import type { AIMessageContent, ChatMessagesData } from '@tdesign-vue-next/chat'
import { toDateString } from '@/utils/lang'

// ==========================================
//  类型导出
// ==========================================

export type SSEChunkData = {
  event?: string
  data: unknown
}
export type ToolCall = {
  toolCallId: string
  toolCallName: string
  parentMessageId?: string
  args?: string
  chunk?: string
  result?: string
}

export interface ChatRequestParams {
  content: string
  model: string
  thinking?: 'enabled' | 'disabled'
  reasoning_effort?: 'high' | 'max'
}

export interface ChatServiceConfig {
  baseURL: string
  apiKey?: string
  stream?: boolean
  retryInterval?: number
  maxRetries?: number
  timeout?: number
  onRequest?: (
    params: ChatRequestParams
  ) => (ChatRequestParams & RequestInit) | Promise<ChatRequestParams & RequestInit>
  onStart?: (chunk: string) => void
  isValidChunk?: (chunk: SSEChunkData) => boolean
  onComplete?: (
    isAborted: boolean,
    params?: ChatRequestParams,
    result?: unknown
  ) => AIMessageContent | AIMessageContent[] | void
  onAbort?: () => Promise<void>
  onError?: (err: Error | Response) => void
}

export type ChatServiceConfigSetter =
  | ChatServiceConfig
  | ((param: ChatServiceConfig) => ChatServiceConfig)

export type ChatMessageStatus = 'pending' | 'streaming' | 'complete' | 'stop' | 'error'
export type ChatStatus = 'idle' | ChatMessageStatus
export type ChatMessageSetterMode = 'replace' | 'prepend' | 'append'

interface ToolFunctionProperty {
  type: string
  description: string
  enum?: Array<string>
}

export interface ToolFunction {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, ToolFunctionProperty>
    required?: Array<string>
    additionalProperties?: boolean
  }
  handler: (...params: unknown[]) => Promise<unknown>
}

export interface UseChatOptions {
  defaultMessages?: Array<ChatMessagesData>
  chatServiceConfig?: ChatServiceConfig
  functions?: Array<ToolFunction>
}

export interface UseChatResult {
  messages: Ref<ChatMessagesData[]>
  status: Ref<ChatStatus>
  destroy: () => void
  init: (configSetter: ChatServiceConfigSetter, initialMessages?: ChatMessagesData[]) => void
  sendUserMessage: (requestParams: ChatRequestParams) => Promise<void>
  sendSystemMessage: (msg: string) => Promise<void>
  sendAIMessage: (options?: {
    params?: ChatRequestParams
    content?: AIMessageContent[]
    sendRequest?: boolean
  }) => Promise<void>
  abortChat: () => Promise<void>
  setMessages: (messages: ChatMessagesData[], mode?: ChatMessageSetterMode) => void
  clearMessages: () => void
  getToolcallByName: (name: string) => ToolCall | undefined
}

// ==========================================
//  实现
// ==========================================

export const useChat = (options: UseChatOptions): UseChatResult => {
  const messages = ref<ChatMessagesData[]>([...(options.defaultMessages ?? [])])
  const status = ref<ChatStatus>('idle')
  const toolCalls = ref<ToolCall[]>([])

  let config: ChatServiceConfig = { ...(options.chatServiceConfig ?? { baseURL: '' }) }
  let abortController: AbortController | null = null
  let requestSeq = 0
  let openaiClient: OpenAI | null = null

  const genId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

  function createClient(): OpenAI {
    if (!openaiClient) {
      openaiClient = new OpenAI({
        baseURL: config.baseURL,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
      })
    }
    return openaiClient
  }

  // ========================
  //   toApiMessages
  // ========================

  function toApiMessages(): ChatCompletionMessageParam[] {
    const out: ChatCompletionMessageParam[] = []

    for (const msg of messages.value) {
      if (msg.role === 'user') {
        const textParts = msg.content.filter((c) => c.type === 'text') as {
          data: string
        }[]
        const userContent: string = textParts.map((t) => t.data).join('') || ''
        out.push({ role: 'user', content: userContent })
      } else if (msg.role === 'system') {
        const firstText = msg.content.find((c) => c.type === 'text')
        out.push({
          role: 'system',
          content: (firstText as { data: string } | undefined)?.data ?? ''
        })
      } else if (msg.role === 'assistant') {
        const parts = msg.content ?? []
        const pendingTCs: Array<{
          id: string
          name: string
          args: string
          result: string | undefined
        }> = []
        // 收集 thinking 内容 —— DeepSeek 文档要求：工具调用场景下必须将
        // reasoning_content 回传 API，否则 AI 丢失思考上下文会陷入循环
        let thinkingBuffer = ''

        const flushTCs = () => {
          // 无工具调用但存在 reasoning_content：附加到最后一条 assistant 消息
          if (pendingTCs.length === 0) {
            if (thinkingBuffer) {
              const lastMsg = out[out.length - 1]
              if (lastMsg && lastMsg.role === 'assistant') {
                ;(lastMsg as unknown as Record<string, unknown>).reasoning_content =
                  thinkingBuffer.trim()
              } else {
                out.push({
                  role: 'assistant',
                  content: '',
                  ...({ reasoning_content: thinkingBuffer.trim() } as unknown as Record<
                    string,
                    unknown
                  >)
                } as unknown as ChatCompletionMessageParam)
              }
              thinkingBuffer = ''
            }
            return
          }
          const tcMsg: ChatCompletionMessageParam = {
            role: 'assistant',
            content: null,
            tool_calls: pendingTCs.map(
              (tc): ChatCompletionMessageToolCall => ({
                id: tc.id,
                type: 'function',
                function: { name: tc.name, arguments: tc.args }
              })
            )
          }
          // 工具调用时将思考内容以 reasoning_content 回传
          if (thinkingBuffer) {
            ;(tcMsg as unknown as Record<string, unknown>).reasoning_content = thinkingBuffer.trim()
            thinkingBuffer = ''
          }
          out.push(tcMsg)
          for (const tc of pendingTCs) {
            out.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: tc.result ?? ''
            })
          }
          pendingTCs.length = 0
        }

        for (const part of parts) {
          if (part.type === 'thinking') {
            // think 工具内容不回传
            if (part.ext?.source === 'tool') continue
            // 收集 reasoning_content，后续 flushTCs 时作为 reasoning_content 回传
            thinkingBuffer += ((part.data as { text?: string })?.text || '') + '\n'
            continue
          }

          if (part.type === 'toolcall') {
            // think 是内部 UI 展示工具，不回传给 API
            if (part.data.toolCallName === 'think') continue
            pendingTCs.push({
              id: part.data.toolCallId,
              name: part.data.toolCallName,
              args: part.data.args ?? '{}',
              result: part.data.result
            })
            continue
          }

          flushTCs()
          if (part.type === 'markdown' || part.type === 'text') {
            out.push({ role: 'assistant', content: part.data as string })
          }
        }

        flushTCs()
      }
    }

    return out
  }

  // ========================
  //   buildTools
  // ========================

  function buildTools(): ChatCompletionTool[] {
    const tools: ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'think',
          description: '记录你的思考过程。当不存在思考内容且需要一步步推理复杂问题时使用此工具。',
          parameters: {
            type: 'object',
            properties: {
              thought: {
                type: 'string',
                description: '当前的思考内容'
              }
            },
            required: ['thought']
          }
        }
      }
    ]
    if (options.functions) {
      for (const fn of options.functions) {
        tools.push({
          type: 'function',
          function: fn
        })
      }
    }
    return tools
  }

  // ========================
  //   extractReasoningContent
  // ========================

  function extractReasoningContent(delta: ChatCompletionChunk.Choice.Delta): string | undefined {
    return (delta as Record<string, unknown>).reasoning_content as string | undefined
  }

  // ========================
  //   finishReasonToStatus
  // ========================

  function finishReasonToStatus(reason: string | null | undefined): ChatMessageStatus {
    if (reason === 'stop') return 'complete'
    if (reason === 'length') return 'stop'
    return 'streaming'
  }

  // ========================
  //   doStreamRequest
  // ========================

  function handleMessageContent(mc: AIMessageContent, append = true) {
    const last = messages.value[messages.value.length - 1]
    if (!last) return
    if (last.role !== 'assistant') return
    const { content = [] } = last
    if (append) {
      // 最后一个
      const l1 = content[content.length - 1]
      if (!l1) {
        content.push(mc)
        return
      }
      if (l1.type === mc.type) {
        // 一样的
        if (
          (l1.type === 'text' && mc.type === 'text') ||
          (l1.type === 'markdown' && mc.type === 'markdown')
        ) {
          l1.data += mc.data
          return
        } else if (l1.type === 'reasoning' && mc.type === 'reasoning') {
          // 推理过程，加一个
          l1.data.push(...mc.data)
          return
        } else if (l1.type === 'thinking' && mc.type === 'thinking') {
          l1.data.title = '思考中'
          l1.data.text = (l1.data.text || '') + mc.data.text
          return
        }
      }
    }
    // 其他类型/不一样类型，直接拼一个
    content.push(mc)
    const l2 = content[content.length - 2]
    if (!l2) return
    l2.status = 'complete'
    if (l2.type === 'thinking') {
      l2.data.title = '思考完成'
    }
  }

  function handleLastMessage(status: ChatMessageStatus) {
    const last = messages.value[messages.value.length - 1]
    if (last) {
      last.status = status
      if (last.role === 'assistant') {
        if (last.content) {
          const l = last.content[last.content.length - 1]
          if (l) {
            l.status = status
          }
        }
      }
    }
  }

  async function doStreamRequest(
    params: ChatRequestParams,
    aiIndex: number,
    signal: AbortSignal,
    seq: number
  ): Promise<void> {
    const apiMessages = toApiMessages()
    const tools = buildTools()

    // 构建请求体（标准字段）
    const body: ChatCompletionCreateParamsStreaming = {
      model: params.model,
      messages: apiMessages,
      stream: true,
      tools
    }

    // DeepSeek 自定义参数（通过类型断言注入）
    const isDeepseek = params.model.toLowerCase().includes('deepseek')
    const extras: Record<string, unknown> = {}
    if (isDeepseek) {
      if (params.thinking === 'enabled') {
        extras.thinking = { type: 'enabled' }
      }
      if (params.reasoning_effort) {
        extras.reasoning_effort = params.reasoning_effort
      }
    }

    const finalBody = { ...body, ...extras } as ChatCompletionCreateParamsStreaming

    // onRequest 钩子
    let requestHeaders: Record<string, string> = {}
    if (config.onRequest) {
      const modified = await config.onRequest(params)
      if (modified) {
        const m = modified as unknown as Record<string, unknown>
        if (m.body) {
          // 如果 onRequest 改写了 body，用改写后的 body
          Object.assign(finalBody, m.body)
        }
        if (m.headers) {
          requestHeaders = m.headers as Record<string, string>
        }
      }
    }

    // 状态切换
    if (status.value !== 'streaming') {
      status.value = 'streaming'
    }
    config.onStart?.('')

    const client = createClient()

    // 发送消息
    const stream = await client.chat.completions.create(finalBody, {
      signal,
      headers: requestHeaders
    })

    messages.value[messages.value.length - 1].status = 'streaming'

    // 流式累积
    const accToolCalls: Map<number, { id: string; name: string; args: string }> = new Map()
    let finishReason: string | null | undefined

    for await (const chunk of stream) {
      if (seq !== requestSeq) return

      const choice = chunk.choices?.[0]
      if (!choice) continue

      const delta = choice.delta
      finishReason = choice.finish_reason

      const sseChunk: SSEChunkData = { data: chunk, event: 'data' }

      if (config.isValidChunk && !config.isValidChunk(sseChunk)) continue

      // reasoning_content —— 取 content 最后一项，type 匹配就追加 data，否则 push
      const reasoningContent = extractReasoningContent(delta)
      if (reasoningContent) {
        handleMessageContent({
          type: 'thinking',
          data: { text: reasoningContent },
          status: 'streaming'
        })
        continue
      }

      // content —— 取 content 最后一项，type 匹配就替换 data，否则 push
      if (delta.content) {
        handleMessageContent({
          type: 'markdown',
          data: delta.content,
          status: 'streaming'
        })
      }

      // tool_calls
      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          const index = tc.index
          if (!accToolCalls.has(index)) {
            accToolCalls.set(index, { id: '', name: '', args: '' })
          }
          const entry = accToolCalls.get(index)!
          if (tc.id) entry.id = tc.id
          if (tc.function?.name) entry.name = tc.function.name
          if (tc.function?.arguments) entry.args += tc.function.arguments
        }
      }
    }

    if (seq !== requestSeq) return

    const finalStatus = finishReasonToStatus(finishReason)

    // === 处理工具调用 ===
    if (accToolCalls.size > 0) {
      const metaList: ToolCall[] = []
      for (const [, tc] of accToolCalls) {
        const id = tc.id || `call_${genId()}`
        const meta: ToolCall = {
          toolCallId: id,
          toolCallName: tc.name,
          args: tc.args
        }
        metaList.push(meta)
      }

      toolCalls.value = metaList

      // 逐个执行工具
      for (const meta of metaList) {
        if (meta.toolCallName === 'think') {
          let thought = ''
          try {
            thought = (JSON.parse(meta.args ?? '{}') as { thought?: string }).thought ?? ''
          } catch {
            thought = meta.args ?? ''
          }
          meta.result = `💭 ${thought}`
          handleMessageContent({
            type: 'thinking',
            data: { text: thought, title: '思考完成' },
            ext: { source: 'tool' }
          })
        } else {
          const fnDef = options.functions?.find((f) => f.name === meta.toolCallName)
          if (fnDef) {
            try {
              const args = JSON.parse(meta.args ?? '{}')
              const result = await fnDef.handler(args)
              meta.result = typeof result === 'string' ? result : JSON.stringify(result)
            } catch (err: unknown) {
              meta.result = `错误: ${err instanceof Error ? err.message : String(err)}`
            }
            handleMessageContent({
              type: 'toolcall',
              status: 'complete',
              data: {
                toolCallId: meta.toolCallId,
                toolCallName: meta.toolCallName,
                args: meta.args,
                result: meta.result
              }
            })
          }
        }
      }

      toolCalls.value = [...toolCalls.value]

      // 让 Vue flush DOM 更新，确保上一轮内容已渲染
      await nextTick()

      // 多轮递归，让 Vue flush DOM 更新，确保上一轮内容已渲染
      await doStreamRequest(params, aiIndex, signal, seq)
      return
    }

    // === 正常完成 ===

    status.value = finalStatus
    config.onComplete?.(false, params)
  }

  // ========================
  //   公开 API
  // ========================

  async function sendUserMessage(requestParams: ChatRequestParams): Promise<void> {
    if (status.value !== 'idle' && status.value !== 'complete' && status.value !== 'error') return

    requestSeq++
    const seq = requestSeq
    abortController = new AbortController()
    toolCalls.value = []
    status.value = 'pending'

    const userMsg: ChatMessagesData = {
      id: genId(),
      role: 'user',
      content: [
        {
          type: 'text',
          data: requestParams.content,
          status: 'complete'
        } as AIMessageContent
      ]
    } as unknown as ChatMessagesData
    messages.value = [...messages.value, userMsg]

    messages.value.push({
      role: 'assistant',
      content: [],
      status: 'pending',
      datetime: toDateString(null),
      id: genId()
    })
    const aiIndex = messages.value.length - 1

    try {
      await doStreamRequest(requestParams, aiIndex, abortController.signal, seq)
      // ====== 正常完成 ======
      handleLastMessage('complete')
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        status.value = 'stop'
        config.onComplete?.(true, requestParams)
        handleLastMessage('stop')
      } else {
        status.value = 'error'
        config.onError?.(err instanceof Error ? err : new Error(String(err)))
        handleMessageContent(
          {
            type: 'text',
            data: err instanceof Error ? err.message : String(err)
          },
          true
        )
        handleLastMessage('error')
      }
    }
  }

  async function sendSystemMessage(msg: string): Promise<void> {
    const sysMsg: ChatMessagesData = {
      id: genId(),
      role: 'system',
      content: [
        {
          type: 'text',
          data: msg,
          status: 'complete'
        } as AIMessageContent
      ]
    } as unknown as ChatMessagesData
    messages.value.push(sysMsg)
  }

  async function sendAIMessage(opts?: {
    params?: ChatRequestParams
    content?: AIMessageContent[]
    sendRequest?: boolean
  }): Promise<void> {
    const aiMsg: ChatMessagesData = {
      id: genId(),
      role: 'assistant',
      content: opts?.content ?? [],
      status: 'complete'
    } as unknown as ChatMessagesData
    messages.value.push(aiMsg)

    if (opts?.sendRequest && opts?.params) {
      requestSeq++
      const seq = requestSeq
      abortController = new AbortController()
      toolCalls.value = []
      status.value = 'pending'

      const aiIndex = messages.value.length - 1
      const msg = messages.value[aiIndex]
      if (msg.role === 'assistant') {
        ;(msg as unknown as { status: string }).status = 'pending'
      }

      try {
        await doStreamRequest(opts.params, aiIndex, abortController.signal, seq)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          status.value = 'stop'
          config.onComplete?.(true, opts.params)
        } else {
          status.value = 'error'
          config.onError?.(err instanceof Error ? err : new Error(String(err)))
        }
      }
    }
  }

  async function abortChat(): Promise<void> {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    status.value = 'stop'
    await config.onAbort?.()
  }

  function destroy(): void {
    abortChat().catch((e) => console.error('终止失败', e))
    messages.value = []
    status.value = 'idle'
    toolCalls.value = []
  }

  function init(configSetter: ChatServiceConfigSetter, initialMessages?: ChatMessagesData[]): void {
    config =
      typeof configSetter === 'function'
        ? (configSetter as (param: ChatServiceConfig) => ChatServiceConfig)({
            ...config
          })
        : { ...config, ...configSetter }
    openaiClient = null
    if (initialMessages) messages.value = [...initialMessages]
  }

  function setMessages(
    newMessages: ChatMessagesData[],
    mode: ChatMessageSetterMode = 'replace'
  ): void {
    if (mode === 'replace') messages.value = [...newMessages]
    else if (mode === 'prepend') messages.value = [...newMessages, ...messages.value]
    else messages.value = [...messages.value, ...newMessages]
  }

  function clearMessages(): void {
    messages.value = []
  }

  function getToolcallByName(name: string): ToolCall | undefined {
    return toolCalls.value.find((tc) => tc.toolCallName === name)
  }

  return {
    messages: messages as Ref<ChatMessagesData[]>,
    status: status as Ref<ChatStatus>,
    destroy,
    init,
    sendUserMessage,
    sendSystemMessage,
    sendAIMessage,
    abortChat,
    setMessages,
    clearMessages,
    getToolcallByName
  }
}
