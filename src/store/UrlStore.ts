import {defineStore} from "pinia";
import {useTitle} from "@vueuse/core";

import {Url} from "@/entity/Url";

import {map} from "@/utils/ArrayUtil";
import {listByAsync, saveListByAsync, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref} from "vue";
import {statistics} from "@/global/BeanFactory";
import { useRequestJson} from "@/plugins/native/axios";
import {Overview} from "@/domain/es/Overview";

const title = useTitle();

const useUrlStore = defineStore('url', () => {
  // state
  const urls = ref<Array<Url>>([]);
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
  };

  init().then(() => console.log("url 初始化成功")).catch(e => console.log("url 初始化失败", e));

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
    // 获取版本

    const response = await useRequestJson<Overview>("/", {
      baseURL: record.value
    });

    urls.value.push({
      ...record,
      version: response.version.number,
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
    await saveListByAsync(LocalNameEnum.DB_URL, urls.value);
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
