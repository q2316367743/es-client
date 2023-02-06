import express, {json} from 'express';
import * as path from "path";
import serveStatic from 'serve-static';
import FetchRouter from "./router/FetchRouter";
import LodisRouter from "./router/LodisRouter";
import DbRouter from "./router/DbRouter";


const app = express();

// 中间件
app.use(json());

// 静态资源服务器
const rootPath = path.join('public');
app.use(serveStatic(rootPath));

// 跨域问题
app.all("*", function (req, res, next) {
    // 设置允许跨域的域名,*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*');
    // 允许的header类型
    res.header('Access-Control-Allow-Headers', '*');
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200); // 让options 尝试请求快速结束
    else
        next();
});

// 跨域问题
app.use('/api/fetch', FetchRouter);
app.use('/api/lodis', LodisRouter);
app.use('/api/db', DbRouter);

console.log('服务器运行在：http://localhost:3000')

app.listen(3000);