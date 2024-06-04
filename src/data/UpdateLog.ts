import {Log, LogItemEnum} from "@/view/Data";

export default [
    {
        version: '3.1.7',
        sign: 317,
        time: '2024-06-04',
        items: [{
            label: LogItemEnum.UPDATE,
            content: "【插件】提升JSON树视图字符串节点的可读性，支持换行和制表符"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【插件】继续解决精度丢失问题"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【插件】新增url时，对于异常的url进行提示"
        }, {
            label: LogItemEnum.ADD,
            content: "【插件】可以在设置中设置JSON字体大小，来修改数据展示的大小"
        }, {
            label: LogItemEnum.ADD,
            content: "【高级查询】记住高级查询分栏大小"
        }],
        remark: "如果大家有更好的建议、或者需要的功能，欢迎在【兔小巢】中提出来，一起完善。"
    },
    {
        version: '3.1.6',
        sign: 316,
        time: '2024-40-28',
        items: [{
            label: LogItemEnum.REPAIR,
            content: "【高级查询】编辑器内容会被保存，下次打开编辑器，内容不会丢失"
        }],
        remark: "如果大家有更好的建议、或者需要的功能，欢迎在【兔小巢】中提出来，一起完善。祝大家五一劳动节快乐！"
    },
    {
        version: '3.1.5',
        sign: 315,
        time: '2024-03-17',
        items: [{
            label: LogItemEnum.ADD,
            content: "【数据浏览】增加设置，可以突破10000条限制"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【高级查询】载入问题"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【链接管理】修复了分页导致的数据丢失，现在不进行分页"
        }],
        remark: "如果大家有更好的建议、或者需要的功能，欢迎在【兔小巢】中提出来，一起完善"
    },
    {
        version: '3.1.4',
        sign: 314,
        time: '2024-03-03',
        items: [{
            label: LogItemEnum.REPAIR,
            content: "【插件】上方链接选择器根据窗口宽度自适应"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【高级查询】修复过滤器失败的问题"
        }],
        remark: "如果大家有更好的建议、或者需要的功能，欢迎在【兔小巢】中提出来，一起完善"
    },
    {
        version: '3.1.3',
        sign: 313,
        time: '2024-02-01',
        items: [{
            label: LogItemEnum.REPAIR,
            content: "【数据浏览】修复【>|<|>=|<=】无法使用的问题。"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【高级查询】修复无法保存视图设置的问题"
        }],
        remark: "如果大家有更好的建议、或者需要的功能，欢迎在【兔小巢】中提出来，一起完善"
    },
    {
        version: '3.1.2',
        sign: 312,
        time: '2024-01-16',
        items: [{
            label: LogItemEnum.ADD,
            content: "【链接管理】在基础认证里密码不再明文显示。"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【仪表盘】对于溢出窗口大小的信息无滚动条，且无法滚动。"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【高级查询】修复格式化问题"
        }],
        remark: "如果大家有更好的建议、或者需要的功能，欢迎在【兔小巢】中提出来，一起完善"
    },
    {
        version: '3.1.1',
        sign: 311,
        time: '2023-12-25',
        items: [{
            label: LogItemEnum.ADD,
            content: "【基础搜索、高级搜索】新增钉住功能，可以将结果创建新的窗口展示，用于多个搜索结果的对比"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【插件】修复部分情况下，json解析错误问题"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【数据浏览】右键能力大加强，右键单元格可以直接新增条件，右键表头可以直接进行筛选"
        }],
        remark: "如果大家有更好的建议、或者需要的功能，欢迎在【兔小巢】中提出来，一起完善"
    },
    {
        version: '3.1.0',
        sign: 310,
        time: '2023-12-14',
        items: [{
            label: LogItemEnum.UPDATE,
            content: "【插件】引入jsx，弹窗组件更加丝滑"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【插件】优化集群健康值显示，现在显示为进度条的形式"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【数据浏览】优化新增、编辑文档组件，编辑器使用monaco editor，编辑更加舒适"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【概览】优化索引新增组件，现在会校验索引为是否正确"
        }, {
            label: LogItemEnum.ADD,
            content: "【仪表盘】新增cat页面，快速查看集群信息，并且将数据以表格形式展示吗，更加直观"
        }, {
            label: LogItemEnum.ADD,
            content: "【仪表盘】新增分析页面，快速对索引中指定字段查询中对于指定文本的分词情况"
        }, {
            label: LogItemEnum.ADD,
            content: "【概览】新增reindex API，快速进行索引迁移"
        }, {
            label: LogItemEnum.ADD,
            content: "【插件】electron新增自动更新"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【插件】修复存在关闭的索引，无法初始化的问题"
        }],
        remark: "如果大家有更好的建议、或者需要的功能，欢迎在【兔小巢】中提出来，一起完善"
    },
    {
        version: '3.0.7',
        sign: 307,
        time: '2023-12-04',
        items: [{
            label: LogItemEnum.ADD,
            content: "颜色模式新增跟随系统"
        }, {
            label: LogItemEnum.ADD,
            content: "新增编辑器视图，可以直接搜索结果，显示更加清晰（基础搜索、高级搜索）"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '在导出全部数据时，新增滚动API，避免出现超过10000条记录而报错的问题',
            txc: "https://txc.qq.com/products/489458/post/170139928052973806/"
        }, {
            label: LogItemEnum.UPDATE,
            content: '在首页将副本与分片的展示移除，在仪表盘新增标签页【副本与分片】'
        }, {
            label: LogItemEnum.REPAIR,
            content: "尝试修复JSON解析错误问题"
        }],
        remark: "由于我试了好几个版本的es，都没有出现JSON解析问题，目前只是尝试修复，如果后续有用户反馈，我再进行修复。"
    },
    {
        version: '3.0.6',
        sign: 306,
        time: '2023-11-15',
        items: [{
            label: LogItemEnum.ADD,
            content: '新增链接导入导出',
        }, {
            label: LogItemEnum.UPDATE,
            content: '更新数据浏览的表格组件，新的组件支持右键菜单，可以快速复制数据、切换选中等功能',
            txc: 'https://support.qq.com/products/489458/post/169951634472374187/'
        }, {
            label: LogItemEnum.REPAIR,
            content: '尝试解决utools端和electron客户端中，如果服务器开启https但没有证书导致报错的问题',
        }, {
            label: LogItemEnum.REPAIR,
            content: '尝试修复tauri客户端部分组件',
        }]
    },
    {
        version: '3.0.5',
        sign: 305,
        time: '2023-10-18',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '修复中文名索引查询映射关系url错误问题',
            gitee: {
                title: '3.0.4查看索引映射的时候报AxiosError异常',
                content: 'https://gitee.com/qiaoshengda/es-client/issues/I86FO1'
            }
        }, {
            label: LogItemEnum.REPAIR,
            content: '修复HTTP客户端，无法使用Basic认证问题',
            txc: 'https://support.qq.com/products/489458/post/169700870484188099/'
        }]
    },
    {
        version: '3.0.4',
        sign: 304,
        time: '2023-09-27',
        items: [{
            label: LogItemEnum.ADD,
            content: '新增VConsole控制台，可以查看报错原因，在右上角的bug对话框下面打开'
        }, {
            label: LogItemEnum.ADD,
            content: '基础查询增加missing查询条件',
            gitee: {
                title: "基础筛选希望新增exist类",
                content: "https://gitee.com/qiaoshengda/es-client/issues/I79OFV"
            }
        }, {
            label: LogItemEnum.ADD,
            content: '数据浏览准备增加快捷提示，选择链接、索引后，在条件输入框中输入时，会有提示'
        }, {
            label: LogItemEnum.ADD,
            content: '增加服务器相关接口，如果实现了src-server中的接口，可以打包为docker镜像'
        }, {
            label: LogItemEnum.UPDATE,
            content: '数据浏览按钮优化'
        }, {
            label: LogItemEnum.UPDATE,
            content: '首页布局优化，新增两种查询跳转方式',
            gitee: {
                title: "概览 能增加跳转到 数据浏览 的按钮么",
                content: "https://gitee.com/qiaoshengda/es-client/issues/I8425X"
            }
        }, {
            label: LogItemEnum.REPAIR,
            content: '修复打开最后一次链接',
            txc: "https://support.qq.com/products/489458/post/169537698365029241/"
        }]
    },
    {
        version: '3.0.3',
        sign: 303,
        time: '2023-09-21',
        items: [{
            label: LogItemEnum.ADD,
            content: '新增历史记录功能，可以保存记录用于以后重复使用'
        }, {
            label: LogItemEnum.ADD,
            content: '新增文件备份功能'
        }, {
            label: LogItemEnum.UPDATE,
            content: '修复Windows客户端复制等功能无效问题'
        }],
        remark: "新增2.0.0数据迁移功能，在【链接管理】=>【新增旁边的按钮】"
    },
    {
        version: '3.0.2',
        sign: 302,
        time: '2023-09-21',
        items: [{
            label: LogItemEnum.UPDATE,
            content: '紧急新增2.0.0数据迁移功能，在【链接管理】=>【新增旁边的按钮】'
        }],
    },
    {
        version: '3.0.1',
        sign: 301,
        time: '2023-09-20',
        items: [{
            label: LogItemEnum.ADD,
            content: '新增请求日志，可以快速看到错误原因',
            txc: 'https://support.qq.com/products/489458/post/169517661544538636/'
        }, {
            label: LogItemEnum.REPAIR,
            content: "修复Windows客户端无法连接的问题"
        }, {
            label: LogItemEnum.REPAIR,
            content: "打印组件偶尔失效的问题"
        }, {
            label: LogItemEnum.UPDATE,
            content: '首页排序加了回来'
        }],
    },
    {
        version: '3.0.0',
        sign: 300,
        time: '2023-09-18',
        items: [{
            label: LogItemEnum.ADD,
            content: '基础搜索列表框加长',
            txc: 'https://support.qq.com/products/489458/post/168802971946618566/'
        }, {
            label: LogItemEnum.ADD,
            content: '过滤器增加记忆功能'
        }, {
            label: LogItemEnum.ADD,
            content: "链接排序"
        }, {
            label: LogItemEnum.ADD,
            content: "增加备份功能，可以将插件数据备份到WebDAV中"
        }, {
            label: LogItemEnum.REPAIR,
            content: "修复没有请求体传空字符串问题",
            txc: 'https://support.qq.com/products/489458/post/169399208255068883/'
        }, {
            label: LogItemEnum.REPAIR,
            content: "JSON long型不支持",
            txc: "https://support.qq.com/products/489458/post/169398548224812040/"
        }, {
            label: LogItemEnum.REPAIR,
            content: '首页链接名称太长，无法删除'
        }, {
            label: LogItemEnum.REPAIR,
            content: '优化数据浏览模块搜索体验',
            txc: 'https://support.qq.com/products/489458/post/169137502892840521/'
        }, {
            label: LogItemEnum.UPDATE,
            content: '系统重构，底层数据全部优化，单标签页更加流程，修复了一些底层bug'
        }, {
            label: LogItemEnum.UPDATE,
            content: '重构了数据导出功能，可以分页全量导出数据，导出多种格式。数据浏览和基础查询都可以导出。'
        }],
        remark: "本次更新对插件进行了全方位的重构，并且现在还处于基础节点，所以有些功能还没有迁移完，还有些BUG。"
    },
    {
        version: '2.8.6',
        sign: 286,
        time: '2023-08-01',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '修复认证类型未保存，导致请求头认证方式失效'
        }, {
            label: LogItemEnum.REPAIR,
            content: '更新索引信息，刷新后索引信息未更新，实际上已经更新'
        }, {
            label: LogItemEnum.REPAIR,
            content: '基础搜索列表框变长'
        }, {
            label: LogItemEnum.REPAIR,
            content: '由于版本管理设计的不好，映射暂时不渲染'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "优化基础查询的exists，条件可搜索"
        }]
    },
    {
        version: '2.8.5',
        sign: 285,
        time: '2023-07-15',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '优化系统BUG'
        }, {
            label: LogItemEnum.REPAIR,
            content: '提高系统流畅度'
        }]
    },
    {
        version: '2.8.4',
        sign: 284,
        time: '2023-07-03',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '基础查询设置增加是否启用'
        }]
    },
    {
        version: '2.8.3',
        sign: 283,
        time: '2023-06-27',
        items: [{
            label: LogItemEnum.ADD,
            content: '增加基础搜索设置，可以设置自定义参数',
            txc: 'https://support.qq.com/products/489458/post/168664481549600465/'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '优化首页搜索，使用fuse.js进行模糊搜索，更加智能'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '优化首页列表，使用虚拟列表，索引更多任然不卡'
        }]
    },
    {
        version: '2.8.2',
        sign: 282,
        time: '2023-05-30',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '修复Long太长导致进度丢失问题',
            gitee: {
                content: 'https://github.com/q2316367743/es-client/issues/1',
                title: 'Long型数据精度丢失'
            }
        }]
    },
    {
        version: '2.8.1',
        sign: 281,
        time: '2023-04-22',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '高级查询支持通配符',
            gitee: {
                content: 'https://gitee.com/qiaoshengda/es-client/issues/I6VQ24',
                title: '【BUG】请求不支持通配符'
            }
        }, {
            label: LogItemEnum.REPAIR,
            content: '删除索引后在索引框还显示。',
            gitee: {
                title: '删除索引后在索引框还显示。',
                content: 'https://gitee.com/qiaoshengda/es-client/issues/I6R7LN'
            }
        }, {
            label: LogItemEnum.ADD,
            content: '增加多种认证方式'
        }]
    },
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
            label: LogItemEnum.ADD,
            content: '新增只显示指定索引',
            pull: {
                name: 'javalover123',
                url: 'https://gitee.com/javalover123'
            }
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
