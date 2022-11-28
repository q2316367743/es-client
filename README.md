# es-client

> 功能上仿照[elasticsearch head](https://github.com/mobz/elasticsearch-head)编写的elasticsearch查询客户端。
> elasticsearch的客户端比较出名的就是elasticsearch head和Kibana了，但是elasticsearch head已经停止更新，且样式老旧，功能不全；而Kibana虽功能全面，但是启动麻烦，大部分功能用不上，很不灵活，所以采用vite2+vue3+ts+element-plus进行开发了一个elasticsearch的客户端。

## 安装 & 更新

本项目已经推送到Firefox拓展和Edge外接程序中，但由于Edge审核比较慢，所以Firefox的更新速度会比Edge快一些，谷歌插件商店上架比较麻烦，所以并未上架。

- [website](https://project.esion.xyz/es-client/)**（基本用不了）**
- [Edge插件](https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo)**（审核有些慢）**
- [火狐插件](https://addons.mozilla.org/addon/es-client/)
- [windows安装包](https://gitee.com/qiaoshengda/es-client/releases/tag/v1.3.0)**（完整功能）**
- [百度网盘](https://pan.baidu.com/s/1sTd8aOWai-n3hxMur11iXA?pwd=3e5t)
- [阿里云盘](https://www.aliyundrive.com/s/wRg2ZS2K6ME)
- [想天浏览器独立应用](https://www.apps.vip/apps/)**（完整功能）**

## 开发

```bash
git clone https://gitee.com/qiaoshengda/es-client.git
npm install
npm run dev
```

## 自行打包

本项目推荐使用`yarn`

1. 安装依赖：`yarn install`
2. 构建：`yarn build`
3. 在`chrome`文件夹中创建文件夹`es-client`，并将dist中文件复制到`chrome/es-client`中

> 上面步骤是打包`chrome`插件，如果是应用程序打包，去掉第三步，其他不变。  
> 如果是火狐插件打包，将第三步的`chrome`换成`firefox`

## 项目预览

- 首页
![图片](https://static.esion.xyz/picture/%E5%9B%BE%E7%89%87.png)
- 数据浏览
![图片-1653033250795](https://static.esion.xyz/picture/%E5%9B%BE%E7%89%87-1653033250795.png)
- 基础查询
![图片-1653033209166](https://static.esion.xyz/picture/%E5%9B%BE%E7%89%87-1653033209166.png)
- 高级查询
![图片-1653033316089](https://static.esion.xyz/picture/%E5%9B%BE%E7%89%87-1653033316089.png)
- 设置
![图片-1653033335849](https://static.esion.xyz/picture/%E5%9B%BE%E7%89%87-1653033335849.png)

## 项目功能

- 链接管理功能
- 索引浏览功能
- 索引管理功能
- 语法提示与高亮
- 。。。

## 详细文档

<http://192.168.31.31:20086/project-1/doc-1/>
