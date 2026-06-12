const LocalNameEnum = {
  KEY_LAST_URL: '/key/last-url',

  KEY_VERSION: '/key/version',

  KEY_THEME: '/key/theme',

  KEY_SENIOR_SEARCH_VIEW: '/key/senior-search/view',

  KEY_TOKEN: '/key/token',

  KEY_SENIOR_SEARCH_EDITOR: '/key/senior-search/editor',

  KEY_PRIVACY_ENABLE: '/key/privacy/enable',

  KEY_PRIVACY_PLATFORM: '/key/privacy/platform',

  KEY_PRIVACY_SYSTEM: '/key/privacy/system',

  KEY_PRIVACY_ES_VERSION: '/key/privacy/es/version',

  KEY_DEV_TOOL_SIZE: '/key/dev-tool/size',

  KEY_DEV_TOOL_EXPENDED: '/key/dev-tool/expended',

  KEY_CHAT_SIZE: '/key/chat/size',

  KEY_COLLAPSED: '/key/collapsed',

  KEY_LOCAL: '/key/local',

  DB_URL: '/db/url',

  DB_BASE_SEARCH_HISTORY: '/db/base-search-history',

  /**
   * 设置 - 全局
   */
  SETTING_GLOBAL: '/setting/global',

  /**
   * 设置 - 编辑器
   */
  SETTING_EDITOR: '/setting/editor',

  /**
   * 设置 - 数据浏览
   */
  SETTING_DATA_BROWSE: '/setting/data-browse',

  /**
   * 设置 - 基础搜索
   */
  SETTING_BASE_SEARCH: '/setting/base-search',

  /**
   * 设置 - 高级过滤器
   */
  SETTING_SENIOR_FILTER: '/setting/senior-filter',

  /**
   * 设置 - 备份
   */
  SETTING_BACKUP: '/setting/backup',

  /**
   * 记录 - 高级查询
   * /record/senior-search
   */
  INDEX_SENIOR_SEARCH_HISTORY: '/index/senior-search-history',

  /**
   * 记录 - 高级查询
   * /record/senior-search/${id}
   */
  RECORD_SENIOR_SEARCH_HISTORY: '/record/senior-search-history/',

  /**
   * 数据浏览 - 视图
   * /item/data-browser/view/${urlId}
   */
  ITEM_DATA_BROWSER_VIEW: '/item/data-browser/view',

  /**
   * 数据浏览 - 查询列表
   * /list/data-browser/query/${urlId}
   */
  LIST_DATA_BROWSER_QUERY: '/list/data-browser/query',

  /**
   * 数据浏览 - 查询项
   * /item/data-browser/query/${id}
   */
  ITEM_DATA_BROWSER_QUERY: '/item/data-browser/query',

  /**
   * 开发工具 - 文件列表
   * /list/dev-tool/file-item/${urlId}
   */
  LIST_DEV_TOOL_FILE_ITEM: '/list/dev-tool/file-item',

  /**
   * 开发工具 - 文件项
   * /item/dev-tool/file-item/${id}
   */
  ITEM_DEV_TOOL_FILE_ITEM: '/item/dev-tool/file-item',

  /**
   * AI 提供者列表
   */
  LIST_SETTING_AI_PROVIDE: '/list/setting/ai-provide',

  LIST_CHAT_RECORD: (id: string) => `/list/chat/record/${id}`,

  ITEM_CHAT_RECORD: (id: string)=>`/item/chat/record/${id}`,

  /**
   * 页面 - 数据浏览 - 大小
   * /page/data-browser/size
   */
  PAGE_DATA_BROWSER_SIZE: '/page/data-browser/size',

  /**
   * 页面 - 高级查询 - 大小
   * /page/senior-search/size
   */
  PAGE_SENIOR_SEARCH_SIZE: '/page/senior-search/size',

  PAGE_CHAT2ES_ACTIVE: '/page/chat2es/active',

  /**
   * 页面 - 高级查询 - 大小
   * /value/senior-search/split-size'
   * @deprecated 已不再使用，请使用 VALUE_SENIOR_SEARCH_SPLIT_PANEL_SIZE
   */
  VALUE_SENIOR_SEARCH_SPLIT_SIZE: '/value/senior-search/split-size',

  /**
   * 页面 - 高级查询 - 大小
   * /value/senior-search/split-panel-size'
   */
  VALUE_SENIOR_SEARCH_SPLIT_PANEL_SIZE: '/value/senior-search/split-panel-size',

  PAGE_CHAT_MODEL: '/page/chat/model',

  ITEM_SOURCE_AI: (id: string) => `/item/source/ai/${id}`
}

export default LocalNameEnum
