<template>
    <div class="setting-url">
        <div class="setting-url-toolbar">
            <a-input v-model="keyword" style="width: 40vw;" placeholder="链接名称" allow-clear />
            <a-button type="primary" @click="editOpen()">新增</a-button>
        </div>
        <a-table ref="urlTable" :data="urls" class="data" sticky-header style="height: 100%;" :draggable="draggable"
            @change="urlChange">
            <template #columns>
                <a-table-column data-index="name" :title="$t('common.keyword.name')" :width="120"
                    fixed="left"></a-table-column>
                <a-table-column data-index="value" :title="$t('common.keyword.url')" :width="260">
                    <template #cell="{ record }">
                        <a-link @click="open(record.value)" type="primary" target="_blank">{{ record.value }}</a-link>
                        <div class="url-copy" @click="execCopy(record.value)">{{ $t('common.operation.copy') }}</div>
                    </template>
                </a-table-column>
                <a-table-column data-index="version" title="版本" :width="100" />
                <a-table-column :title="$t('setting.link.form.isAuth')" :width="100">
                    <template #cell="{ record }">
                        {{ prettyAuth(record.isAuth) }}
                    </template>
                </a-table-column>
                <a-table-column :title="$t('common.keyword.operation')" :width="160" fixed="right">
                    <template #cell="{ record }">
                        <a-button type="primary" size="small" @click="editOpen(record)">{{
                            $t('common.operation.edit')
                        }}
                        </a-button>
                        <a-button type="primary" status="danger" size="small" @click="remove(record.id, record.value)"
                            style="margin-left: 8px;">
                            {{ $t('common.operation.delete') }}
                        </a-button>
                    </template>
                </a-table-column>
            </template>
        </a-table>
        <save-or-update-url />
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, toRaw } from "vue";

import useUrlStore from "@/store/UrlStore";
import useIndexStore from "@/store/IndexStore";
import Url from "@/entity/Url";

import { useUrlEditEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import SaveOrUpdateUrl from "@/page/setting/components/save-or-update-url/index.vue";
import { useFuse } from "@vueuse/integrations/useFuse";
import { TableDraggable } from "@arco-design/web-vue";

const keyword = ref('');

const items = computed(() => useUrlStore().urls);

const { results } = useFuse(keyword, items, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }, {
            name: 'value'
        }]
    }
});
const urls = computed(() => results.value.map(e => e.item));

const draggable = computed<TableDraggable | undefined>(() => {
    if (keyword.value === '') {
        return {
            type: 'handle'
        }
    }
});

function urlChange(items: Array<Url>) {
    useUrlStore().save(items.map(item => toRaw(item)));
}


function prettyAuth(params: boolean) {
    return params ? "需要认证" : "无需认证";
}
function remove(id: number, value: string) {
    MessageBoxUtil.confirm('是否删除相关的搜索历史', '提示', {
        confirmButtonText: '删除全部',
        cancelButtonText: '只删除链接'
    }).then(() => {
        useUrlStore().remove(id)
            .then(() => removeAfter(value))
            .catch(e => MessageUtil.error('删除失败', e));
    })
}
function removeAfter(value: string) {
    MessageUtil.success('删除成功');
    if (useUrlStore().current === value) {
        // 删除了当前索引
        useUrlStore().clear();
        useIndexStore().clear();
    }
    useIndexStore().reset();
}
function editOpen(url?: Url) {
    if (url) {
        useUrlEditEvent.emit(JSON.parse(JSON.stringify(toRaw(url))));
    } else {
        useUrlEditEvent.emit();
    }
}
const execCopy = (text: string) => utools.copyText(text);
const open = (url: string) => utools.shellOpenExternal(url);

</script>
<style lang="less">
.setting-url {
    .setting-url-toolbar {
        display: flex;
        justify-content: space-between;
        margin: 8px 5px;
    }

    .url-copy {
        display: inline;
    }
}
</style>
