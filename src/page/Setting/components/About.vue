<template>
    <div class="about entry">
        <div class="title-1">es-client</div>
        <div class="block">
            <span>仿照</span>
            <el-link href="https://github.com/mobz/elasticsearch-head" target="_blank" type="primary">elasticsearch
                head
            </el-link>
            <span>编写的es查询客户端，使用</span>
            <el-link href="https://v3.cn.vuejs.org/" type="primary">vue3</el-link>
            <span>+</span>
            <el-link href="https://vitejs.cn/" type="primary">vite2</el-link>
            <span>+</span>
            <el-link href="https://www.typescriptlang.org/" type="primary">typescript</el-link>
            <span>+</span>
            <el-link href="https://element-plus.gitee.io/zh-CN/" type="primary">element-plus</el-link>
            <span>编写，比elasticsearch-head更美观，比Kibana更加轻量</span>
        </div>
        <div class="title-2">项目地址</div>
        <div content="content">
            <div v-for="repo in data.repository">
                {{ repo.name }}：
                <el-link :href="repo.url" target="_blank" type="primary">es-client</el-link>
            </div>
        </div>
        <div class="title-2">文档</div>
        <div class="content">
            <el-link href="https://docs.esion.xyz/project-1/doc-1/" target="_blank" type="primary">文档</el-link>
        </div>
        <div class="title-2">建议反馈</div>
        <div content="content">
            <ul>
                <li>金山文档：
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
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"

import Constant from "@/global/Constant";
import './post.css'


export default defineComponent({
    name: "setting-about",
    data: () => ({
        data: Constant
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