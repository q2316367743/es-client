import {defineStore} from "pinia";
import {listByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {SeniorFilterRecord} from "@/entity/record/SeniorFilterRecord";

let init = false;

export const enableFilter = useLocalStorage('/setting/filter/enable', false);

export const useSeniorFilterRecordStore = defineStore('SeniorFilterSetting', {
  state: () => ({
    seniorFilterRecords: new Array<SeniorFilterRecord>(),
  }),
  actions: {
    async init() {
      if (!init) {
        let seniorFilterRecordWrap = await listByAsync<SeniorFilterRecord>(LocalNameEnum.SETTING_SENIOR_FILTER);
        this.seniorFilterRecords = seniorFilterRecordWrap.list;
        init = true;
      }
      return Promise.resolve();
    },
    async _sync() {
      await saveOneByAsync(LocalNameEnum.SETTING_SENIOR_FILTER, toRaw(this.seniorFilterRecords));
    },
    async add(item: Omit<SeniorFilterRecord, 'id'>) {
      if (item.label.trim() === '') {
        return Promise.reject("记录名不能为空");
      }
      if (item.value.trim() === '') {
        return Promise.reject("记录值不能为空");
      }
      this.seniorFilterRecords.push({
        ...item,
        id: new Date().getTime()
      });
      await this._sync();
    },
    async update(item: SeniorFilterRecord) {
      if (item.label.trim() === '') {
        return Promise.reject("记录名不能为空");
      }
      if (item.value.trim() === '') {
        return Promise.reject("记录值不能为空");
      }
      const index = this.seniorFilterRecords.findIndex(e => e.id === item.id);
      if (index === -1) {
        return Promise.reject("高级查询过滤器未找到，无法修改");
      }
      this.seniorFilterRecords[index] = item;
      await this._sync();
    },
    async remove(id: number) {
      const index = this.seniorFilterRecords.findIndex(e => e.id === id);
      if (index === -1) {
        return Promise.reject("高级查询过滤器未找到，无法删除");
      }
      this.seniorFilterRecords.splice(index, 1);
      await this._sync();
    }
  }
})
