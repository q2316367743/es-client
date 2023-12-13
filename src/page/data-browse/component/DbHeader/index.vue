<template>
    <div class="option">
        <!-- 左侧条件 -->
        <a-button-group class="left">
            <page-help/>
            <div class="sep"></div>
            <db-simple-item :disable="type === ''" tip="刷新" @click="executeQuery(false)">
                <icon-refresh/>
            </db-simple-item>
            <div class="sep"></div>
            <db-simple-item :disable="type !== 'index'" tip="新增" @click="recordAdd">
                <icon-plus/>
            </db-simple-item>
            <db-simple-item :disable="selectedKeys.length === 0 || type !== 'index'" tip="删除" @click="recordReduce">
                <icon-minus/>
            </db-simple-item>
            <db-simple-item :disable="selectedKeys.length !== 1 || type !== 'index'"
                            :tip="$t('common.operation.update')"
                            @click="recordEdit">
                <icon-edit/>
            </db-simple-item>
        </a-button-group>
        <!-- 右侧条件 -->
        <a-button-group class="right">
            <!-- 选择索引 -->
            <db-index-select/>
            <!-- 打印 -->
            <db-simple-item :disable="!name" tip="打印" @click="openExportDialog">
                <icon-printer/>
            </db-simple-item>
            <!-- 索引结构 -->
            <db-simple-item :disable="type !== 'index'" tip="索引结构" @click="openMappingDrawer">
                <icon-nav/>
            </db-simple-item>
            <!-- 跳转到基础查询 -->
            <db-simple-item :disable="type === ''" tip="跳转到 基础查询" @click="jumpToBaseSearch">
                <icon-search/>
            </db-simple-item>
            <!-- 跳转到高级查询 -->
            <db-simple-item :disable="type === ''" tip="跳转到 高级查询" @click="jumpToSeniorSearch">
                <icon-filter/>
            </db-simple-item>
            <!-- 筛选 -->
            <a-trigger trigger="click" :unmount-on-close="false" position="br">
                <db-simple-item :disable="type === ''" tip="筛选">
                    <icon-select-all/>
                </db-simple-item>
                <template #content>
                    <div class="table-view-trigger">
                        <a-list style="width: 250px">
                            <template #header>
                                <a-button long status="danger" type="primary" size="small" @click="resetColumn()">重置
                                </a-button>
                            </template>
                            <a-scrollbar style="height: 341px;overflow: auto;width: 250px;">
                                <a-checkbox-group :model-value="checkItems" @change="handleChange($event)">
                                    <div v-for="column in columns" style="width: 240px;margin: 5px 5px;">
                                        <a-checkbox :value="column.dataIndex">{{ column.title }}</a-checkbox>
                                    </div>
                                </a-checkbox-group>
                            </a-scrollbar>
                        </a-list>
                    </div>
                </template>
            </a-trigger>
            <!-- 操作 -->
            <a-dropdown trigger="click">
                <a-button type="text" size="mini">
                    <template #icon>
                        <icon-more-vertical/>
                    </template>
                </a-button>
                <template #content>
                    <a-doption>
                        <a-link href="https://www.yuque.com/baozhiyige-tewwf/ygxv4r/fcqkthtec4u90hgz" target="_blank">帮助
                        </a-link>
                    </a-doption>
                </template>
            </a-dropdown>
        </a-button-group>
    </div>
</template>
<script lang="ts" setup>
import PageHelp from "@/page/data-browse/component/PageHelp.vue";
import DbSimpleItem from "@/page/data-browse/component/DbSimpleItem.vue";
import DbIndexSelect from "@/page/data-browse/component/DbIndexSelect.vue";
import {computed} from "vue";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import MessageUtil from "@/utils/MessageUtil";
import ArrayUtil from "@/utils/ArrayUtil";
import DataBuild from "@/page/data-browse/build/DataBuild";
import {showDataExportDrawer} from "@/components/DataExport";
import {execAdd, execUpdate} from "@/page/data-browse/component/DbHeader/func";

const index = computed(() => useDataBrowseStore().index);
const name = computed(() => useDataBrowseStore().name);
const records = computed(() => useDataBrowseStore().records);
const columns = computed(() => useDataBrowseStore().columns);
const type = computed(() => useDataBrowseStore().type);
const loading = computed(() => useDataBrowseStore().loading);
const checkItems = computed(() => useDataBrowseStore().checkItems);
const selectedKeys = computed(() => useDataBrowseStore().selectedKeys);
const recordMap = computed(() => ArrayUtil.map<any, string, '_id'>(records.value, '_id'));
const indexName = computed(() => index.value ? index.value.name : '')

const recordReduce = (deleteRowIndies?: Array<string>) => useDataBrowseStore().reduce(deleteRowIndies);
const executeQuery = (renderHeader?: boolean) => useDataBrowseStore().executeQuery(renderHeader);
const openMappingDrawer = () => useDataBrowseStore().openMappingDrawer();
const jumpToBaseSearch = () => useDataBrowseStore().jumpToBaseSearch();
const jumpToSeniorSearch = () => useDataBrowseStore().jumpToSeniorSearch();
const resetColumn = () => useDataBrowseStore().resetColumn();
const handleChange = (values: any[]) => useDataBrowseStore().handleChange(values);

function recordEdit(_id?: string) {
    if (!index.value) {
        MessageUtil.error('请选择索引');
        return;
    }
    let record;
    if (selectedKeys.value.length !== 1) {
        if (_id) {
            record = recordMap.value.get(_id);
            if (!record) {
                return;
            }
        } else {
            return;
        }
    } else {
        record = selectedKeys.value[0];
    }
    execUpdate(indexName.value, record['_id'], JSON.stringify(record['_source']['_source'], null, 4))
        .then(({id, data}) => useDataBrowseStore().update(id, data)
            .then(() => MessageUtil.success("新增成功"))
            .catch(e => MessageUtil.error("新增失败", e)));
}

function recordAdd() {
    if (!index.value) {
        return;
    }
    execAdd(indexName.value, DataBuild(index.value.mapping))
        .then(data => useDataBrowseStore().add(data)
            .then(() => MessageUtil.success("新增成功"))
            .catch(e => MessageUtil.error("新增失败", e)))
}

function openExportDialog() {
    // 选择了索引
    if (!name.value) {
        MessageUtil.error('请选择索引');
        return;
    }
    // 有记录
    if (records.value.length === 0) {
        MessageUtil.warning('数据为空');
        return;
    }
    // 显示导出对话框
    showDataExportDrawer({
        name: useDataBrowseStore().name,
        index: useDataBrowseStore().name,
        search: useDataBrowseStore().getCondition()
    })
}


</script>
<style scoped>

</style>