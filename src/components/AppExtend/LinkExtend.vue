<template>
  <a class="link-extend" :href="Constant.url.download" target="_blank" @click="onClick">
    <span class="link-content">{{ currentLine }}</span>
    <span class="link-icon">⚡</span>
  </a>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";
import Constant from "@/global/Constant";
import {useUmami} from "@/plugins/umami";

const lines = [
  "导出超过 1000 行就卡顿？桌面版支持无限制导出",
  "需要可视化聚合？试试桌面版"
];

const currentLine = ref(lines[0]);
let intervalId: number | null = null;

const getRandomLine = () => {
  const randomIndex = Math.floor(Math.random() * lines.length);
  return lines[randomIndex];
};

const updateLine = () => {
  currentLine.value = getRandomLine();
};

const onClick = () => {
  // 记录
  useUmami.track("APP引流", "首页banner")
};

onMounted(() => {
  // 初始延迟1秒后开始切换，避免一加载就变化
  setTimeout(() => {
    intervalId = window.setInterval(updateLine, 5000); // 每5秒更换一次文案
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
<style scoped lang="less">
.link-extend {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #165DFF 0%, #71AEDD 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
  font-weight: 500;
  line-height: 32px;
  height: 32px;

  .link-content {
    margin-right: 8px;
  }

  .link-icon {
    font-size: 1.2em;
    animation: pulse 2s infinite;
  }

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>