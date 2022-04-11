<template>
    <div class="about">
        <div class="block">
            <span>仿照</span>
            <el-link
                href="https://github.com/mobz/elasticsearch-head"
                target="_blank"
            >elasticsearch head</el-link>
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
            <div>
                码云地址：
                <el-link href="https://gitee.com/qiaoshengda/es-client" target="_blank">es-client</el-link>
            </div>
            <div>
                微软edge插件商店地址：
                <el-link
                    href="https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo"
                    target="_blank"
                >es-client</el-link>
            </div>
            <div>
                Firefox插件商店地址：
                <el-link
                    href="https://addons.mozilla.org/addon/es-client"
                    target="_blank"
                >es-client</el-link>
            </div>
        </div>
        <div class="title-1">意见反馈</div>
        <div content="content">
            <li>
                <span>在</span>
                <el-link href="https://gitee.com/qiaoshengda/es-client" target="_blank">码云</el-link>
                <span>提交issue或评论</span>
            </li>
            <li>
                <span>在</span>
                <el-link
                    href="https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo"
                    target="_blank"
                >edge插件商店</el-link>
                <span>进行评论</span>
            </li>
        </div>
        <div class="title-1">更新日志</div>
        <div class="content">
            <el-timeline>
                <el-timeline-item timestamp="2022-04-1" placement="top">
                    <el-card>
                        <div>0.8.0</div>
                        <ol>
                            <li>优化样式</li>
                            <li>高级查询搜索增加语法提示</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2022-03-04" placement="top">
                    <el-card>
                        <div>0.7.0</div>
                        <ol>
                            <li>优化代码逻辑，减少卡顿</li>
                            <li>增加集群健康值显示</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2022-02-17" placement="top">
                    <el-card>
                        <div>0.6.0</div>
                        <ol>
                            <li>链接管理优化，可以在首页上面新增链接</li>
                            <li>基础查询功能优化</li>
                            <ul style="padding-left: 20px;padding-top: 5px;">
                                <li>文档选择中增加别名</li>
                                <li>文档按照名称排序</li>
                                <li>字段按照名称排序</li>
                            </ul>
                            <li>增加<el-link herf="https://addons.mozilla.org/addon/es-client">Firefox插件</el-link></li>
                            <li>多个列表新增返回顶部</li>
                        </ol>
                        <div>链接在设置 => 链接管理中管理，进行增删改查</div>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2022-02-10" placement="top">
                    <el-card>
                        <div>0.5.0</div>
                        <ol>
                            <li>使用ts和vue3进行重写</li>
                            <li>支持国际化</li>
                            <li>高级搜索中不允许修改链接</li>
                            <li>设置中的链接管理希望有名称用于区分</li>
                            <li>上面的链接管理可以通过下拉框名称进行连接</li>
                            <li>高级搜索去除选择链接地址</li>
                        </ol>
                    </el-card>
                </el-timeline-item>
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
    name: "About"
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
        ol {
            padding: 20px;
        }
    }
}
</style>