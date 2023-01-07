<template>
    <el-form style="margin-top: 10px;" label-width="160px" label-position="top">

        <el-divider content-position="left">布局方式</el-divider>
        <el-select v-model="layoutMode">
            <el-option :value="LayoutModeEnum.DEFAULT" label="默认"/>
            <el-option :value="LayoutModeEnum.CLASSIC" label="经典"/>
        </el-select>

        <el-divider content-position="left">新建索引</el-divider>
        <el-form-item :label="$t('setting.base.default_shard_number')">
            <el-input-number v-model="instance.defaultShard"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('setting.base.default_replica_number')">
            <el-input-number v-model="instance.defaultReplica"></el-input-number>
        </el-form-item>

        <el-divider content-position="left">索引查询</el-divider>
        <el-form-item label="默认查询条件-状态">
            <el-select v-model="instance.homeSearchState">
                <el-option :value="0" label="不设置"></el-option>
                <el-option :value="1" label="打开"></el-option>
                <el-option :value="2" label="关闭"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <template #label>
                <span>排除指定索引</span>
                <el-tooltip content="支持正则表达式" placement="top" effect="light">
                    <el-icon style="margin-left: 5px;">
                        <i class="vxe-icon-question-circle"/>
                    </el-icon>
                </el-tooltip>
            </template>
            <el-tag
                v-for="index in instance.homeExcludeIndices"
                :key="index"
                closable
                :disable-transitions="false"
                @close="removeHomeExcludeIndex(index)"
                class="home-exclude-index"
            >
                {{ index }}
            </el-tag>
            <el-input
                v-if="homeExcludeIndicesConfig.input"
                ref="homeExcludeIndexInput"
                v-model="homeExcludeIndicesConfig.value"
                size="small"
                @keyup.enter="addHomeExcludeIndex"
                @blur="addHomeExcludeIndex"
                style="width: 72px;"
                class="home-exclude-item"
            />
            <el-button v-else size="small" @click="addHomeExcludeIndexClick" class="home-exclude-item">
                新增索引
            </el-button>
        </el-form-item>

        <el-divider content-position="left">分页设置</el-divider>
        <el-form-item :label="$t('setting.base.page_size')">
            <el-input-number v-model="instance.pageSize"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('setting.base.page_step')">
            <el-input-number v-model="instance.pageStep"></el-input-number>
        </el-form-item>

        <el-divider content-position="left">http设置</el-divider>
        <el-form-item :label="$t('setting.base.timeout')">
            <el-input-number v-model="instance.timeout" :min="0" :step="1000"
                             :placeholder="$t('setting.base.timeout_placeholder')"></el-input-number>
        </el-form-item>

        <el-divider content-position="left">强迫症选项</el-divider>
        <el-form-item label="选择链接后自动全屏">
            <el-switch v-model="instance.autoFullScreen" :active-value="true" :inactive-value="false"
                       active-text="开启"
                       inactive-text="关闭"/>
        </el-form-item>

        <el-divider content-position="left">其他</el-divider>
        <el-form-item :label="$t('setting.base.default_viewer')">
            <el-select v-model="instance.defaultViewer">
                <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import useSettingStore from "@/store/SettingStore";
import {mapState} from "pinia";
import {layoutMode} from "@/global/BeanFactory";
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    name: 'setting-base',
    computed: {
        ...mapState(useSettingStore, ['instance']),
    },
    data: () => ({
        layoutMode,
        LayoutModeEnum,
        homeExcludeIndicesConfig: {
            input: false,
            value: ''
        }
    }),
    created() {
        // 获取布局方式
        document.body.setAttribute('layout-mode', this.layoutMode);
    },
    watch: {
        layoutMode(newValue: string) {
            document.body.setAttribute('layout-mode', newValue);
        }
    },
    methods: {
        removeHomeExcludeIndex(index: string) {
            useSettingStore().removeHomeExcludeIndex(index);
            emitter.emit(MessageEventEnum.INDEX_REFRESH);
        },
        addHomeExcludeIndexClick() {
            this.homeExcludeIndicesConfig.input = true;
            this.$nextTick(() => {
                let homeExcludeIndexInput = this.$refs['homeExcludeIndexInput'] as HTMLInputElement;
                homeExcludeIndexInput.focus()
            })
        },
        addHomeExcludeIndex() {
            this.homeExcludeIndicesConfig.input = false;
            if (this.homeExcludeIndicesConfig.value !== '') {
                useSettingStore().addHomeExcludeIndex(this.homeExcludeIndicesConfig.value);
                this.homeExcludeIndicesConfig = {
                    input: false,
                    value: ''
                }
                emitter.emit(MessageEventEnum.INDEX_REFRESH);
            }
        }
    }
});
</script>
<style scoped lang="less">
.home-exclude-index {
    margin-left: 5px;

    &:first-child {
        margin-left: 0;
    }
}

.home-exclude-item {
    margin-left: 5px;
}
</style>