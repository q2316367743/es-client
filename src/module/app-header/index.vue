<template>
  <t-header id="header">
    <div class="left">
      <t-tooltip :content="name || 'ES-client'">
        <div class="logo" :title="name || 'ES-client'">
          {{ name || 'ES-client' }}
        </div>
      </t-tooltip>
      <!-- 索引服务器选择 -->
      <t-select
        v-model="urlId"
        :placeholder="$t('placeholder.select_link')"
        filterable
        clearable
        @change="selectUrl"
        class="url-select"
        :style="{ width: width + 'px' }"
      >
        <t-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.id" />
        <template #panel-bottom-content>
          <div class="select-panel-footer">
            <t-button theme="primary" variant="text" block @click="openAddLink()">
              {{ $t('action.add_link') }}
            </t-button>
          </div>
        </template>
      </t-select>
      <!-- 刷新按钮 -->
      <t-button
        theme="primary"
        class="refresh"
        @click="refresh()"
        :disabled="!urlId || urlId === ''"
      >
        {{ $t('action.refresh') }}
      </t-button>
      <t-progress
        v-if="total_shards > 0"
        :percentage="Math.round((active_shards / total_shards) * 100)"
        :status="status"
        class="mt-9px w-220px ml-14px"
      >
        <template #label> {{ active_shards }} / {{ total_shards }} </template>
      </t-progress>
    </div>
    <div class="right">
      <!--      <LinkExtend style="margin-right: 8px;"/>-->
      <!-- 系统通知 -->
      <SystemNotify />
      <!-- 各种信息弹框 -->
      <app-info class-name="menu-item" />
      <!-- 语言切换 -->
      <t-dropdown trigger="click">
        <t-button shape="square" variant="text" theme="primary">
          <template #icon>
            <translate-icon />
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="setLang('zh-CN')">简体中文</t-dropdown-item>
          <t-dropdown-item @click="setLang('zh-TW')">繁体中文</t-dropdown-item>
          <t-dropdown-item @click="setLang('en')">English</t-dropdown-item>
          <t-dropdown-item @click="setLang('ja')">日本語</t-dropdown-item>
          <t-dropdown-item @click="setLang('de')">Deutsch</t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <!-- 主题切换 -->
      <t-dropdown trigger="click">
        <t-button shape="square" variant="text" theme="primary">
          <template #icon>
            <sunny-icon v-if="mode === 'light'" />
            <moon-icon v-else-if="mode === 'dark'" />
            <fill-color-icon v-else />
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="setMode('light')">
            <template #prefix-icon>
              <sunny-icon />
            </template>
            {{ $t('theme.light') }}
          </t-dropdown-item>
          <t-dropdown-item @click="setMode('dark')">
            <template #prefix-icon>
              <moon-icon />
            </template>
            {{ $t('theme.dark') }}
          </t-dropdown-item>
          <t-dropdown-item @click="setMode('auto')">
            <template #prefix-icon>
              <fill-color-icon />
            </template>
            {{ $t('theme.auto') }}
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <!-- 版本 -->
      <t-dropdown @select="versionCommand" placement="bottom-right" trigger="click">
        <t-button class="menu-item" variant="text" theme="primary" style="padding: 0 7px">
          {{ Constant.version }}
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="versionCommand('feedback')">
            <template #prefix-icon>
              <chat-message-icon />
            </template>
            {{ $t('action.feedback') }}
          </t-dropdown-item>
          <t-dropdown-item @click="versionCommand('log')">
            <template #prefix-icon>
              <chat-bubble-history-icon />
            </template>
            {{ $t('action.changelog') }}
          </t-dropdown-item>
          <t-dropdown-item @click="versionCommand('repository')">
            <template #prefix-icon>
              <logo-github-icon />
            </template>
            {{ $t('action.repository') }}
          </t-dropdown-item>
          <t-dropdown-item @click="versionCommand('about')">
            <template #prefix-icon>
              <InfoCircleIcon />
            </template>
            {{ $t('action.about') }}
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </div>
  </t-header>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Constant } from '@/global/Constant'
import PageNameEnum from '@/enumeration/PageNameEnum'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import AppInfo from './app-info.vue'
import { useIndexStore, useUrlStore } from '@/store'
import { useColorMode } from '@/hooks'
import Assert from '@/utils/Assert'
import { setItem } from '@/utils/utools/DbStorageUtil'
import { openAddLink } from '@/page/setting/pages/link/components/EditLink'
import { openUrl } from '@/utils/BrowserUtil'
import {
  ChatBubbleHistoryIcon,
  ChatMessageIcon,
  FillColorIcon,
  InfoCircleIcon,
  LogoGithubIcon,
  MoonIcon,
  SunnyIcon,
  TranslateIcon
} from 'tdesign-icons-vue-next'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const size = useWindowSize()

const urlId = ref<number | string | undefined>(useUrlStore().id)

const urls = computed(() => useUrlStore().urls)
const { colorMode } = useColorMode()
const mode = computed(() => colorMode.value)
const name = computed(() => useIndexStore().name)
const status = computed(() => {
  const status = useIndexStore().status
  if (status === 'yellow') {
    return 'warning'
  } else if (status === 'green') {
    return 'success'
  } else if (status === 'red') {
    return 'error'
  }
  return 'active'
})
const active_shards = computed(() => useIndexStore().active_shards)
const total_shards = computed(() => useIndexStore().total_shards)
const width = computed(() => size.width.value / 5)

const { locale, t } = useI18n()
function setLang(lang: string) {
  locale.value = lang
  localStorage.setItem(LocalNameEnum.KEY_LOCAL, lang)
}

watch(
  () => urlId.value,
  (value) => setItem(LocalNameEnum.KEY_LAST_URL, value)
)
watch(
  () => useUrlStore().id,
  (value) => {
    if (value !== urlId.value) {
      urlId.value = value
    }
  }
)

const refresh = () => useIndexStore().reset()

function setMode(m: 'light' | 'dark' | 'auto') {
  colorMode.value = m
}

async function selectUrl(value: any) {
  // 清空链接
  if (value === '') {
    // 清空链接选择
    useUrlStore().clear()
    // 清空索引信息
    useIndexStore().clear()
    // 发哦送清空事件
    return
  }
  // 选择链接
  Assert.isTrue(useUrlStore().choose(value as number), t('error.link_not_found'))
  // 索引刷新
  await useIndexStore().reset()
}

function versionCommand(command: string) {
  switch (command) {
    case 'about':
      router.push(PageNameEnum.MORE_ABOUT)
      break
    case 'log':
      router.push(PageNameEnum.MORE_UPDATE)
      break
    case 'repository':
      openUrl(Constant.repositories[1].url)
      break
    case 'update':
      alert(t('action.check_update'))
      break
    case 'feedback':
      openUrl(Constant.url.feedback)
      break
  }
}
</script>
<style scoped>
.select-panel-footer {
  border-top: 1px solid var(--td-component-stroke);
  padding: 6px;
}
</style>
