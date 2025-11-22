<template>
  <div class="entry">
    <p>
      建议使用
      <a-link target="_blank" @click="open(data.txc)">兔小巢</a-link>
      进行建议反馈，无须登录即可留言。
    </p>
    <p>
      当然，你也可以在
      <a-link href="https://gitee.com/qiaoshengda/es-client" target="_blank" type="primary">码云
      </a-link>
      提交issue或评论，我也会尽快回复。如果你也会前端技术，有好的想法，可以提交
      <a-link href="https://gitee.com/qiaoshengda/es-client/pulls" target="_blank" type="primary">Pull
        Requests
      </a-link>
    </p>
    <p>
      chrome用户也可以在
      <a-link
        @click="open(data.distributes.chrome)"
        target="_blank" type="primary">chrome插件商店
      </a-link>
      进行评论与打分。
    </p>
    <p>
      edge用户也可以在
      <a-link
        @click="open(data.distributes.edge)"
        target="_blank" type="primary">edge插件商店
      </a-link>
      进行评论与打分。
    </p>
    <p>
      firefox用户也可以在
      <a-link
        @click="open(data.distributes.firefox)"
        target="_blank" type="primary">firefox附加组件
      </a-link>
      进行评论与打分。
    </p>
    <p>
      utools用户也可以在
      <a-link @click="open(data.distributes.utools)" target="_blank" type="primary">utools插件商店</a-link>
      进行评论与打分。
    </p>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Constant from "@/global/Constant";
import {openUrl} from "@/utils/BrowserUtil";

// TODO：反馈只可以返回一个位置
export default defineComponent({
  name: 'feedback-module',
  data: () => ({
    data: Constant
  }),
  methods: {
    open(url: string) {
      openUrl(url);
    }
  }
});
</script>
<style scoped>

</style>
