<template>
    <div class="about">
        <div class="block">
            <span>仿照</span>
            <el-link href="https://github.com/mobz/elasticsearch-head" target="_blank">elasticsearch head</el-link>
            <span>编写的es查询客户端，使用vue+element-ui编写比elasticsearch-head更美观，比Kibana更加轻量</span>
        </div>
        <div class="title-1">项目地址</div>
        <div content="content">
            <div>码云地址：<el-link href="https://gitee.com/qiaoshengda/es-client" target="_blank">es-client</el-link></div>
            <div>微软edge插件商店地址：<el-link href="https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo" target="_blank">es-client</el-link></div>
        </div>
        <div class="title-1">更新日志</div>
        <div class="content">
            <el-timeline>
                <el-timeline-item timestamp="2021-12-18" placement="top">
                    <el-card>
                        <div>0.4.4</div>
                        <ol>
                            <li>增加分片和副本的显示</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2021-12-12" placement="top">
                    <el-card>
                        <div>0.4.3</div>
                        <ol>
                            <li>增加了意见反馈</li>
                            <li>高级搜索增加快速完成</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2021-11-13" placement="top">
                    <el-card>
                        <div>0.4.0</div>
                        <ol>
                            <li>重构了路由</li>
                            <li>完成了首页功能</li>
                            <li>完善了基础查询，但现在字段仍只支持一级对象类型</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2021-11-09" placement="top">
                    <el-card>
                        <div>0.3.0</div>
                        <div>完成基本功能</div>
                        <ol>
                            <li>完成首页部分功能</li>
                            <li>增加搜索历史</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2021-11-08" placement="top">
                    <el-card>
                        <div>0.2.0</div>
                        <div>完成基本功能</div>
                        <ol>
                            <li>索引查询</li>
                            <li>基础查询</li>
                            <li>高级查询</li>
                            <li>增加chrome插件</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2021-11-08" placement="top">
                    <el-card>
                        <div>0.1.0</div>
                        <div>完成项目雏形</div>
                        <ol>
                            <li>确定了基本功能</li>
                            <li>完成了基本布局</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "about"
});
</script>

<style lang="less" scoped>
.about {
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
        ol{
            padding: 20px;
        }
    }
}
</style>