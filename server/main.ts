import express from 'express';
import * as path from "path";
import serveStatic from 'serve-static';
import {fileURLToPath} from 'url';
import {json} from 'express';
import axios from 'axios';
import HttpStrategyConfig from "./entity/HttpStrategyConfig";
import Result from './entity/Result';

const __filename = fileURLToPath(import.meta.url);

const app = express();

// 中间件
app.use(json());

// 静态资源服务器
const rootPath = path.join(__filename, 'public');
app.use(serveStatic(rootPath));

const instance = axios.create();


// 响应拦截器
instance.interceptors.response.use(
    // 响应不作处理
    response => {
        return response.data;
    },
    error => {
        console.error('err', error)
        return Promise.reject(error)
    }
)

app.post('/api/http', (req, rsp) => {
    let body = req.body as HttpStrategyConfig;
    instance(body).then((result) => {
        rsp.write({
            success: true,
            data: result
        } as Result);
    }).then(e => {
        rsp.write({
            success: false,
            data: e
        } as Result);
    });
})

app.listen(3000);