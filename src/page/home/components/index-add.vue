<template>
    <a-modal :title="$t('common.operation.add')" v-model:visible="dialog" width="850px" draggable class="home-index-add"
        render-to-body unmount-on-close>
        <a-form :model="index" layout="vertical">
            <a-form-item :label="$t('common.keyword.name')">
                <a-input v-model="index.name" style="width: 300px;"></a-input>
            </a-form-item>
        </a-form>
        <a-tabs v-model:active-key="indexCollapse">
            <a-tab-pane :title="$t('home.newIndex.setting')" key="1">
                <a-form :model="index.settings" layout="vertical">
                    <a-form-item :label="$t('home.newIndex.shardNumber')">
                        <a-input-number v-model="index.settings.numberOfShards" controls-position="right">
                        </a-input-number>
                    </a-form-item>
                    <a-form-item :label="$t('home.newIndex.replicaNumber')">
                        <a-input-number v-model="index.settings.numberOfReplicas" controls-position="right">
                        </a-input-number>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
            <a-tab-pane :title="$t('home.newIndex.mappingSetting')" key="2">
                <index-mapping style="position: relative" ref="indexMapping" overflow />
            </a-tab-pane>
        </a-tabs>
        <template #footer>
            <a-button type="text" @click="jumpToSeniorSearch">{{ $t('common.action.jumpToSeniorSearch') }}</a-button>
            <a-button type="text" text @click="copyIndex">{{ $t('common.action.copy') }}</a-button>
            <a-button type="secondary" text @click="dialog = false">{{ $t('common.operation.cancel') }}</a-button>
            <a-button type="primary" @click="addIndex">{{ $t('common.operation.add') }}</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { usePageJumpEvent, useSeniorSearchEvent, versionStrategyContext } from "@/global/BeanFactory";
import { IndexInstance, Property } from "@/domain/IndexInstance";
import indexApi from "@/components/es/api/IndexApi";
import emitter from "@/plugins/mitt";

import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import useIndexStore from "@/store/IndexStore";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";

import IndexMapping from "@/components/IndexMapping/index.vue";

export default defineComponent({
    name: 'index-add',
    components: { IndexMapping },
    emits: ['update:modelValue'],
    props: {
        modelValue: Boolean
    },
    data: () => ({
        dialog: false,
        indexCollapse: '1',
        types: ['string', 'text', 'keyword', 'integer', 'long', 'short', 'byte', 'double', 'float', 'boolean', 'date'],
        index: {
            name: '',
            settings: {
                numberOfReplicas: useGlobalSettingStore().getDefaultReplica,
                numberOfShards: useGlobalSettingStore().getDefaultShard
            },
            mapping: [] as Array<Property>
        } as IndexInstance,
    }),
    watch: {
        modelValue(newValue: boolean) {
            this.dialog = newValue;
            if (newValue) {
                // 打开对话框重置数据
                this.index = {
                    name: '',
                    settings: {
                        numberOfReplicas: useGlobalSettingStore().getDefaultReplica,
                        numberOfShards: useGlobalSettingStore().getDefaultShard
                    },
                    mapping: [] as Array<Property>
                } as IndexInstance
            }
        },
        dialog(newValue: boolean) {
            this.$emit('update:modelValue', newValue);
        }
    },
    created() {
        this.dialog = Optional.ofNullable(this.modelValue).orElse(false);
    },
    methods: {
        addIndex() {
            let indexMapping = this.$refs['indexMapping'] as any;
            let indexCreate = versionStrategyContext.getStrategy().indexCreateBuild(this.index);
            indexCreate.mappings = indexMapping.getMapping()
            // 新增
            indexApi(this.index.name).create(indexCreate)
                .then(res => MessageUtil.success(res, useIndexStore().reset))
                .catch(e => MessageUtil.error('索引创建错误', e));
            // 关闭弹框
            this.dialog = false;
            // 发送刷新事件
            emitter.emit(MessageEventEnum.REFRESH_URL);
        },
        copyIndex() {
            // 执行拷贝
            utools.copyText(JSON.stringify(versionStrategyContext.getStrategy().indexCreateBuild(this.index), null, 4));
            // 关闭弹框
            this.dialog = false;
        },
        jumpToSeniorSearch() {
            // 页面跳转
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            // 构建数据
            let indexMapping = this.$refs['indexMapping'] as any;
            let indexCreate = versionStrategyContext.getStrategy().indexCreateBuild(this.index);
            indexCreate.mappings = indexMapping.getMapping()
            // 高级查询数据填充
            useSeniorSearchEvent.emit({
                link: this.index.name,
                method: 'PUT',
                params: JSON.stringify(indexCreate, null, 4)
            });
            // 关闭弹框
            this.dialog = false;
        }
    }
});
</script>
<style lang="less">
.home-index-add {

    .arco-modal-body {
        max-height: 70vh;
    }

    .arco-form-item-wrapper-col {
        width: 350px;
    }
}
</style>
