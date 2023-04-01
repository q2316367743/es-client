import { Log, LogItemEnum } from "@/view/Data";

export default [
    {
        version: '2.8.0',
        sign: 280,
        time: '2023-04-01',
        items: [{
            label: LogItemEnum.UPDATE,
            content: '高级查询结果页多标签'
        }, {
            label: LogItemEnum.ADD,
            content: '基础查询增加terms查询'
        }, {
            label: LogItemEnum.ADD,
            content: '表格视图增加索引映射'
        }, {
            label: LogItemEnum.ADD,
            content: '高级查询增加JavaScript过滤'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: 'web版增加pwa'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '高级查询不会默认增加请求体',
            txc: 'https://support.qq.com/products/489458/post/167955607788497292/'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '更换高级查询格式化算法，以解决long精度丢失问题',
            txc: 'https://support.qq.com/products/489458/post/167963038032084087/'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: 'JSON视图可以换行',
            gitee: {
                title: '高级搜索能否添加自动换行',
                content: 'https://gitee.com/qiaoshengda/es-client/issues/I6NAW6'
            }
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '高级查询历史记录树形展示，双击名称载入'
        }, {
            label: LogItemEnum.REPAIR,
            content: '基础查询切换索引重置分页'
        }, {
            label: LogItemEnum.REPAIR,
            content: '数据浏览页面，选择别名，将使用别名查询，但不能进行增删改',
            gitee: {
                title: '数据浏览页面，选择 别名，实际使用了 索引名称查询',
                content: 'https://gitee.com/qiaoshengda/es-client/issues/I6S2N7'
            }
        }]
    },
    {
        version: '2.7.0',
        sign: 270,
        time: '2023-03-09',
        items: [{
            label: LogItemEnum.UPDATE,
            content: '基础查询与高级查询导出功能重构，可以导出更多格式',
            txc: 'https://support.qq.com/products/489458/post/167757411610000064'
        }, {
            label: LogItemEnum.UPDATE,
            content: '表格视图改版，新支持列筛选、列拖拽',
            txc: 'https://support.qq.com/products/489458/post/167653894259013579'
        }, {
            label: LogItemEnum.REPAIR,
            content: '修复数据浏览增删改查接口',
            txc: 'https://support.qq.com/products/489458/post/167818262295914736'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: 'utools版本主题跟随utools设置'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '自定义高级查询执行按钮颜色',
            txc: 'https://support.qq.com/products/489458/post/167824208025616352'
        }],
        doc: 'http://es-client.esion.xyz/article/270/'
    },
    {
        version: '2.6.2',
        sign: 262,
        time: '2023-03-03',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '修复高级查询语法解析错误',
            gitee: {
                title: '新建query查询条件无法执行，出现多个执行按钮',
                content: 'https://gitee.com/qiaoshengda/es-client/issues/I6HHJG'
            }
        }, {
            label: LogItemEnum.REPAIR,
            content: '修复概览别名展示错误'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '优化颜色，全局颜色更加统一'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '优化高级查询结果展示'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '优化基础查询结果展示'
        }, {
            label: LogItemEnum.ADD,
            content: '新增JSON树视图和基础视图，基础视图主要用于展示非JSON数据'
        }]
    },
    {
        version: '2.6.1',
        sign: 261,
        time: '2023-02-24',
        items: [{
            label: LogItemEnum.OPTIMIZATION,
            content: '全局loading超时进行提示，避免无法操作'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '基础搜索历史记录的使用'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '概览展示细节优化'
        }, {
            label: LogItemEnum.REPAIR,
            content: '基础查询新增数据错误'
        }, {
            label: LogItemEnum.REPAIR,
            content: '基础搜索表格视图最后一排被隐藏',
            txc: 'https://support.qq.com/products/489458/post/167703728675805795/'
        }, {
            label: LogItemEnum.REPAIR,
            content: 'ES版本策略识别错误',
            txc: 'https://support.qq.com/products/489458/post/167696662123830625/'
        }, {
            label: LogItemEnum.ADD,
            content: '发行版：vscode拓展'
        }, {
            label: LogItemEnum.ADD,
            content: '增加消息中心，现在可以展示http异常的想要内容了'
        }, {
            label: LogItemEnum.ADD,
            content: '基础搜索条件和排序增加是否启用',
            txc: 'https://support.qq.com/products/489458/post/167703760819408023/'
        }]
    },
    {
        version: '2.6.0',
        sign: 260,
        time: '2023-02-17',
        items: [{
            label: LogItemEnum.UPDATE,
            content: '将UI组件库从element-plus改为arco-design'
        }, {
            label: LogItemEnum.ADD,
            content: '可以自定义JSON视图字体大小，增加rest client编辑器设置'
        }, {
            label: LogItemEnum.ADD,
            content: '新增映射信息树形展示，新增索引映射信息支持多层映射'
        }, {
            label: LogItemEnum.ADD,
            content: '设置中新增记住上一次链接，开启后，下次访问自动选择该链接'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '高级查询rest client再次升级，在编辑器内就可以发送请求'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '基础搜索可自定义分页大小'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '10s未关闭全局loading，进行提示'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '标签页是否隐藏变为是否启用'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '数据浏览与基础查询的索引'
        }, {
            label: LogItemEnum.REPAIR,
            content: '修复索引管理未刷新异常'
        }],
        doc: 'https://www.yuque.com/baozhiyige-tewwf/ygxv4r/zm52vqonettg8uz1'
    },
    {
        version: '2.5.0',
        sign: 250,
        time: '2023-02-10',
        items: [{
            label: LogItemEnum.OPTIMIZATION,
            content: '高级查询勉强实现rest client功能'
        }, {
            label: LogItemEnum.UPDATE,
            content: '界面改版，布局更加紧凑'
        }, {
            label: LogItemEnum.UPDATE,
            content: '删除同步功能，在设置 => 其他设置中可以下载备份数据'
        }, {
            label: LogItemEnum.REPAIR,
            content: '链接更新异常'
        }, {
            label: LogItemEnum.REPAIR,
            content: 'utools中链接点击无效'
        }]
    },
    {
        version: '2.4.0',
        sign: 240,
        time: '2023-02-03',
        items: [{
            label: LogItemEnum.ADD,
            content: '概览点击索引可以进行索引管理与查看更加详细的数据'
        }, {
            label: LogItemEnum.ADD,
            content: '文件同步初步 - 暂不建议使用，只有下载完成了，上传有点问题'
        }, {
            label: LogItemEnum.ADD,
            content: '默认页面设置'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '更新国际化'
        }, {
            label: LogItemEnum.REPAIR,
            content: '修复json视图复制错误'
        }]
    },
    {
        version: '2.3.0',
        sign: 230,
        time: '2023-01-17',
        items: [{
            label: LogItemEnum.OPTIMIZATION,
            content: '概览使用虚拟列表，修复偶尔白屏问题'
        }, {
            label: LogItemEnum.ADD,
            content: '基础查询增加历史和标签页'
        }, {
            label: LogItemEnum.ADD,
            content: '高级查询增加历史和标签页'
        }],
        doc: 'https://www.yuque.com/baozhiyige-tewwf/ygxv4r/ebl4u2ghgwv5gw2z'
    },
    {
        version: '2.2.0',
        sign: 220,
        time: '2023-01-06',
        items: [{
            label: LogItemEnum.ADD,
            content: '索引操作页面新增套转到高级查询'
        }, {
            label: LogItemEnum.ADD,
            content: '更新后自动展示更新提示，第一次安装会展示关于页面'
        }, {
            label: LogItemEnum.ADD,
            content: '设置 - 新增布局方式切换'
        }, {
            label: LogItemEnum.ADD,
            content: '数据浏览 - 右侧弹框，显示索引设置和映射结构'
        }, {
            label: LogItemEnum.UPDATE,
            content: '链接管理改版 - 表格组件改为vxe,支持链接查询、导出，筛选'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '关于、更新、问题反馈页面改版'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '查询条件没有值不显示清空按钮'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '高级查询表格组件改为vxe，支持数据下载，字段筛选'
        }, {
            label: LogItemEnum.REPAIR,
            content: '高级查询表格视图无法下滑'
        }]
    },
    {
        version: "2.1.1",
        sign: 211,
        time: "2023-01-03",
        items: [
            "紧急修复超时设置无效/异常",
            "数据浏览 - 新增数据后展示新增ID",
            "链接管理样式改版",
            "左下角增加黑夜模式修改"
        ]
    },
    {
        version: "2.1.0",
        sign: 210,
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
        sign: 200,
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
        sign: 150,
        time: "2022-12-01",
        items: [
            "数据浏览功能强化"
        ]
    }, {
        version: "1.4.0",
        sign: 140,
        time: "2022-11-23",
        items: [
            "项目重构，结构调整",
            "超时时间可设置",
            "基础搜索显示优化",
            "新增链接逻辑优化"
        ]
    }, {
        version: "1.3.0",
        sign: 130,
        time: "2022-09-05",
        items: [
            "增加认证",
            "刷新索引不会重置搜索条件",
            "更便捷的别名新增"
        ],
        remark: "注意：如果使用认证，如果显示跨域问题，需要在elasticsearch中加入<code>http.cors.allow-headers:\"Content-Type\"</code>"
    }, {
        version: "1.2.0",
        sign: 120,
        time: "2022-06-20",
        items: [
            "修复基础查询字段【移除】问题",
            "修复部分布局"
        ],
    }, {
        version: "1.1.0",
        sign: 110,
        time: "2022-06-02",
        items: [
            "去除无用语句",
            "新增编辑器视图"
        ],
    }, {
        version: "1.0.0",
        sign: 100,
        time: "2022-05-26",
        items: [
            "页面布局重构，更加清爽",
            "页面增加返回顶部，更加灵活"
        ],
    }, {
        version: "0.9.3",
        sign: 93,
        time: "2022-05-17",
        items: [
            "修复高级查询语法提示错误",
            "表格视图增加列筛选"
        ],
    }, {
        version: "0.9.2",
        sign: 92,
        time: "2022-05-16",
        title: "",
        items: [
            "基础查询增加字段排序"
        ],
        remark: ""
    }, {
        version: "0.9.1",
        sign: 91,
        time: "2022-04-29",
        items: [
            "修复服务器地址更新页面不刷新问题",
            "数据预览增加别名"
        ],
    }, {
        version: "0.9.0",
        sign: 90,
        time: "2022-04-29",
        items: [
            "新增数据浏览功能",
            "新增表格视图"
        ],
    }, {
        version: "0.8.1",
        sign: 81,
        time: "2022-04-28",
        items: [
            "修复基础查询字段选择失效问题",
            "完善基础查询条件"
        ],
    }, {
        version: "0.8.0",
        sign: 80,
        time: "2022-04-01",
        items: [
            "优化样式",
            "高级查询搜索增加语法提示"
        ]
    }, {
        version: '0.7.0',
        sign: 70,
        time: '2022-03-04',
        items: [
            "优化代码逻辑，减少卡顿",
            "增加集群健康值显示"
        ]
    }, {
        version: '0.6.0',
        sign: 60,
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
        sign: 50,
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
        sign: 44,
        time: "2021-12-18",
        items: [
            "增加分片和副本的显示"
        ]
    }, {
        version: "0.4.3",
        sign: 43,
        time: "2021-12-12",
        items: [
            "增加了意见反馈",
            "高级搜索增加快速完成"
        ]
    }, {
        version: "0.4.0",
        sign: 40,
        time: "2021-11-13",
        items: [
            "重构了路由",
            "完成了首页功能",
            "完善了基础查询，但现在字段仍只支持一级对象类型"
        ]
    }, {
        version: "0.3.0",
        sign: 30,
        time: "2021-11-09",
        title: "完成基本功能",
        items: [
            "完成首页部分功能",
            "增加搜索历史"
        ]
    }, {
        version: "0.2.0",
        sign: 20,
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
        sign: 10,
        time: "2021-11-08",
        title: "完成项目雏形",
        items: [
            "确定了基本功能",
            "完成了基本布局"
        ]
    }
] as Log[]