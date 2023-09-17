<template>
    <a-form :model="instance" layout="vertical" class="setting-global">

        <div class="toc">
            <a-anchor :change-hash="false" scroll-container=".setting .arco-scrollbar-container">
                <a-anchor-link href="#new">
                    新建索引
                </a-anchor-link>
                <a-anchor-link href="#global-search">
                    全局索引查询条件
                </a-anchor-link>
                <a-anchor-link href="#time">
                    时间相关设置
                </a-anchor-link>
                <a-anchor-link href="#display">
                    显示设置
                </a-anchor-link>
                <a-anchor-link href="#other">
                    其他设置
                </a-anchor-link>
            </a-anchor>
        </div>

        <a-alert id="new">新建索引</a-alert>
        <a-form-item label="默认分片数" id="defaultShard">
            <a-input-number controls-position="right" v-model="instance.defaultShard"></a-input-number>
        </a-form-item>
        <a-form-item label="默认副本数" id="defaultReplica">
            <a-input-number controls-position="right" v-model="instance.defaultReplica"></a-input-number>
        </a-form-item>


        <a-alert id="global-search">
            全局索引查询条件（修改后请
            <span class="like-red">刷新</span>
            索引）
        </a-alert>
        <a-form-item label="状态" id="homeSearchState">
            <a-radio-group v-model="instance.homeSearchState">
                <a-radio :value="0">不设置</a-radio>
                <a-radio :value="1">打开</a-radio>
                <a-radio :value="2">关闭</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item id="homeExcludeIndices">
            <template #label>
                <span>排除指定索引</span>
                <a-tooltip content="支持正则表达式" placement="top" effect="light">
                    <icon-question-circle style="margin-left: 5px;"/>
                </a-tooltip>
            </template>
            <a-tag v-for="index in instance.homeExcludeIndices" :key="index" closable color="blue"
                   :disable-transitions="false" @close="removeHomeExcludeIndex(index)"
                   class="home-exclude-index">
                {{ index }}
            </a-tag>
            <a-input v-if="homeExcludeIndicesConfig.input" ref="homeExcludeIndexInput"
                     v-model="homeExcludeIndicesConfig.value" size="small" @keyup.enter="addHomeExcludeIndex"
                     @blur="addHomeExcludeIndex()" style="width: 72px;" class="home-exclude-item"/>
            <a-button type="primary" v-else size="small" @click="addHomeExcludeIndexClick()"
                      class="home-exclude-item">
                新增索引
            </a-button>
        </a-form-item>
        <a-form-item id="homeIncludeIndices">
            <template #label>
                <span>显示指定索引</span>
                <a-tooltip content="支持正则表达式" placement="top" effect="light">
                    <icon-question-circle style="margin-left: 5px;"/>
                </a-tooltip>
            </template>
            <a-tag v-for="index in instance.homeIncludeIndices" :key="index" closable color="blue"
                   :disable-transitions="false" @close="removeHomeIncludeIndex(index)"
                   class="home-exclude-index">
                {{ index }}
            </a-tag>
            <a-input v-if="homeIncludeIndicesConfig.input" ref="homeIncludeIndexInput"
                     v-model="homeIncludeIndicesConfig.value" size="small" @keyup.enter="addHomeIncludeIndex"
                     @blur="addHomeIncludeIndex()" style="width: 72px;" class="home-exclude-item"/>
            <a-button type="primary" v-else size="small" @click="addHomeIncludeIndexClick()"
                      class="home-exclude-item">
                新增索引
            </a-button>
        </a-form-item>


        <a-alert id="time">时间相关设置</a-alert>
        <a-form-item label="超时时间" id="timeout">
            <a-input-number controls-position="right" v-model="instance.timeout" :min="0" :step="1000"
                            placeholder="超时时间">
                <template #suffix>ms</template>
            </a-input-number>
        </a-form-item>
        <a-form-item label="通知关闭时间" id="notificationTime">
            <a-input-number controls-position="right" v-model="instance.notificationTime" :min="0" :step="1000"
                            placeholder="单位（ms）">
                <template #suffix>ms</template>
            </a-input-number>
        </a-form-item>


        <a-alert id="display">显示设置</a-alert>
        <a-form-item label="默认分页大小" id="pageSize">
            <a-input-number controls-position="right" v-model="instance.pageSize"></a-input-number>
        </a-form-item>
        <a-form-item label="默认视图" id="defaultViewer">
            <a-select v-model="instance.defaultViewer">
                <a-option label="基础视图" :value="1"></a-option>
                <a-option label="JSON视图" :value="2"></a-option>
                <a-option label="表格视图" :value="3"></a-option>
                <a-option label="JSON树视图" :value="4"></a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="JSON视图 - 字体大小" id="jsonFontSize">
            <a-input-number controls-position="right" v-model="instance.jsonFontSize"></a-input-number>
        </a-form-item>
        <a-form-item label="JSON视图 - 换行">
            <a-switch v-model="instance.jsonWrap" :checked-value="true" :unchecked-value="false" type="round">
                <template #checked>换行</template>
                <template #unchecked>不换行</template>
            </a-switch>
        </a-form-item>
        <a-form-item label="JSON视图主题 - 白天">
            <a-select v-model="instance.jsonThemeByLight">
                <a-option v-for="theme in JsonTheme.light" :label="theme" :value="theme"/>
            </a-select>
        </a-form-item>
        <a-form-item label="JSON视图主题 - 黑夜">
            <a-select v-model="instance.jsonThemeByDark">
                <a-option v-for="theme in JsonTheme.dark" :label="theme" :value="theme"/>
            </a-select>
        </a-form-item>
        <a-form-item>
            <template #label>
                <span>表格视图页头模式</span>
                <a-tooltip content="基础查询和高级查询" placement="top" effect="light">
                    <icon-question-circle style="margin-left: 5px;"/>
                </a-tooltip>
            </template>
            <a-select v-model="instance.tableHeaderMode">
                <a-option label="索引映射" :value="TableHeaderModeEnum.MAPPING"/>
                <a-option label="实时渲染" :value="TableHeaderModeEnum.RENDER"/>
            </a-select>
        </a-form-item>


        <a-alert id="other">其他设置</a-alert>
        <a-form-item id="lastUrl">
            <template #label>
                <span>保存上次选择的连接</span>
                <a-tooltip content="保存后，下一次打开es-client自动选中该链接" placement="top" effect="light">
                    <icon-question-circle style="margin-left: 5px;"/>
                </a-tooltip>
            </template>
            <a-switch v-model="instance.lastUrl" :checked-value="true" :unchecked-value="false" type="round">
                <template #checked>保存</template>
                <template #unchecked>忽略</template>
            </a-switch>
        </a-form-item>

    </a-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
