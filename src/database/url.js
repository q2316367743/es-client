import db from "@/plugins/dexie";

/**
 * 返回前十条数据
 */
export default {
    async list(limit) {
        return await db.url_history.limit(limit).toArray();
    },
    async page(page, limit) {
        return await db.url_history.offset((page - 1) * limit).limit(limit).toArray();
    },
    /**
     * 存储一个字段
     */
    async save(value) {
        let count = await db.url_history.where('value').equals(value).count();
        if (count > 0) {
            console.log('重复数据');
            return;
        }
        console.log('插入');
        db.url_history.add({
            value: value,
            time: new Date().getTime(),
            is_top: 0
        })
    }
}