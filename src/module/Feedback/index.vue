<template>
    <div class="entry">
        <p>
            建议使用
            <el-link target="_blank" :href="data.txc">兔小巢</el-link>
            进行建议反馈，无须登录即可留言。
        </p>
        <p>
            也可以使用
            <el-link :href="data.feedback" target="_blank" type="primary">金山文档</el-link>
            进行建议反馈，但需要登录WPS账号才能提交建议。
        </p>
        <p>
            当然，你也可以在
            <el-link href="https://gitee.com/qiaoshengda/es-client" target="_blank" type="primary">码云
            </el-link>
            提交issue或评论，我也会尽快回复。如果你也会前端技术，有好的想法，可以提交
            <el-link href="https://gitee.com/qiaoshengda/es-client/pulls" target="_blank" type="primary">Pull
                Requests
            </el-link>
        </p>
        <p>
            edge用户也可以在
            <el-link
                href="https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo"
                target="_blank" type="primary">edge插件商店
            </el-link>
            进行评论与打分。
        </p>
        <p>
            firefox用户也可以在
            <el-link
                href="https://addons.mozilla.org/addon/es-client/"
                target="_blank" type="primary">firefox附加组件
            </el-link>
            进行评论与打分。
        </p>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
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