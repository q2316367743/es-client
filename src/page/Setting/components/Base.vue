<template>
    <a-form :model="instance" layout="vertical" class="setting-base">
        <a-collapse v-model="actives">
            <!-- 布局设置 -->
            <a-collapse-item :header="$t('setting.base.layout.title')" key="1">
                <a-form-item label="默认页面">
                    <a-select v-model="instance.defaultPage">
                        <a-option :value="PageNameEnum.HOME" label="概览" />
                        <a-option :value="PageNameEnum.DATA_BROWSER" label="数据浏览" />
                        <a-option :value="PageNameEnum.BASE_SEARCH" label="基础搜索" />
                        <a-option :value="PageNameEnum.SENIOR_SEARCH" label="高级搜索" />
                    </a-select>
                </a-form-item>
            </a-collapse-item>
            <a-collapse-item :header="$t('setting.base.newIndex.title')" key="2">
                <a-form-item :label="$t('setting.base.newIndex.defaultShardNumber')">
                    <a-input-number controls-position="right" v-model="instance.defaultShard"></a-input-number>
                </a-form-item>
                <a-form-item :label="$t('setting.base.newIndex.defaultReplicaNumber')">
                    <a-input-number controls-position="right" v-model="instance.defaultReplica"></a-input-number>
                </a-form-item>
            </a-collapse-item>
            <!-- 全局索引查询条件 -->
            <a-collapse-item key="3">
                <template #header>
                    全局索引查询条件（修改后请
                    <span class="like-link">刷新</span>
                    索引）
                </template>
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
                            <icon-question-circle style="margin-left: 5px;" />
                        </a-tooltip>
                    </template>
                    <a-tag v-for="index in instance.homeExcludeIndices" :key="index" closable color="blue"
                        :disable-transitions="false" @close="removeHomeExcludeIndex(index)" class="home-exclude-index">
                        {{ index }}
                    </a-tag>
                    <a-input v-if="homeExcludeIndicesConfig.input" ref="homeExcludeIndexInput"
                        v-model="homeExcludeIndicesConfig.value" size="small" @keyup.enter="addHomeExcludeIndex"
                        @blur="addHomeExcludeIndex" style="width: 72px;" class="home-exclude-item" />
                    <a-button type="primary" v-else size="small" @click="addHomeExcludeIndexClick"
                        class="home-exclude-item">
                        新增索引
                    </a-button>
                </a-form-item>
            </a-collapse-item>
            <!-- 时间设置 -->
            <a-collapse-item :header="$t('setting.base.time.title')" key="4">
                <a-form-item :label="$t('setting.base.time.timeout')">
                    <a-input-number controls-position="right" v-model="instance.timeout" :min="0" :step="1000"
                        :placeholder="$t('setting.base.time.timeoutPlaceholder')"></a-input-number>
                </a-form-item>
                <a-form-item label="通知关闭时间">
                    <a-input-number controls-position="right" v-model="instance.notificationTime" :min="0" :step="1000"
                        placeholder="单位（ms）"></a-input-number>
                </a-form-item>
            </a-collapse-item>
            <!-- 显示设置 -->
            <a-collapse-item :header="$t('setting.base.display.title')" key="5">
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
                <a-form-item :label="$t('setting.base.display.jsonViewThemeLight')">
                    <a-select v-model="instance.jsonThemeByLight">
                        <a-option v-for="theme in JsonTheme.light" :label="theme" :value="theme" />
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('setting.base.display.jsonViewThemeDark')">
                    <a-select v-model="instance.jsonThemeByDark">
                        <a-option v-for="theme in JsonTheme.dark" :label="theme" :value="theme" />
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <template #label>
                        <span>表格视图页头模式</span>
                        <a-tooltip content="基础查询和高级查询" placement="top" effect="light">
                            <icon-question-circle style="margin-left: 5px;" />
                        </a-tooltip>
                    </template>
                    <a-select v-model="instance.tableHeaderMode">
                        <a-option label="索引映射" :value="TableHeaderModeEnum.MAPPING"/>
                        <a-option label="实时渲染" :value="TableHeaderModeEnum.RENDER" />
                    </a-select>
                </a-form-item>
            </a-collapse-item>
            <!-- 标签栏设置 -->
            <a-collapse-item header="标签栏设置" key="6">
                <a-form-item>
                    <template #label>
                        <span>是否启用标签栏</span>
                        <a-tooltip content="基础查询和高级查询" placement="top" effect="light">
                            <icon-question-circle style="margin-left: 5px;" />
                        </a-tooltip>
                    </template>
                    <a-switch v-model="instance.showTab" :checked-value="true" :unchecked-value="false" type="round">
                        <template #checked>启用</template>
                        <template #unchecked>禁用</template>
                    </a-switch>
                </a-form-item>
                <a-form-item>
                    <template #label>
                        <span>标签载入方式</span>
                        <a-tooltip content="高级查询有效" placement="top" effect="light">
                            <icon-question-circle style="margin-left: 5px;" />
                        </a-tooltip>
                    </template>
                    <a-radio-group v-model="instance.tabLoadMode" :disabled="instance.showTab">
                        <a-radio :value="1">追加</a-radio>
                        <a-radio :value="2">覆盖</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item>
                    <template #label>
                        <span>标签栏最大数量</span>
                        <a-tooltip content="数量太多会导致性能变差" placement="top" effect="light">
                            <icon-question-circle style="margin-left: 5px;" />
                        </a-tooltip>
                    </template>
                    <a-input-number controls-position="right" v-model="instance.tabMaxCount"
                        :disabled="!instance.showTab" />
                </a-form-item>
                <a-form-item label="标签栏超过最大数量后的关闭模式">
                    <a-radio-group v-model="instance.tabCloseMode" :disabled="!instance.showTab">
                        <a-radio :value="TabCloseModeEnum.ALERT">警告</a-radio>
                        <a-radio :value="TabCloseModeEnum.FIRST">关闭第一个</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-collapse-item>
            <!-- 其他设置 -->
            <a-collapse-item :header="$t('setting.base.other.title')" key="7">
                <a-form-item :label="$t('setting.base.other.fullScreen.title')">
                    <a-switch v-model="instance.autoFullScreen" :checked-value="true" :unchecked-value="false" type="round">
                        <template #checked>{{ $t('common.operation.open') }}</template>
                        <template #unchecked>{{ $t('common.operation.close') }}</template>
                    </a-switch>
                </a-form-item>
                <a-form-item>
                    <template #label>
                        <span>保存上次选择的连接</span>
                        <a-tooltip content="保存后，下一次打开es-client自动选中该链接" placement="top" effect="light">
                            <icon-question-circle style="margin-left: 5px;" />
                        </a-tooltip>
                    </template>
                    <a-switch v-model="instance.lastUrl" :checked-value="true" :unchecked-value="false" type="round">
                        <template #checked>保存</template>
                        <template #unchecked>忽略</template>
                    </a-switch>
                </a-form-item>
                <a-form-item label="备份">
                    <a-button type="primary" @click="backup">下载</a-button>
                </a-form-item>
            </a-collapse-item>
        </a-collapse>
    </a-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import XEUtils from "xe-utils";
