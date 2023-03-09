# es-client

> elasticsearch查询客户端。
>
> elasticsearch的客户端比较出名的就是[elasticsearch head](https://github.com/mobz/elasticsearch-head)
> 和[Kibana](https://github.com/elastic/kibana)了，
> 但是elasticsearch head已经停止更新，且样式老旧，功能不全；
> 而Kibana虽功能全面，但是启动麻烦，大部分功能用不上，很不灵活，所以采用vite2+vue3+ts+arco-design进行开发了一个elasticsearch的客户端。

## 详细文档

[语雀](https://www.yuque.com/baozhiyige-tewwf/ygxv4r)

## 反馈社区

[兔小巢](https://support.qq.com/products/489458)

## 安装 & 更新

### 发行版

- [Edge插件](https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo)
- [火狐插件](https://addons.mozilla.org/zh-CN/firefox/addon/es-client/)
- [想天浏览器](https://a.apps.vip/d.appStore/index.html#/share?id=NdAH5w)
- [windows安装包](https://gitee.com/qiaoshengda/es-client/releases)
- [utools](https://www.u.tools/)
- [vscode](https://marketplace.visualstudio.com/items?itemName=m17762618644.es-client)

### 存储

- [百度网盘](https://pan.baidu.com/s/1sTd8aOWai-n3hxMur11iXA?pwd=3e5t)
- [阿里云盘](https://www.aliyundrive.com/s/wRg2ZS2K6ME)
- [夸克网盘](https://pan.quark.cn/s/ad9afd5e88a1)，提取码：FHGs
- [可道云](http://kodcloud.esion.xyz/#s/89HBcbIw)

### 开发

```bash
git clone https://gitee.com/qiaoshengda/es-client.git
yarn install
yarn dev
# open http://localhost:5173
```

### 自行打包

本项目推荐使用`yarn`

1. 安装依赖：`yarn install`
2. 构建浏览器版本：`yarn build`
3. 构建Chrome插件：`yarn build:edge`
4. 构建Firefox插件：`yarn build:firefox`
5. 构建想天浏览器：`yarn build:ts`
6. 构建vscode：`yarn build:vscode`
7. 构建桌面客户端：`yarn tauri build`

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
