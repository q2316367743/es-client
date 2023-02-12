<template>
    <a-modal :title="$t('common.operation.add')" v-model:visible="dialog" width="850px">
        <a-form :model="index">
            <a-form-item :label="$t('common.keyword.name')">
                <a-input v-model="index.name" style="width: 300px;"></a-input>
            </a-form-item>
        </a-form>
        <a-collapse v-model="indexCollapse">
            <a-collapse-item :header="$t('home.newIndex.setting')" key="1">
                <a-form :model="index.settings">
                    <a-form-item :label="$t('home.newIndex.shardNumber')">
                        <a-input-number v-model="index.settings.numberOfShards" controls-position="right">
                        </a-input-number>
                    </a-form-item>
                    <a-form-item :label="$t('home.newIndex.replicaNumber')">
                        <a-input-number v-model="index.settings.numberOfReplicas" controls-position="right">
                        </a-input-number>
                    </a-form-item>
                </a-form>
            </a-collapse-item>
            <a-collapse-item :header="$t('home.newIndex.fieldSetting')" key="2">
                <div v-if="index.mapping.length === 0">
                    <a-button type="primary" @click="addProperty">{{ $t('common.operation.add') }}</a-button>
                </div>
                <a-form :model="index.mapping" v-else>
                    <div v-for="(property, idx) in index.mapping" :key="idx">
                        <a-form :model="property" :inline="true">
                            <a-form-item :label="$t('home.newIndex.field.name')">
                                <a-input v-model="property.field"></a-input>
                            </a-form-item>
                            <a-form-item :label="$t('home.newIndex.field.type')">
                                <a-select v-model="property.type">
                                    <a-option v-for="(type) in types" :key="type" :label="type" :value="type">
                                    </a-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" @click="addProperty">{{ $t('common.operation.add') }}
                                </a-button>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" status="danger" @click="removeProperty(property)">{{
                                        $t('common.operation.delete')
                                    }}
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-form>
            </a-collapse-item>
        </a-collapse>
        <template #footer>
            <a-button type="text" @click="jumpToSeniorSearch">{{ $t('common.action.jumpToSeniorSearch') }}</a-button>
            <a-button type="text" text @click="copyIndex">{{ $t('common.action.copy') }}</a-button>
            <a-button type="secondary" text @click="this.dialog = false">{{ $t('common.operation.cancel') }}</a-button>
            <a-button type="primary" @click="addIndex">{{ $t('common.operation.add') }}</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Optional from "@/utils/Optional";
import useSettingStore from "@/store/SettingStore";
import {IndexInstance, Property} from "@/domain/IndexInstance";
import indexApi from "@/api/IndexApi";
import useIndexStore from "@/store/IndexStore";
import BrowserUtil from "@/utils/BrowserUtil";
import IndexCreateBuild from "@/build/IndexCreateBuild";
import {usePageJumpEvent, useSeniorSearchEvent} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'home-index-add',
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
                numberOfReplicas: useSettingStore().getDefaultReplica,
                numberOfShards: useSettingStore().getDefaultShard
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
                        numberOfReplicas: useSettingStore().getDefaultReplica,
                        numberOfShards: useSettingStore().getDefaultShard
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
        addProperty() {
            this.index.mapping.push({id: new Date().getTime(), field: '', 'type': 'text'})
        },
        removeProperty(property: Property) {
            this.index.mapping = this.index.mapping.filter((target: Property) => {
                return property.id !== target.id;
            });
        },
        addIndex() {
            // 新增
            indexApi(this.index.name).create(IndexCreateBuild(this.index))
                .then(res => MessageUtil.success(res, useIndexStore().reset))
                .catch(e => MessageUtil.error('索引创建错误', e));
            // 关闭弹框
            this.dialog = false;
            // 发送刷新事件
            emitter.emit(MessageEventEnum.REFRESH_URL);
        },
        copyIndex() {
            // 执行拷贝
            BrowserUtil.copy(JSON.stringify(IndexCreateBuild(this.index), null, 4));
            // 关闭弹框
            this.dialog = false;
        },
        jumpToSeniorSearch() {
            // 页面跳转
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            // 高级查询数据填充
            useSeniorSearchEvent.emit({
                link: this.index.name,
                method: 'PUT',
                params: JSON.stringify(IndexCreateBuild(this.index), null, 4),
                execute: false
            });
            // 关闭弹框
            this.dialog = false;
        }
    }
});
</script>
<style scoped>

</style>