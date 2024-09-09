import {defineStore} from "pinia";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {SeniorFilterRecord} from "@/entity/record/SeniorFilterRecord";
import {ref, shallowRef} from "vue";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";


export const enableFilter = useUtoolsDbStorage('/setting/filter/enable', false);

export const useSeniorFilterRecordStore = defineStore('SeniorFilterSetting', () => {
    const seniorFilterRecords = ref<Array<SeniorFilterRecord>>([]);
    const rev = shallowRef<string | undefined>(undefined);

    const init = async () => {
        if (seniorFilterRecords.value.length === 0) {
            const seniorFilterRecordWrap = await listByAsync<SeniorFilterRecord>(LocalNameEnum.SETTING_SENIOR_FILTER);
            seniorFilterRecords.value = seniorFilterRecordWrap.list;
            rev.value = seniorFilterRecordWrap.rev;
        }
    }

    init()
        .then(() => console.log('SeniorFilterRecordStore init successfully'))
        .catch(e => console.error('SeniorFilterRecordStore init failed', e));

    const _sync = async () => {
        rev.value = await saveListByAsync(LocalNameEnum.SETTING_SENIOR_FILTER, seniorFilterRecords.value, rev.value);
    }

    const add = async (item: Omit<SeniorFilterRecord, 'id'>) => {
        if (item.label.trim() === '') {
            return Promise.reject("记录名不能为空");
        }
        if (item.value.trim() === '') {
            return Promise.reject("记录值不能为空");
        }
        seniorFilterRecords.value.push({
            ...item,
            id: new Date().getTime()
        });
        await _sync();
    }

    const update = async (item: SeniorFilterRecord) => {
        if (item.label.trim() === '') {
            return Promise.reject("记录名不能为空");
        }
        if (item.value.trim() === '') {
            return Promise.reject("记录值不能为空");
        }
        const index = seniorFilterRecords.value.findIndex(e => e.id === item.id);
        if (index === -1) {
            return Promise.reject("高级查询过滤器未找到，无法修改");
        }
        seniorFilterRecords.value[index] = item;
        await _sync();
    }

    const remove = async (id: number) => {
        const index = seniorFilterRecords.value.findIndex(e => e.id === id);
        if (index === -1) {
            return Promise.reject("高级查询过滤器未找到，无法删除");
        }
        seniorFilterRecords.value.splice(index, 1);
        await _sync();
    }

    return {
        seniorFilterRecords,
        add,
        update,
        remove
    }
})
