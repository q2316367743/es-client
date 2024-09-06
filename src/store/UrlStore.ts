import {defineStore} from "pinia";
import {useTitle} from "@vueuse/core";

import {Url} from "@/entity/Url";

import {map} from "@/utils/ArrayUtil";
import {listByAsync, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref, toRaw} from "vue";
import {statistics} from "@/global/BeanFactory";

const title = useTitle();

const useUrlStore = defineStore('url', () => {
    // state
    const urls = ref<Array<Url>>([]);
    const rev = ref<string | undefined>(undefined);
    const url = ref<Url | undefined>(undefined);

    // getters
    const urlMap = computed(() => map(urls.value, 'id'));
    const list = computed(() => urls.value);
    const current = computed(() => url.value && url.value.value ? url.value.value! : '');
    const id = computed(() => url.value ? url.value.id! : undefined);
    const empty = computed(() => url.value === undefined);

    // actions
    const init = async () => {
        const res = await listByAsync<Url>(LocalNameEnum.DB_URL);
        urls.value = res.list.sort((a, b) => b.sequence! - a.sequence!);
        rev.value = res.rev;
    };

    init();

    const choose = (id: number): boolean => {
        // 查询URL
        const targetUrl = urls.value.find(e => e.id! === id);
        if (!targetUrl) {
            return false;
        }
        // 统计用户使用的es版本
        statistics.access("es_version", targetUrl.version);
        setItem(LocalNameEnum.KEY_LAST_URL, id);
        url.value = targetUrl;
        title.value = targetUrl.name || 'es-client';
        return true;
    };

    const clear = () => {
        url.value = undefined;
        title.value = 'es-client';
    };

    const add = async (record: Omit<Url, 'id' | 'createTime' | 'updateTime'>) => {
        const now = new Date();
        const id = now.getTime();
        urls.value.push({
            ...record,
             id,
             createTime: now,
             updateTime: now
        });
        await _sync();
    };

    const addByBatch = async (records: Array<Omit<Url, 'id' | 'createTime' | 'updateTime'>>) => {
        const now = new Date();
        const id = now.getTime();
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            urls.value.push({
                ...record,
                 id: id + i,
                 createTime: now,
                 updateTime: now
            });
        }
        await _sync();
    };

    const update = async (id: number, record: Partial<Url>) => {
        const index = urls.value.findIndex(e => e.id === id);
        if (index === -1) {
            return Promise.reject(`存储【${id}】不存在`);
        }
        const now = new Date();
        urls.value[index] = {
            ...urls.value[index],
            ...record,
             id,
             updateTime: now
        };
        await _sync();
    };

    const remove = async (id: number) => {
        const index = urls.value.findIndex(e => e.id === id);
        if (index === -1) {
            return Promise.reject(`链接【${id}】不存在`);
        }
        urls.value.splice(index, 1);
        await _sync();
    };

    const save = async (res: Array<Url>) => {
        urls.value = res;
        await _sync();
    };

    const _sync = async () => {
        const res = await utools.db.promises.put({
            _id: LocalNameEnum.DB_URL,
            _rev: rev.value,
            value: toRaw(urls.value)
        });
        if (res.error) {
            return Promise.reject(res.message);
        }
        rev.value = res.rev;
    }

    return {
        urls,
        url,
        urlMap,
        list,
        current,
        id,
        empty,
        choose,
        clear,
        add,
        addByBatch,
        update,
        remove,
        save,
    }
});

export default useUrlStore;
