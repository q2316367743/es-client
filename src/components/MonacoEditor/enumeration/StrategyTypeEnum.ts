/**
 * 策略类型：
 * 1. 新增文档，更新文档
 * 2. 新建文档
 * 3. 搜索文档
 */
enum StrategyTypeEnum {
    DEFAULT = 'default',
    ADD = '_doc',
    NEW = '',
    SEARCH = '_search'
}

export default StrategyTypeEnum;