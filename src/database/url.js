import db from "@/plugins/dexie";

/**
 * 返回前十条数据
 */
export default {
    async list(limit) {
        return db.url_history.orderBy('is_top').limit(limit).reverse().toArray();
    },
    async page(page, limit) {
        return db.url_history.orderBy('is_top').offset((page - 1) * limit).limit(limit).reverse().toArray();
    },
    count() {
        return db.url_history.count();
    },
    /**
     * 存储一个字段
     */
    save(value) {
        db.url_history.put({
            value: value,
            time: new Date().getTime(),
            is_top: 0
        })
    },
    async update(record) {
        await db.url_history.put(record)
    },
    async remove(id) {
        await db.url_history.where('id').equals(id).delete();
    }
}