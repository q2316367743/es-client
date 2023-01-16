<template>
    <el-dialog :title="$t('home.new_index.self')" v-model="dialog" width="850px">
        <el-form>
            <el-form-item :label="$t('home.new_index.name')">
                <el-input v-model="index.name" style="width: 300px;"></el-input>
            </el-form-item>
        </el-form>
        <el-collapse v-model="indexCollapse">
            <el-collapse-item :title="$t('home.new_index.base_setting')" name="1">
                <el-form>
                    <el-form-item :label="$t('home.new_index.shard_number')">
                        <el-input-number v-model="index.settings.numberOfShards" controls-position="right">
                        </el-input-number>
                    </el-form-item>
                    <el-form-item :label="$t('home.new_index.replica_number')">
                        <el-input-number v-model="index.settings.numberOfReplicas" controls-position="right">
                        </el-input-number>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item :title="$t('home.new_index.field_setting')" name="2">
                <div v-if="index.mapping.length === 0">
                    <el-button type="primary" @click="addProperty">{{ $t('home.new_index.add') }}</el-button>
                </div>
                <el-form v-else>
                    <div v-for="(property, idx) in index.mapping" :key="idx">
                        <el-form :inline="true">
                            <el-form-item :label="$t('home.new_index.field_name')">
                                <el-input v-model="property.field"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('home.new_index.field_type')">
                                <el-select v-model="property.type">
                                    <el-option v-for="(type) in types" :key="type" :label="type" :value="type">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addProperty">{{ $t('home.new_index.add') }}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click="removeProperty(property)">{{
                                        $t('home.new_index.delete')
                                    }}
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <template #footer>
            <el-button type="info" text @click="jumpToSeniorSearch">跳转到高级查询</el-button>
            <el-button type="info" text @click="copyIndex">复制到剪切板</el-button>
            <el-button type="primary" @click="addIndex">{{ $t('home.new_index.add') }}</el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Optional from "@/utils/Optional";
import useSettingStore from "@/store/SettingStore";
import {IndexInstance, Property} from "@/domain/IndexInstance";
import indexApi from "@/api/IndexApi";
import {ElMessage} from "element-plus";
import useIndexStore from "@/store/IndexStore";
import BrowserUtil from "@/utils/BrowserUtil";
import IndexSaveBuild from "@/build/IndexSaveBuild";
import {usePageJumpEvent, useSeniorSearchEvent} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

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
            indexApi.save(this.index, (data: any) => {
                // 显示对话框
                ElMessage.info(JSON.stringify(data));
                // 刷新索引
                useIndexStore().reset();
            })
            // 关闭弹框
            this.dialog = false;
            // 发送刷新事件
            emitter.emit(MessageEventEnum.REFRESH_URL);
        },
        copyIndex() {
            // 执行拷贝
            BrowserUtil.copy(JSON.stringify(IndexSaveBuild(this.index), null, 4));
            // 关闭弹框
            this.dialog = false;
        },
        jumpToSeniorSearch() {
            // 页面跳转
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            // 高级查询数据填充
            useSeniorSearchEvent.emit({
                url: this.index.name,
                method: 'PUT',
                param: JSON.stringify(IndexSaveBuild(this.index), null, 4),
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