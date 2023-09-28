<template>
    <a-button type="primary" style="margin-left: 10px" @click="dialog = true" :disabled="!url">
        新建
    </a-button>
    <a-modal title="新增索引" v-model:visible="dialog" width="850px" draggable class="home-index-add"
             render-to-body unmount-on-close fullscreen>
        <a-form :model="index" layout="vertical">
            <a-form-item :label="$t('common.keyword.name')">
                <a-input v-model="index.name" style="width: 300px;"></a-input>
            </a-form-item>
        </a-form>
        <a-tabs v-model:active-key="activeKey">
            <a-tab-pane :title="$t('home.newIndex.setting')" key="1">
                <a-form :model="index.settings" layout="vertical">
                    <a-form-item :label="$t('home.newIndex.shardNumber')">
                        <a-input-number v-model="index.settings.number_of_shards" controls-position="right">
                        </a-input-number>
                    </a-form-item>
                    <a-form-item :label="$t('home.newIndex.replicaNumber')">
                        <a-input-number v-model="index.settings.number_of_replicas" controls-position="right">
                        </a-input-number>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
            <a-tab-pane :title="$t('home.newIndex.mappingSetting')" key="2">
                <monaco-editor v-model="index.mappings" language="json" :height="size.height.value - 200 + 'px'" />
            </a-tab-pane>
        </a-tabs>
        <template #footer>
            <a-button type="text" @click="jumpToSeniorSearch()">{{ $t('common.action.jumpToSeniorSearch') }}</a-button>
            <a-button type="text" text @click="copyIndex()">{{ $t('common.action.copy') }}</a-button>
            <a-button type="secondary" text @click="dialog = false">{{ $t('common.operation.cancel') }}</a-button>
            <a-button type="primary" @click="addIndex()">{{ $t('common.operation.add') }}</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {getDefaultIndexInstance, IndexInstance} from "@/domain/IndexInstance";
import indexApi from "@/components/es/api/IndexApi";

import useIndexStore from "@/store/IndexStore";

import MessageUtil from "@/utils/MessageUtil";

import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import useUrlStore from "@/store/UrlStore";
import {IndexCreate} from "@/components/es/domain/IndexCreate";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {useWindowSize} from "@vueuse/core";

const size = useWindowSize();

const dialog = ref(false);
const activeKey = ref('1');
const index = ref<IndexInstance>(getDefaultIndexInstance());
const url = computed(() => useUrlStore().url);

function openDialog() {
    dialog.value = true;
}

function getIndexCreate(): IndexCreate {
    return {
        settings: index.value.settings,
        mappings: JSON.parse(index.value.mappings)
    };
}

function addIndex() {
    // 新增
    indexApi(index.value.name).create(getIndexCreate())
        .then(res => MessageUtil.success(res, useIndexStore().reset))
        .catch(e => MessageUtil.error('索引创建错误', e));
    // 关闭弹框
    dialog.value = false;
    // 发送刷新事件
    useIndexStore().reset();
}

function copyIndex() {
    // 执行拷贝
    utools.copyText(JSON.stringify(getIndexCreate(), null, 4));
    MessageUtil.success("已成功复制到剪切板");
    // 关闭弹框
    dialog.value = false;
}

function jumpToSeniorSearch() {
    // 构建数据
    // 高级查询数据填充
    useSeniorSearchStore().loadEvent({
        link: '/' + index.value.name,
        method: 'PUT',
        body: JSON.stringify(getIndexCreate(), null, 4)
    });
    // 关闭弹框
    dialog.value = false;
}

</script>
<style lang="less">
.home-index-add {
}
</style>