// 状态管理
import useSettingStore from "@/store/SettingStore";
import useLoadingStore from "@/store/LoadingStore";

import {
    applicationLaunch,
    baseSearchHistoryService,
    lodisStrategyContext,
    nativeStrategyContext,
    seniorSearchHistoryService,
    urlService
} from "@/global/BeanFactory";
import Constant from "@/global/Constant";
import JsonTheme from "@/data/JsonTheme";
import emitter from "@/plugins/mitt";

// 枚举
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";

import Setting from "@/domain/Setting";
import MessageUtil from "@/utils/MessageUtil";
import DownloadType from "@/strategy/NativeStrategy/DownloadType";

let isInit = false;
let isFirst = true;

export default defineComponent({
    name: 'setting-base',
    data: () => ({
        instance: useSettingStore().getDefaultValue(),
        homeExcludeIndicesConfig: {
            input: false,
            value: ''
        },
        actives: [''],
        LayoutModeEnum,
        TabCloseModeEnum,
        PageNameEnum,
        JsonTheme,
        TableHeaderModeEnum
    }),
    created() {
        // 默认值
        if (!this.instance.tabMaxCount) {
            this.instance.tabMaxCount = useSettingStore().getTabMaxCount;
        }
        if (!this.instance.tabCloseMode) {
            this.instance.tabCloseMode = useSettingStore().getTabCloseMode;
        }
        applicationLaunch.register(() => {
            this.instance = useSettingStore().instance;
            isInit = true;
            return Promise.resolve();
        })
    },
    watch: {
        instance: {
            handler(newValue: Setting) {
                if (isInit) {
                    if (isFirst) {
                        isFirst = false;
                    } else {
                        useSettingStore().setInstance(newValue);
                    }
                }
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
        async backup(): Promise<void> {
            useLoadingStore().start('开始准备数据');
            try {
                useLoadingStore().setText('获取链接数据')
                let url = await urlService.list();
                useLoadingStore().setText('获取基础搜索历史');
                let baseSearchHistory = await baseSearchHistoryService.list();
                useLoadingStore().setText('获取高级搜索历史');
                let seniorSearchHistory = await seniorSearchHistoryService.list();
                useLoadingStore().setText('获取设置信息');
                let version = await lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.VERSION);
                let setting = await lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.SETTING);
                let editorSetting = await lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.EDITOR_SETTING);
                useLoadingStore().setText('开始下载');
                nativeStrategyContext.getStrategy().download(JSON.stringify({
                    version: Constant.version,
                    time: XEUtils.toDateString(new Date(), 'yyyy-MM-dd HH:ss:mm'),
                    url, baseSearchHistory, seniorSearchHistory,
                    lodis: {
                        version,
                        setting,
                        editorSetting
                    }
                }, null, 4), `数据备份下载-${new Date().getTime()}.json`, DownloadType.JSON);
            } catch (e: any) {
                MessageUtil.error('下载失败', e);
            } finally {
                useLoadingStore().close();
            }
            return Promise.resolve();
        }
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

.like-link {
    color: rgb(var(--arcoblue-6));
}

.setting-base {
    margin-top: 10px;

    .arco-form-item-wrapper-col {
        width: 350px;
    }
}
</style>