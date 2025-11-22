<template>
  <div class="json-view hljs" :style="{ fontSize: Optional.ofNullable(jsonFontSize).orElse(16) + 'px' }">
    <pre class="language-json hljs" v-html="pretty"></pre>
    <a-button v-if="copy" type="text" link class="json-view-copy" @click="execCopy">复制</a-button>
  </div>
</template>
<script lang="ts">
import {mapState} from "pinia";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import Optional from "@/utils/Optional";
import {formatJsonString} from "@/algorithm/file";
import MessageUtil from "@/utils/MessageUtil";
import {copyText} from "@/utils/BrowserUtil";

export default defineComponent({
  name: 'json-view',
  props: {
    value: {
      type: String,
      default: '{}'
    },
    copy: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: () => ({
    Optional
  }),
  computed: {
    ...mapState(useGlobalSettingStore, ['jsonFontSize']),
    pretty() {
      return formatJsonString(this.value);
    }
  },
  methods: {
    execCopy() {
      copyText(this.pretty);
      MessageUtil.success("成功复制到剪切板");
    },
  }
});
</script>
<style lang="less">
.json-view {
  position: relative;

  .json-view-copy {
    position: absolute;
    top: 12px;
    right: 20px;
  }

  .hljs {
    padding-top: 0;

    span {
      cursor: text;
    }
  }
}
</style>
