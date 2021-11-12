import Dexie from 'dexie'
// 创建数据库
const db = new Dexie("es_client");

// 数据库版本
db.version(1).stores({
    // url历史
    url_history: '++id, value, is_top, time',
    // 高级查询的参数
    senior_param: '++id, value, time'
});

export default db;