// 状态管理
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import JsonTheme from "@/data/JsonTheme";

// 枚举
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";

import {getDefaultGlobalSetting, GlobalSetting} from "@/entity/setting/GlobalSetting";
import useIndexStore from "@/store/IndexStore";


export default defineComponent({
    name: 'setting-base',
    data: () => ({
        instance: getDefaultGlobalSetting(),
        homeExcludeIndicesConfig: {
            input: false,
            value: ''
        },
        homeIncludeIndicesConfig: {
            input: false,
            value: ''
        },
        actives: [''],
        LayoutModeEnum,
        PageNameEnum,
        JsonTheme,
        TableHeaderModeEnum,
    }),
    created() {
        this.instance = useGlobalSettingStore().globalSetting;
    },
    watch: {
        instance: {
            handler(newValue: GlobalSetting) {
                useGlobalSettingStore().setGlobalSetting(newValue);
            },
            deep: true
        }
    },
    methods: {
        removeHomeExcludeIndex(index: string) {
            useGlobalSettingStore().removeHomeExcludeIndex(index);
            useIndexStore().reset();
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
                useGlobalSettingStore().addHomeExcludeIndex(this.homeExcludeIndicesConfig.value);
                this.homeExcludeIndicesConfig = {
                    input: false,
                    value: ''
                }
                useIndexStore().reset();
            }
        },
        removeHomeIncludeIndex(index: string) {
            useGlobalSettingStore().removeHomeIncludeIndex(index);
            useIndexStore().reset();
        },
        addHomeIncludeIndexClick() {
            this.homeIncludeIndicesConfig.input = true;
            this.$nextTick(() => {
                let homeIncludeIndexInput = this.$refs['homeIncludeIndexInput'] as HTMLInputElement;
                homeIncludeIndexInput.focus()
            })
        },
        addHomeIncludeIndex() {
            this.homeIncludeIndicesConfig.input = false;
            if (this.homeIncludeIndicesConfig.value !== '') {
                useGlobalSettingStore().addHomeIncludeIndex(this.homeIncludeIndicesConfig.value);
                this.homeIncludeIndicesConfig = {
                    input: false,
                    value: ''
                }
                useIndexStore().reset();
            }
        },
    }
});
</script>
<style lang="less">
.home-exclude-index {
    margin-left: 5px;

    &:first-child {
        margin-left: 0;
    }
}

.home-exclude-item {
    margin-left: 5px;
}

.like-red {
    color: rgb(var(--orange-6));
}

.setting-global {
    margin-top: 7px;

    .toc {
        position: fixed;
        top: 108px;
        right: 24px;
        max-height: calc(100vh - 176px);
        overflow: auto;
        background-color: var(--color-neutral-2);
        border: 1px solid var(--color-neutral-3);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .arco-form-item-wrapper-col {
        width: 350px;
    }
}
</style>
