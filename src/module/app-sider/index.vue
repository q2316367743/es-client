<template>
  <t-aside
    :collapsed="collapsed"
    :width="collapsed ? '64px' : '232px'"
    style="border-right: 1px solid var(--td-border-level-1-color)"
  >
    <t-menu :collapsed="collapsed" v-model="selectedKeys">
      <t-menu-item :value="PageNameEnum.HOME">
        <template #icon>
          <home-icon />
        </template>
        {{ $t('menu.home') }}
      </t-menu-item>
      <t-menu-item :value="PageNameEnum.DATA_BROWSE">
        <template #icon>
          <table2-icon />
        </template>
        {{ $t('menu.data_browser') }}
      </t-menu-item>
      <t-menu-item :value="PageNameEnum.BASE_SEARCH">
        <template #icon>
          <search-icon />
        </template>
        {{ $t('menu.base_search') }}
      </t-menu-item>
      <t-menu-item :value="PageNameEnum.DEV_TOOL">
        <template #icon>
          <code-icon />
        </template>
        {{ $t('menu.dev_tools') }}
      </t-menu-item>
      <t-menu-item :value="PageNameEnum.CHAT2ES">
        <template #icon>
          <chat-bubble-icon />
        </template>
        {{ $t('menu.chat') }}
      </t-menu-item>
      <t-submenu :value="PageNameEnum.DASHBOARD">
        <template #icon>
          <dashboard-icon />
        </template>
        <template #title>{{ $t('menu.dashboard') }}</template>
        <t-menu-item :value="PageNameEnum.DASHBOARD_INFO">
          {{ $t('menu.dashboard_info') }}
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.DASHBOARD_NODE">
          {{ $t('menu.dashboard_node') }}
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.DASHBOARD_SHARD_AND_REPLICA">
          {{ $t('menu.dashboard_shards') }}
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.DASHBOARD_CAT">
          {{ $t('menu.dashboard_cat') }}
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.DASHBOARD_ANALYSIS">
          {{ $t('menu.dashboard_analysis') }}
        </t-menu-item>
      </t-submenu>
      <t-submenu :value="PageNameEnum.SETTING">
        <template #icon>
          <setting-icon />
        </template>
        <template #title>{{ $t('menu.setting') }}</template>
        <t-menu-item :value="PageNameEnum.SETTING_GLOBAL">
          {{ $t('menu.setting_global') }}
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.SETTING_LINK">
          {{ $t('menu.setting_link') }}
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.SETTING_AI">
          {{ $t('menu.setting_ai') }}
        </t-menu-item>
      </t-submenu>
      <t-submenu :value="PageNameEnum.MORE">
        <template #icon>
          <ellipsis-icon />
        </template>
        <template #title>{{ $t('menu.more') }}</template>
        <t-menu-item :value="PageNameEnum.MORE_UPDATE">
          {{ $t('menu.more_changelog') }}
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.MORE_PRIVACY">
          {{ $t('menu.more_privacy') }}
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.MORE_ABOUT">
          {{ $t('menu.more_about') }}
        </t-menu-item>
      </t-submenu>
      <template #operations>
        <t-button variant="text" shape="square" @click="changeCollapsed()">
          <template #icon>
            <view-list-icon />
          </template>
        </t-button>
      </template>
    </t-menu>
  </t-aside>
</template>
<script lang="ts" setup>
import PageNameEnum from '@/enumeration/PageNameEnum'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import {
  ChatBubbleIcon,
  CodeIcon,
  DashboardIcon,
  EllipsisIcon,
  FilterIcon,
  HomeIcon,
  SearchIcon,
  SettingIcon,
  Table2Icon,
  ViewListIcon
} from 'tdesign-icons-vue-next'

const route = useRoute()
const router = useRouter()

const collapsed = useLocalStorage(LocalNameEnum.KEY_COLLAPSED, true)
const selectedKeys = ref<PageNameEnum>(PageNameEnum.HOME)

const changeCollapsed = useToggle(collapsed)

watch(selectedKeys, (value) => router.push(value))
watch(
  () => route.path,
  (value) => (selectedKeys.value = value as PageNameEnum)
)
</script>
<style scoped></style>
