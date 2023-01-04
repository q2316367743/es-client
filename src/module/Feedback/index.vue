<template>
    <div class="entry">
        <ul>
            <li>金山文档❤️：
                <el-link :href="data.feedback" target="_blank" type="primary">es-client问题反馈</el-link>
            </li>
            <li>
                <span>在</span>
                <el-link href="https://gitee.com/qiaoshengda/es-client" target="_blank" type="primary">码云
                </el-link>
                <span>提交issue或评论</span>
            </li>
            <li>
                <span>在</span>
                <el-link
                    href="https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo"
                    target="_blank" type="primary">edge插件商店
                </el-link>
                <span>进行评论</span>
            </li>
            <li>如果有好的想法，可以提交
                <el-link href="https://gitee.com/qiaoshengda/es-client/pulls" target="_blank" type="primary">Pull
                    Requests
                </el-link>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Constant from "@/global/Constant";

export default defineComponent({
    name: 'feedback-module',
    data: () => ({
        data: Constant
    })
});
</script>
<style scoped>

</style>