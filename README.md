# es-client

仿照[elasticsearch head](https://github.com/mobz/elasticsearch-head)编写的es查询客户端，使用vite+vue3+ts+element-plus编写。

## 项目使用

目前可以打包成

- chrome插件（推荐）
- 静态文件
- exe应用

## 项目预览

- [网页端](https://project.esion.xyz/es-client/)**（注意：需要开启es的跨域）**
- [Edge插件](https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo)
- [火狐插件](https://addons.mozilla.org/addon/es-client/)

## 项目打包

### chrome插件

如果你使用的是edge浏览器，本项目已经推送edge商店，插件地址：[es-client](https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo)

```bash
npm install
npm run build
```

之后在 `/chrome`文件夹下建立 `es-client`文件夹，将 `/dist`文件夹中内容复制到 `/chrome/es-client`文件夹中

安装：打开浏览器，打开拓展，将`chrome`文件夹拖入浏览器

### 静态文件

```bash
npm install
npm run build
```

文件在 `/dist`

### exe应用

```bash
npm install
npm run build
cp -r dist/* electron/html
cd electron
npm install
npm run package:win32
```

文件在 `/electron/out/es-client-win32-x64`

## 预览

![预览1](./img/bg1.png)

![预览2](./img/bg2.png)

## 目前进度

1. 概览完成主要功能
2. 基础搜索勉强能用
3. 高级搜索基本完成
4. 设置方面完成国际化和链接管理

## 未来计划

1. 使用虚拟组件优化首页列表
2. 基础查询，高级查询增加table视图
3. 增加使用SQL查询es的方法
4. 缓存使用indexedDB缓存es索引信息，减少切换索引所需要的时间
5. 实现es数据可以通过各种图表展示
