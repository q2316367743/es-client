<template>
    <a-trigger trigger="click" v-model:popup-visible="visible" :popup-offset="8">
        <a-button style="margin-top: 4px;">
            <a-space>
                <a-badge :count="10" dot :status="status"></a-badge>
                <span>{{ selectName}}</span>
                <icon-up v-if="visible"/>
                <icon-down v-else/>
            </a-space>
        </a-button>
        <template #content>
            <div class="app-link-manage" ref="contentRef">
                <div class="setting-url-toolbar">
                    <a-input v-model="keyword" style="width: 40vw;" placeholder="链接名称" allow-clear/>
                    <a-dropdown-button @click="openAddLink()" type="primary">
                        新增
                        <template #content>
                            <a-doption @click="exportUrlToJson()">
                                <template #icon>
                                    <icon-export />
                                </template>
                                数据导出
                            </a-doption>
                            <a-doption @click="importUrlByJson()">
                                <template #icon>
                                    <icon-import />
                                </template>
                                数据导入
                            </a-doption>
                        </template>
                    </a-dropdown-button>
                </div>
                <a-table ref="urlTable" :data="urls" class="data" sticky-header :draggable="draggable" :pagination="false"
                         @change="urlChange($event)" :virtual-list-props="virtualListProps" :scroll="{y: '100%'}" style="margin-top: 8px;">
                    <template #columns>
                        <a-table-column data-index="name" title="名称" :width="120"
                                        fixed="left"></a-table-column>
                        <a-table-column data-index="value" title="链接" :width="260">
                            <template #cell="{ record }">
                                <a-link @click="open(record.value)" type="primary" target="_blank">{{ record.value }}</a-link>
                            </template>
                        </a-table-column>
                        <a-table-column data-index="version" title="版本" :width="100"/>
                        <a-table-column title="认证" :width="100">
                            <template #cell="{ record }">
                                {{ prettyAuth(record.isAuth) }}
                            </template>
                        </a-table-column>
                        <a-table-column title="操作" :width="170" fixed="right">
                            <template #cell="{ record }">
                                <a-button type="primary" size="small" @click="openUpdateLink(record)">
                                    <template #icon>
                                        <icon-edit />
                                    </template>
                                </a-button>
                                <a-popconfirm @ok="remove(record.id, record.value)" content="是否删除链接，删除后将无法恢复"
                                              ok-text="删除" position="br" :ok-button-props="{status: 'danger'}">
                                    <a-button type="primary" status="danger" size="small"
                                              style="margin-left: 8px;">
                                        <template #icon>
                                            <icon-delete />
                                        </template>
                                    </a-button>
                                </a-popconfirm>
                            </template>
                        </a-table-column>
                    </template>
                </a-table>
            </div>
        </template>
    </a-trigger>
</template>
<script lang="ts" setup>
import {computed, ref, toRaw} from "vue";
import {openAddLink, openUpdateLink} from "@/page/setting/pages/link/components/EditLink";
import {useElementSize, useFileSystemAccess} from "@vueuse/core";
import useUrlStore from "@/store/UrlStore";
import {useFuse} from "@vueuse/integrations/useFuse";
import {TableDraggable} from "@arco-design/web-vue";
import MessageUtil from "@/utils/MessageUtil";
import useIndexStore from "@/store/IndexStore";
import {download} from "@/utils/BrowserUtil";
import Constant from "@/global/Constant";
import {getDefaultUrl} from "@/entity/Url";


const contentRef = ref();
const keyword = ref('');
const visible = ref(false);

const size = useElementSize(contentRef);

const items = computed(() => useUrlStore().urls);
const {results} = useFuse(keyword, items, {
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

const virtualListProps = computed(() => ({
    height: size.height.value - 40
}))
const selectName = computed(() => {
    const {id, urlMap} = useUrlStore();
    if (!id) {
        return '请选择链接';
    }
    const url = urlMap.get(id);
    return url?.name || '请选择链接';
});
const status = computed(() => {
    const status = useIndexStore().status;
    if (status === 'yellow') {
        return 'warning';
    } else if (status === 'green') {
        return 'success';
    } else if (status === 'red') {
        return 'danger';
    }
    return 'normal';
});

// -------------------------------------- 方法 --------------------------------------

function urlChange(items: Array<any>) {
    useUrlStore().save(items.map(item => toRaw(item)));
}


function prettyAuth(params: boolean) {
    return params ? "需要认证" : "无需认证";
}

function remove(id: number, value: string) {
    useUrlStore().remove(id)
        .then(() => removeAfter(value))
        .catch(e => MessageUtil.error('删除失败', e));
}

function removeAfter(value: string) {
    MessageUtil.success('删除成功');
    if (useUrlStore().current === value) {
        // 删除了当前索引
        useUrlStore().clear();
        useIndexStore().clear();
    }
}

const execCopy = (text: string) => {
    utools.copyText(text);
    MessageUtil.success("已成功复制到剪切板");
};
const open = (url: string) => utools.shellOpenExternal(url);

// 导入导出

function exportUrlToJson() {
    download(JSON.stringify({
        version: Constant.version,
        records: useUrlStore().urls
    }, null, 4), "链接导出.json", "application/json");
}

const importFile = useFileSystemAccess({
    dataType: 'Text',
    types: [{
        accept: {
            'application/json': ['.json']
        },
        description: "JSON文件"
    }]
});
function importUrlByJson() {
    const rsp =  importFile.open() as Promise<void>;
    rsp.then(() => {
        const value = importFile.data.value;
        if (!value) {
            MessageUtil.error("没有解析到数据，请确认上传文件是否正确")
        }
        handlerJson(value)
            .then(() => MessageUtil.success("导入成功"))
            .catch(e => MessageUtil.error("导入失败", e));
    })
}

async function handlerJson(json?: string) {
    if (!json) {
        return Promise.reject("没有解析到数据，请确认上传文件是否正确");
    }
    let value;
    try {
        value = JSON.parse(json) as any;
    }catch (e) {
        return Promise.reject("JSON文件解析失败");
    }
    if (!value) {
        return Promise.reject("JSON未解析到数据");
    }
    let records = value.records;
    if (!records) {
        return Promise.reject("链接记录不存在");
    }
    if (!(records instanceof Array)) {
        return Promise.reject("数据格式错误，无法导入");
    }
    await useUrlStore().addByBatch(records.map(e => getDefaultUrl(e)))
}

</script>
<style scoped lang="less">
.app-link-manage {
    width: 50vw;
    max-width: 600px;
    height: 340px;
    background-color: var(--color-bg-1);
    color: var(--color-text-1);
    border-radius: var(--border-radius-medium);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 8px;
}
</style>
