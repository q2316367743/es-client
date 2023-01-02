import { Log, Repository } from "@/view/Data";

export default {
    name: "es-client",
    version: "2.1.0",
    author: "Esion",
    platform: "browser",
    repository: [
        {
            "name": "Gitee",
            "url": "https://gitee.com/qiaoshengda/es-client"
        },
        {
            "name": "微软edge插件商店",
            "url": "https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo"
        },
        {
            "name": "Firefox插件商店",
            "url": "https://addons.mozilla.org/addon/es-client"
        }
    ] as Repository[],
    // @ts-ignore
    feedback: import.meta.env.VITE_FEEDBACK_URL,
    log: [
        {
            version: "2.1.0",
            time: "2023-01-02",
            items: [
                "★数据浏览增加功能：新增数据、修改数据、删除数据",
                "升级依赖版本，删除无用依赖，优化打包体积",
                "解决由于按需导入引起的ElMessageBox样式问题",
                "增加强迫症设置"
            ]
        },
        {
            version: "2.0.0",
            time: "2022-12-17",
            items: [
                "★全新的UI",
                "★增加黑夜模式",
                "修复了返回顶部",
                "去除无用组件，优化打包大小",
                "新增索引增加复制新增语句",
                "选择URL后修改标题",
                "首页搜索支持模糊搜索",
                "文本编辑器改为CodeMirror"
            ]
        },
        {
            version: "1.5.0",
            time: "2022-12-01",
            items: [
                "数据浏览功能强化"
            ]
        }, {
            version: "1.4.0",
            time: "2022-11-23",
            items: [
                "项目重构，结构调整",
                "超时时间可设置",
                "基础搜索显示优化",
                "新增链接逻辑优化"
            ]
        }, {
            version: "1.3.0",
            time: "2022-09-05",
            items: [
                "增加认证",
                "刷新索引不会重置搜索条件",
                "更便捷的别名新增"
            ],
            remark: "注意：如果使用认证，如果显示跨域问题，需要在elasticsearch中加入<code>http.cors.allow-headers:\"Content-Type\"</code>"
        }, {
            version: "1.2.0",
            time: "2022-06-20",
            items: [
                "修复基础查询字段【移除】问题",
                "修复部分布局"
            ],
        }, {
            version: "1.1.0",
            time: "2022-06-02",
            items: [
                "去除无用语句",
                "新增编辑器视图"
            ],
        }, {
            version: "1.0.0",
            time: "2022-05-26",
            items: [
                "页面布局重构，更加清爽",
                "页面增加返回顶部，更加灵活"
            ],
        }, {
            version: "0.9.3",
            time: "2022-05-17",
            items: [
                "修复高级查询语法提示错误",
                "表格视图增加列筛选"
            ],
        }, {
            version: "0.9.2",
            time: "2022-05-16",
            title: "",
            items: [
                "基础查询增加字段排序"
            ],
            remark: ""
        }, {
            version: "0.9.1",
            time: "2022-04-29",
            items: [
                "修复服务器地址更新页面不刷新问题",
                "数据预览增加别名"
            ],
        }, {
            version: "0.9.0",
            time: "2022-04-29",
            items: [
                "新增数据浏览功能",
                "新增表格视图"
            ],
        }, {
            version: "0.8.1",
            time: "2022-04-28",
            items: [
                "修复基础查询字段选择失效问题",
                "完善基础查询条件"
            ],
        }, {
            version: "0.8.0",
            time: "2022-04-01",
            items: [
                "优化样式",
                "高级查询搜索增加语法提示"
            ]
        }, {
            version: '0.7.0',
            time: '2022-03-04',
            items: [
                "优化代码逻辑，减少卡顿",
                "增加集群健康值显示"
            ]
        }, {
            version: '0.6.0',
            time: '2022-02-17',
            items: [
                "链接管理优化，可以在首页上面新增链接",
                "基础查询功能优化",
                [
                    "文档选择中增加别名",
                    "文档按照名称排序",
                    "字段按照名称排序"
                ],
                "增加Firefox插件",
                "多个列表新增返回顶部"
            ],
            remark: "链接在设置 => 链接管理中管理，进行增删改查"
        }, {
            version: "0.5.0",
            time: "2022-02-10",
            items: [
                "使用ts和vue3进行重写",
                "支持国际化",
                "高级搜索中不允许修改链接",
                "设置中的链接管理希望有名称用于区分",
                "上面的链接管理可以通过下拉框名称进行连接",
                "高级搜索去除选择链接地址"
            ]
        }, {
            version: "0.4.4",
            time: "2021-12-18",
            items: [
                "增加分片和副本的显示"
            ]
        }, {
            version: "0.4.3",
            time: "2021-12-12",
            items: [
                "增加了意见反馈",
                "高级搜索增加快速完成"
            ]
        }, {
            version: "0.4.0",
            time: "2021-11-13",
            items: [
                "重构了路由",
                "完成了首页功能",
                "完善了基础查询，但现在字段仍只支持一级对象类型"
            ]
        }, {
            version: "0.3.0",
            time: "2021-11-09",
            title: "完成基本功能",
            items: [
                "完成首页部分功能",
                "增加搜索历史"
            ]
        }, {
            version: "0.2.0",
            time: "2021-11-08",
            title: "完成基本功能",
            items: [
                "索引查询",
                "基础查询",
                "高级查询",
                "增加chrome插件"
            ]
        }, {
            version: "0.1.0",
            time: "2021-11-08",
            title: "完成项目雏形",
            items: [
                "确定了基本功能",
                "完成了基本布局"
            ]
        }
    ] as Log[]
}