<template>

    <el-form style="margin-top: 10px;" label-width="160px" label-position="top">
        <el-collapse v-model="actives">
            <el-collapse-item title="布局方式">
                <el-select v-model="layoutMode">
                    <el-option :value="LayoutModeEnum.DEFAULT" label="默认"/>
                    <el-option :value="LayoutModeEnum.CLASSIC" label="经典"/>
                </el-select>
            </el-collapse-item>
            <el-collapse-item title="新建索引">
                <el-form-item :label="$t('setting.base.default_shard_number')">
                    <el-input-number v-model="instance.defaultShard"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('setting.base.default_replica_number')">
                    <el-input-number v-model="instance.defaultReplica"></el-input-number>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item>
                <template #title>
                    全局索引查询条件（修改后请
                    <span class="like-link">刷新</span>
                    索引）
                </template>
                <el-form-item label="状态">
                    <el-radio-group v-model="instance.homeSearchState">
                        <el-radio :label="0">不设置</el-radio>
                        <el-radio :label="1">打开</el-radio>
                        <el-radio :label="2">关闭</el-radio>
                    </el-radio-group>
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
            </el-collapse-item>
            <el-collapse-item title="http设置">
                <el-form-item :label="$t('setting.base.timeout')">
                    <el-input-number v-model="instance.timeout" :min="0" :step="1000"
                                     :placeholder="$t('setting.base.timeout_placeholder')"></el-input-number>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="显示设置">
                <el-form-item :label="$t('setting.base.page_size')">
                    <el-input-number v-model="instance.pageSize"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('setting.base.default_viewer')">
                    <el-select v-model="instance.defaultViewer">
                        <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                        <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <template #label>
                        <span>是否默认展示标签栏</span>
                        <el-tooltip content="基础查询和高级查询" placement="top" effect="light">
                            <el-icon style="margin-left: 5px;">
                                <i class="vxe-icon-question-circle"/>
                            </el-icon>
                        </el-tooltip>
                    </template>
                    <el-switch v-model="instance.showTab" :active-value="true" :inactive-value="false"
                               active-text="展示"
                               inactive-text="隐藏"/>
                </el-form-item>
                <el-form-item label="JSON视图主题 - 白天">
                    <el-select v-model="instance.jsonThemeByLight">
                        <el-option v-for="theme in JsonTheme.light" :label="theme" :value="theme"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="JSON视图主题 - 黑夜">
                    <el-select v-model="instance.jsonThemeByDark">
                        <el-option v-for="theme in JsonTheme.dark" :label="theme" :value="theme"/>
                    </el-select>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="强迫症选项">
                <el-form-item label="选择链接后自动全屏">
                    <el-switch v-model="instance.autoFullScreen" :active-value="true" :inactive-value="false"
                               active-text="开启"
                               inactive-text="关闭"/>
                </el-form-item>
            </el-collapse-item>
        </el-collapse>
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
import JsonTheme from "@/data/JsonTheme";

export default defineComponent({
    name: 'setting-base',
    computed: {
        ...mapState(useSettingStore, ['instance']),
    },
    data: () => ({
        layoutMode,
        LayoutModeEnum,
        JsonTheme,
        homeExcludeIndicesConfig: {
            input: false,
            value: ''
        },
        actives: ['']
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
            emitter.emit(MessageEventEnum.URL_REFRESH);
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
                emitter.emit(MessageEventEnum.URL_REFRESH);
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

.like-link {
    color: var(--active-color);
}
</style>