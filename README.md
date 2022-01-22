# es-client

仿照[elasticsearch head](https://github.com/mobz/elasticsearch-head)编写的es查询客户端，使用vite+vue3+ts+element-plus编写。

## 注意：

目前项目正在使用`vite+vue3+ts+element-plus`进行重构，如需试用浏览，请查看vue2分支

## 项目使用

目前可以打包成

- chrome插件（推荐）
- 静态文件
- exe应用

预览地址：[es-client](https://project.esion.xyz/es-client/)**（注意：需要开启es的跨域）**

## 项目打包

### chrome插件

如果你使用的是edge浏览器，本项目已经推送edge商店，插件地址：[es-client](https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo)

```bash
npm install
npm run build
```

之后在 `/chrome`文件夹下建立 `es-client`文件夹，将 `/dist`文件夹中内容复制到 `/chrome/es-client`文件夹中

安装：打开浏览器，打开拓展，将`chrome`文件夹拖入浏览器

### 火狐拓展

已增加火狐拓展源文件，但由于不会翻墙，所以无法发布到火狐拓展中心

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
4. SQL搜索未开始

## 未来计划

1. 完成首页操作按钮
2. 优化历史记录，使用indexedDB记录历史记录
3. 完成基础查询（注意es可以存储对象的问题）
4. 基础查询，高级查询增加table视图
5. 增加使用SQL查询es的方法
