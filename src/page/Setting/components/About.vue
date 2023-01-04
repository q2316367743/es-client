<template>
    <div class="about entry">
        <div class="title-1">Hi，感谢使用 es-client ！</div>
        <!-- 版本 -->
        <p>
            <span>版本：</span>
            <el-tag>{{ data.version }}</el-tag>
            <el-tag type="success" style="margin-left: 10px;">build {{ data.build }}</el-tag>
        </p>
        <p>
            <span>使用中遇到任何问题，你可以先访问 </span>
            <el-link target="_blank" :href="data.docUrl">用户手册</el-link>
            <span> ，在用户手册里可以查看与功能或产品相关的使用说明以及一些常见问题。</span>
        </p>
        <p>
            <span>如果用户手册没有解决你的问题，或者对项目有什么建议，你可以发送 </span>
            <el-link :href="data.feedback" target="_blank" type="primary">反馈</el-link>
            <span> 或者直接发送邮件到 </span>
            <el-link :href="'mailto:' + data.email">{{ data.email }}</el-link>
            <span> 联系我。</span>
        </p>
        <p>
            <el-link type="primary" @click="licenseDialog = true">开源许可证</el-link>
        </p>
        <div class="title-2">相关资源</div>
        <p>
            <span>仓库：</span>
            <template v-for="(repository, index) in data.repositories">
                <el-link target="_blank" :href="repository.url">{{ repository.name }}</el-link>
                <span v-if="index < data.repositories.length - 1"> | </span>
            </template>
        </p>
        <div class="title-2">建议反馈</div>
        <ul>
            <li>
                <span>金山文档❤️：</span>
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
        <el-dialog title="Apache2.0" v-model="licenseDialog" append-to-body :close-on-click-modal="false" draggable
                   destroy-on-close style="height: 80vh" top="10vh">
            <div style="height: calc(80vh - 60px - 54px)">
                <el-scrollbar>
                    <license-apache2_0/>
                </el-scrollbar>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"

import Constant from "@/global/Constant";
import LicenseApache2_0 from "@/components/License/Apache2_0.vue";

// 许可证


export default defineComponent({
    name: "setting-about",
    components: {LicenseApache2_0},
    data: () => ({
        data: Constant,
        licenseDialog: false,
    })
});
</script>

<style lang="less" scoped>
.about {
    margin-top: 10px;

    div {
        margin: 5px;
    }

    .block {
        padding-left: 10px;
        border-left: #3d3d3d solid 5px;

        a {
            line-height: 21px;
            padding-left: 3px;
            padding-right: 3px;
        }
    }

    .title-1 {
        padding-top: 20px;
        padding-left: 3px;
        padding-bottom: 15px;
        font-size: 36px;
        font-weight: bold;
    }

    .title-2 {
        padding-top: 20px;
        padding-left: 3px;
        padding-bottom: 15px;
        font-size: 24px;
        font-weight: bold;
    }

    .content {
        ol {
            padding: 20px;
        }
    }
}
</style>