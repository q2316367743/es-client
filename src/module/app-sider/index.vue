<template>
    <a-layout-sider :collapsed="collapsed" :width="150" :collapsed-width="50">
        <a-menu v-model:collapsed="collapsed" v-model:selected-keys="selectedKeys" show-collapse-button>
            <a-menu-item :key="PageNameEnum.HOME">
                <template #icon>
                    <icon-home/>
                </template>
                概览
            </a-menu-item>
            <a-menu-item :key="PageNameEnum.DATA_BROWSE">
                <template #icon>
                    <icon-apps/>
                </template>
                数据浏览
            </a-menu-item>
            <a-menu-item :key="PageNameEnum.BASE_SEARCH">
                <template #icon>
                    <icon-search/>
                </template>
                基础搜索
            </a-menu-item>
            <a-menu-item :key="PageNameEnum.SENIOR_SEARCH">
                <template #icon>
                    <icon-filter/>
                </template>
                高级搜索
            </a-menu-item>
            <!--        <a-sub-menu :key="PageNameEnum.TOOL">-->
            <!--            <template #icon>-->
            <!--                <icon-tool/>-->
            <!--            </template>-->
            <!--            <template #title>工具</template>-->
            <!--            <a-menu-item :key="PageNameEnum.TOOL_WATCH">-->
            <!--                观察器-->
            <!--            </a-menu-item>-->
            <!--            <a-menu-item :key="PageNameEnum.TOOL_SQL">-->
            <!--                SQL-->
            <!--            </a-menu-item>-->
            <!--        </a-sub-menu>-->
            <a-sub-menu :key="PageNameEnum.DASHBOARD">
                <template #icon>
                    <icon-dashboard/>
                </template>
                <template #title>仪表盘</template>
                <a-menu-item :key="PageNameEnum.DASHBOARD_INFO">
                    信息
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.DASHBOARD_NODE">
                    节点
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.DASHBOARD_SHARD_AND_REPLICA">
                    副本与分片
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.DASHBOARD_CAT">
                    _cat
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.DASHBOARD_ANALYSIS">
                    分析
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu :key="PageNameEnum.SETTING">
                <template #icon>
                    <icon-settings/>
                </template>
                <template #title>设置</template>
                <a-menu-item :key="PageNameEnum.SETTING_GLOBAL">
                    全局设置
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.SETTING_SENIOR_FILTER_RECORD">
                    高级查询过滤器
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.SETTING_LINK">
                    链接管理
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.SETTING_BACKUP">
                    备份管理
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu :key="PageNameEnum.MORE">
                <template #icon>
                    <icon-more/>
                </template>
                <template #title>更多</template>
                <a-menu-item :key="PageNameEnum.MORE_UPDATE">
                    更新日志
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.MORE_PRIVACY">
                    隐私协议
                </a-menu-item>
                <a-menu-item :key="PageNameEnum.MORE_ABOUT">
                    关于
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </a-layout-sider>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStorage} from "@vueuse/core";
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {dbStorage} from "@/plugins/distribute";

const route = useRoute();
const router = useRouter();

const collapsed = useStorage(LocalNameEnum.KEY_COLLAPSED, true, dbStorage);
const selectedKeys = ref<Array<PageNameEnum>>([PageNameEnum.HOME]);

watch(() => selectedKeys.value, value => router.push(value[0]));
watch(() => route.path, value => selectedKeys.value = [value as PageNameEnum]);

</script>
<style scoped>

</style>
