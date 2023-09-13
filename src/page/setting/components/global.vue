<template>
    <a-form :model="instance" layout="vertical" class="setting-base">


        <a-alert>新建索引</a-alert>
        <a-form-item :label="$t('setting.base.newIndex.defaultShardNumber')">
            <a-input-number controls-position="right" v-model="instance.defaultShard"></a-input-number>
        </a-form-item>
        <a-form-item :label="$t('setting.base.newIndex.defaultReplicaNumber')">
            <a-input-number controls-position="right" v-model="instance.defaultReplica"></a-input-number>
        </a-form-item>


        <a-alert>
            全局索引查询条件（修改后请
            <span class="like-red">刷新</span>
            索引）
        </a-alert>
        <a-form-item label="状态">
            <a-radio-group v-model="instance.homeSearchState">
                <a-radio :value="0">不设置</a-radio>
                <a-radio :value="1">打开</a-radio>
                <a-radio :value="2">关闭</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item>
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
        <a-form-item>
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


        <a-alert>时间相关设置</a-alert>
        <a-form-item label="超时时间">
            <a-input-number controls-position="right" v-model="instance.timeout" :min="0" :step="1000"
                            :placeholder="$t('setting.base.time.timeoutPlaceholder')">
                <template #suffix>ms</template>
            </a-input-number>
        </a-form-item>
        <a-form-item label="通知关闭时间">
            <a-input-number controls-position="right" v-model="instance.notificationTime" :min="0" :step="1000"
                            placeholder="单位（ms）">
                <template #suffix>ms</template>
            </a-input-number>
        </a-form-item>


        <a-alert>显示设置</a-alert>
        <a-form-item :label="$t('setting.base.display.pageSize')">
            <a-input-number controls-position="right" v-model="instance.pageSize"></a-input-number>
        </a-form-item>
        <a-form-item :label="$t('setting.base.display.defaultView.title')">
            <a-select v-model="instance.defaultViewer">
                <a-option label="基础视图" :value="1"></a-option>
                <a-option :label="$t('common.keyword.jsonView')" :value="2"></a-option>
                <a-option :label="$t('common.keyword.tableView')" :value="3"></a-option>
                <a-option label="JSON树视图" :value="4"></a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="JSON视图 - 字体大小">
            <a-input-number controls-position="right" v-model="instance.jsonFontSize"></a-input-number>
        </a-form-item>
        <a-form-item label="JSON视图 - 换行">
            <a-switch v-model="instance.jsonWrap" :checked-value="true" :unchecked-value="false" type="round">
                <template #checked>换行</template>
                <template #unchecked>不换行</template>
            </a-switch>
        </a-form-item>
        <a-form-item :label="$t('setting.base.display.jsonViewThemeLight')">
            <a-select v-model="instance.jsonThemeByLight">
                <a-option v-for="theme in JsonTheme.light" :label="theme" :value="theme"/>
            </a-select>
        </a-form-item>
        <a-form-item :label="$t('setting.base.display.jsonViewThemeDark')">
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


        <a-alert>其他设置</a-alert>
        <a-form-item>
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
        <a-form-item label="高级查询是否默认启用过滤">
            <a-switch v-model="instance.seniorFilter" :checked-value="true" :unchecked-value="false"
                      type="round">
                <template #checked>{{ $t('common.operation.open') }}</template>
                <template #unchecked>{{ $t('common.operation.close') }}</template>
            </a-switch>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
// 状态管理
import useSettingStore from "@/store/setting/GlobalSettingStore";
import JsonTheme from "@/data/JsonTheme";
import emitter from "@/plugins/mitt";

// 枚举
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";

import {GlobalSetting, getDefaultGlobalSetting} from "@/entity/setting/GlobalSetting";


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
        TabCloseModeEnum,
        PageNameEnum,
        JsonTheme,
        TableHeaderModeEnum,
    }),
    created() {
        // 默认值
        if (!this.instance.tabMaxCount) {
            this.instance.tabMaxCount = useSettingStore().getTabMaxCount;
        }
        if (!this.instance.tabCloseMode) {
            this.instance.tabCloseMode = useSettingStore().getTabCloseMode;
        }
        this.instance = useSettingStore().globalSetting;
    },
    watch: {
        instance: {
            handler(newValue: GlobalSetting) {
                useSettingStore().setGlobalSetting(newValue);
            },
            deep: true
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
        },
        removeHomeIncludeIndex(index: string) {
            useSettingStore().removeHomeIncludeIndex(index);
            emitter.emit(MessageEventEnum.URL_REFRESH);
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
                useSettingStore().addHomeIncludeIndex(this.homeIncludeIndicesConfig.value);
                this.homeIncludeIndicesConfig = {
                    input: false,
                    value: ''
                }
                emitter.emit(MessageEventEnum.URL_REFRESH);
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

.setting-base {
    margin-top: 10px;

    .arco-form-item-wrapper-col {
        width: 350px;
    }
}
</style>
