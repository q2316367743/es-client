<template>

    <el-form style="margin-top: 10px;" label-width="160px" label-position="top">
        <el-collapse v-model="actives">
            <el-collapse-item :title="$t('setting.base.layout.title')">
                <el-form-item label="默认页面">
                    <el-select v-model="instance.defaultPage">
                        <el-option :value="PageNameEnum.HOME" label="概览"/>
                        <el-option :value="PageNameEnum.DATA_BROWSER" label="数据浏览"/>
                        <el-option :value="PageNameEnum.BASE_SEARCH" label="基础搜索"/>
                        <el-option :value="PageNameEnum.SENIOR_SEARCH" label="高级搜索"/>
                    </el-select>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item :title="$t('setting.base.newIndex.title')">
                <el-form-item :label="$t('setting.base.newIndex.defaultShardNumber')">
                    <el-input-number controls-position="right" v-model="instance.defaultShard"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('setting.base.newIndex.defaultReplicaNumber')">
                    <el-input-number controls-position="right" v-model="instance.defaultReplica"></el-input-number>
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
            <el-collapse-item :title="$t('setting.base.http.title')">
                <el-form-item :label="$t('setting.base.http.timeout')">
                    <el-input-number controls-position="right" v-model="instance.timeout" :min="0" :step="1000"
                                     :placeholder="$t('setting.base.http.timeoutPlaceholder')"></el-input-number>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item :title="$t('setting.base.display.title')">
                <el-form-item :label="$t('setting.base.display.pageSize')">
                    <el-input-number controls-position="right" v-model="instance.pageSize"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('setting.base.display.defaultView.title')">
                    <el-select v-model="instance.defaultViewer">
                        <el-option :label="$t('common.keyword.jsonView')" :value="2"></el-option>
                        <el-option :label="$t('common.keyword.tableView')" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('setting.base.display.jsonViewThemeLight')">
                    <el-select v-model="instance.jsonThemeByLight">
                        <el-option v-for="theme in JsonTheme.light" :label="theme" :value="theme"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('setting.base.display.jsonViewThemeDark')">
                    <el-select v-model="instance.jsonThemeByDark">
                        <el-option v-for="theme in JsonTheme.dark" :label="theme" :value="theme"/>
                    </el-select>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="标签栏设置">
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
                <el-form-item>
                    <template #label>
                        <span>标签栏最大数量</span>
                        <el-tooltip content="数量太多会导致性能变差" placement="top" effect="light">
                            <el-icon style="margin-left: 5px;">
                                <i class="vxe-icon-question-circle"/>
                            </el-icon>
                        </el-tooltip>
                    </template>
                    <el-input-number controls-position="right" v-model="instance.tabMaxCount"/>
                </el-form-item>
                <el-form-item label="标签栏超过最大数量后的关闭模式">
                    <el-radio-group v-model="instance.tabCloseMode">
                        <el-radio :label="TabCloseModeEnum.ALERT">警告</el-radio>
                        <el-radio :label="TabCloseModeEnum.FIRST">关闭第一个</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item :title="$t('setting.base.other.title')">
                <el-form-item :label="$t('setting.base.other.fullScreen.title')">
                    <el-switch v-model="instance.autoFullScreen" :active-value="true" :inactive-value="false"
                               :active-text="$t('common.operation.open')"
                               :inactive-text="$t('common.operation.close')"/>
                </el-form-item>
                <el-form-item label="备份">
                    <el-button type="primary" @click="backup">下载</el-button>
                </el-form-item>
            </el-collapse-item>
        </el-collapse>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import useSettingStore from "@/store/SettingStore";

import {
    applicationLaunch,
    baseSearchHistoryService, loadingManager,
    lodisStrategyContext,
    seniorSearchHistoryService,
    urlService
} from "@/global/BeanFactory";
import JsonTheme from "@/data/JsonTheme";
import emitter from "@/plugins/mitt";

import LayoutModeEnum from "@/enumeration/LayoutModeEnum";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import Setting from "@/domain/Setting";
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";
import Constant from "@/global/Constant";
import XEUtils from "xe-utils";

export default defineComponent({
    name: 'setting-base',
    data: () => ({
        instance: useSettingStore().getDefaultValue(),
        LayoutModeEnum,
        TabCloseModeEnum,
        PageNameEnum,
        JsonTheme,
        homeExcludeIndicesConfig: {
            input: false,
            value: ''
        },
        actives: ['']
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
            return Promise.resolve();
        })
    },
    watch: {
        instance: {
            handler(newValue: Setting) {
                useSettingStore().setInstance(newValue);
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
            loadingManager.start('开始准备数据');
            try {
                loadingManager.setText('获取链接数据')
                let url = await urlService.list();
                loadingManager.setText('获取基础搜索历史');
                let baseSearchHistory = await baseSearchHistoryService.list();
                loadingManager.setText('获取高级搜索历史');
                let seniorSearchHistory = await seniorSearchHistoryService.list();
                loadingManager.setText('开始下载');
                BrowserUtil.download(JSON.stringify({
                    version: Constant.version,
                    time: XEUtils.toDateString(new Date(), 'yyyy-MM-dd HH:ss:mm'),
                    url, baseSearchHistory, seniorSearchHistory,
                    lodis: {
                        version: lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.VERSION),
                        setting: lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.SETTING)
                    }
                }, null, 4), `数据备份下载-${new Date().getTime()}.json`, 'application/json');
            } catch (e: any) {
                MessageUtil.error('下载失败', e);
            } finally {
                loadingManager.close();
            }
            return Promise.resolve();
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