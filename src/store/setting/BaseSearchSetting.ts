import BaseSearchSetting from "@/entity/setting/BaseSearchSetting";
import {defineStore} from "pinia";
import {toRaw} from "vue";
import {state} from "vue-tsc/out/shared";

export function getDefaultBaseSearchSetting(): BaseSearchSetting {
    return {
        defaultParams: "",
        enableTrackTotalHits: true,
        trackTotalHits: true
    }
}

export const useBaseSearchSettingStore = defineStore('base-search-setting', {
    state: () => ({
        baseSearchSetting: getDefaultBaseSearchSetting(),
        rev: undefined as string | undefined
    }),
    getters: {
        defaultParams: state => {
            let params = {};
            if (state.baseSearchSetting.defaultParams.trim() !== '') {
                try{
                    params = JSON.parse(state.baseSearchSetting.defaultParams);
                }catch(e) {
                    console.error(e);
                }
            }
            return params;
        },
        enableTrackTotalHits: state => state.baseSearchSetting.enableTrackTotalHits,
        trackTotalHits: state => state.baseSearchSetting.trackTotalHits
    },
    actions: {
        async init() {
            const settingWrap = await utools.db.promises.get('/setting/base-search');
            if (settingWrap) {
                this.baseSearchSetting = Object.assign(this.baseSearchSetting, settingWrap.value);
                this.rev = settingWrap._rev;
            }
        },
        async save(setting: BaseSearchSetting) {
            this.baseSearchSetting = setting;
            const res = await utools.db.promises.put({
                _id: "/setting/base-search",
                _rev: this.rev,
                value: toRaw(this.baseSearchSetting)
            });
            if (res.error){
                return Promise.reject(res.message || "保存基础搜索设置失败");
            }
            this.rev = res.rev;
        }
    }
})
