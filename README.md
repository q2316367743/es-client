# es-client

仿照elasticsearch head编写的es查询客户端，使用vue+element-ui编写

## 项目使用

目前可以打包成

- 静态文件
- exe应用
- chrome插件

## 项目打包

### 静态文件

```bash
npm install
npm run build
```

文件在`/electron/html`

### exe应用

```bash
npm install
npm run build
cd electron
npm install
npm run package:win32
```

文件在`/electron/out/es-client-win32-x64`

## chrome插件

```bash
npm install
npm run build
```

之后在`/chrome`文件夹下建立`es-client`文件夹，将`/electron/html`文件夹中内容复制到`/chrome/es-client`文件夹中
