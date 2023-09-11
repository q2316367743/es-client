import {defineStore} from "pinia";
import {useTitle} from "@vueuse/core";

import Url from "@/entity/Url";

import ArrayUtil from "@/utils/ArrayUtil";
import {listByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";

const title = useTitle();

const useUrlStore = defineStore('url', {
    state: () => ({
        // 全部的链接
        urls: new Array<Url>(),
        rev: undefined as string | undefined,
        // 当前选中的链接
        url: undefined as Url | undefined
    }),
    getters: {
        urlMap: state => ArrayUtil.map<Url, number, keyof Url>(state.urls, 'id'),
        /**
         * 返回全部的链接
         */
        list: (state): Array<Url> => {
            return state.urls;
        },
        current: (state): string => {
            return state.url && state.url.value ? state.url.value! : '';
        },
        id: (state): number | undefined => {
            return state.url ? state.url.id! : undefined;
        }
    },
    actions: {
        async init() {
            const {list, rev} = await listByAsync<Url>(LocalNameEnum.DB_URL);
            this.urls = list.sort((a, b) => b.sequence! - a.sequence!);
            this.rev = rev;
        },
        /**
         * 选择链接
         */
        choose(id: number): boolean {
            // 查询URL
            let url = this.urls.find(e => e.id! === id);
            if (!url) {
                return false;
            }
            this.url = url;
            title.value = url.name || 'es-client';
            return true;
        },
        clear() {
            this.url = undefined;
            title.value = 'es-client';
        },


        async add(record: Omit<Url, 'id' | 'createTime' | 'updateTime'>) {
            const now = new Date();
            const id = now.getTime();
            this.urls.push({
                ...record,
                id,
                createTime: now,
                updateTime: now
            });
            await this._sync();
        },
        async update(id: number, record: Omit<Url, 'id' | 'createTime' | 'updateTime'>) {
            const index = this.urls.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject(`存储【${id}】不存在`);
            }
            const now = new Date();
            this.urls[index] = {
                ...this.urls[index],
                ...record,
                id,
                updateTime: now
            };
            await this._sync();
        },
        async remove(id: number) {
            const index = this.urls.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject(`存储【${id}】不存在`);
            }
            this.urls.splice(index, 1);
            await this._sync();
        },
        async save(urls: Array<Url>) {
            this.urls = urls;
            await this._sync();
        },
        async _sync() {

            const res = await utools.db.promises.put({
                _id: LocalNameEnum.DB_URL,
                _rev: this.rev,
                value: toRaw(this.urls)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        },
    }
});

export default useUrlStore;
