<p align="center">
<a href="./README.md">简体中文</a> | <a href="./README.en.md">English</a>
</p>

<p align="center">
<img src="./public/logo.png" alt="ES-Client Logo" width="120">
</p>

<h1 align="center">ES-Client</h1>

<p align="center"><strong>轻量、高效、安全的 Elasticsearch 桌面客户端</strong></p>

<p align="center">
<a href="https://gitee.com/qiaoshengda/es-client">
<img src="https://gitee.com/qiaoshengda/es-client/badge/star.svg?theme=white" alt="Gitee Stars">
</a>
<a href="https://github.com/q2316367743/es-client">
<img src="https://img.shields.io/github/stars/q2316367743/es-client?style=social" alt="GitHub Stars">
</a>
</p>

<p align="center">
<a href="https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo">
<img src="https://img.shields.io/badge/Edge-v3.1.9-%23242624" alt="Edge 插件">
</a>
<a href="https://chromewebstore.google.com/detail/es-client/pkhmgepniefdigphghbolofjgbnhnhfd">
<img src="https://img.shields.io/badge/Chrome-v3.1.9-%23ff3847" alt="Chrome 插件">
</a>
</p>

<p align="center">
👉
<a href="https://es-client.esion.xyz" target="_blank">官网</a> •
<a href="https://es-client.esion.xyz/docs/app/es-client-open" target="_blank">文档</a> •
<a href="https://es-client.esion.xyz/feedback/app/es-client-open" target="_blank">反馈</a> 👈
</p>

## 💡 为什么需要 ES-Client？

Elasticsearch 的官方工具如 Kibana 功能强大但笨重，而老牌插件 elasticsearch-head 已停止维护且体验陈旧。

ES-Client 应运而生——专为个人开发者与运维人员打造，聚焦日常高频场景，提供轻量、快速、安全、单机可用的管理体验。

* ✅ 无需部署服务
* ✅ 无团队协作依赖
* ✅ 开箱即用，零配置上手

## 🚀 核心功能亮点

### 🔍 智能索引管理

* 自动分组：按前缀、日期或正则表达式智能归类索引，告别上千日志索引的混乱列表
* 折叠操作：一键展开/收起索引组，批量操作更高效

### 🎨 可视化配置向导

* 创建索引：图形化设置 mapping 与 settings
* ILM 策略：可视化定义生命周期管理规则
* 索引模板：所见即所得地配置模板，降低 DSL 学习成本

### ⚠️ 安全批量操作

支持 _update_by_query / _delete_by_query
三重保障：操作预览 + 实时进度条 + 随时取消，彻底杜绝误删风险

### 📊 深度性能诊断

* 慢查询分析面板：自动捕获高耗时请求

* 集成 explain 与 profile 可视化，快速定位：
  * 未索引字段
  * 分片过多
  * 脚本性能瓶颈

### 📤 流式大数据导出（Pro）

* 支持 10万+ 行 数据导出至 CSV / Excel / JSON
* 实时进度显示 + 断点续导，大任务不卡顿、不丢失

### 🩺 集群健康速览（Pro）

仪表盘一键展示：
* 节点数量
* 分片状态（未分配/恢复中）
* 磁盘水位 & 只读警告
* 异常自动高亮提醒，运维更安心

### 🔒 高危操作审计（Pro）

* 自动记录删除、修改等敏感操作的上下文
* 支持快速回溯与问题定位

## 📥 安装与使用
- [Edge 商店](https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo)
- Chrome（需科学上网）：[Chrome Web Store](https://chromewebstore.google.com/detail/es-client/pkhmgepniefdigphghbolofjgbnhnhfd)

## 🖼️ 界面预览

| 首页                | 数据浏览                | 基础查询                |
|-------------------|---------------------|---------------------|
| ![首页](/img/1.png) | ![数据浏览](/img/2.png) | ![基础查询](/img/3.png) |

| 高级查询                | 设置                | 关于                |
|---------------------|-------------------|-------------------|
| ![高级查询](/img/4.png) | ![设置](/img/5.png) | ![关于](/img/6.png) |

## 🛠 技术栈
前端：Vue 3 + TypeScript + Vite 5 + Arco Design
插件体系：Chrome / Edge

## ❤️ 开源与支持

Gitee：[https://gitee.com/qiaoshengda/es-client](https://gitee.com/qiaoshengda/es-client)（主仓库，推荐提 Issue）

GitHub：[https://github.com/q2316367743/es-client](https://github.com/q2316367743/es-client)

文档：[文档中心](https://es-client.esion.xyz/docs/app/es-client-open)

反馈：[反馈中心](https://es-client.esion.xyz/feedback/app/es-client-open)

立即体验 ES-Client，让 Elasticsearch 管理变得简单、安全、高效！ 🚀