<template>
    <div class="about">
        <el-scrollbar>
            <div class="block">
                <span>仿照</span>
                <el-link href="https://github.com/mobz/elasticsearch-head" target="_blank">elasticsearch head</el-link>
                <span>编写的es查询客户端，使用</span>
                <el-link href="https://v3.cn.vuejs.org/">vue3</el-link>
                <span>+</span>
                <el-link href="https://vitejs.cn/">vite2</el-link>
                <span>+</span>
                <el-link href="https://www.typescriptlang.org/">typescript</el-link>
                <span>+</span>
                <el-link href="https://element-plus.gitee.io/zh-CN/">element-plus</el-link>
                <span>编写，比elasticsearch-head更美观，比Kibana更加轻量</span>
            </div>
            <div class="title-1">项目地址</div>
            <div content="content">
                <div v-for="repo in data.repository">
                    {{ repo.name }}：
                    <el-link :href="repo.url" target="_blank">es-client</el-link>
                </div>
            </div>
            <div class="title-1">文档</div>
            <div class="content">
                <el-link href="https://docs.esion.xyz/project-1/doc-1/" target="_blank">文档</el-link>
            </div>
            <div class="title-1">意见反馈</div>
            <div content="content">
                <ul>
                    <li>
                        <span>在</span>
                        <el-link href="https://gitee.com/qiaoshengda/es-client" target="_blank">码云</el-link>
                        <span>提交issue或评论</span>
                    </li>
                    <li>
                        <span>在</span>
                        <el-link
                            href="https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo"
                            target="_blank">edge插件商店
                        </el-link>
                        <span>进行评论</span>
                    </li>
                    <li>如果有好的想法，可以提交
                        <el-link href="https://gitee.com/qiaoshengda/es-client/pulls">Pull Requests</el-link>
                    </li>
                </ul>
            </div>
            <div class="title-1">更新日志</div>
            <div class="content">
                <el-timeline>
                    <el-timeline-item :timestamp="log.time" placement="top" v-for="log in data.log">
                        <el-card>
                            <div>{{ log.version }}</div>
                            <div v-if="log.title">{{ log.title }}</div>
                            <ol>
                                <template v-for="item in log.items">
                                    <li v-if="typeof item === 'string'">{{ item }}</li>
                                    <ol v-else>
                                        <li v-for="i in item">{{ i }}</li>
                                    </ol>
                                </template>
                            </ol>
                            <div v-if="log.remark">
                                <span v-if="typeof log.remark === 'string'">{{ log.remark }}</span>
                                <span v-else>
                                <span v-for="item in log.remark">
                                    <span v-if="item.type === 'string'">{{ item.value }}</span>
                                    <el-link v-else :href="item.addon" target="_blank">{{ item.value }}</el-link>
                                </span>
                            </span>
                            </div>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"

import Constant from "@/global/Constant";


export default defineComponent({
    name: "About",
    data: () => ({
        data: Constant
    })
});
</script>

<style lang="less" scoped>
.about {
    height: calc(100% - 5px);
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