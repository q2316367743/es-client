import {Router} from "express";

const app = Router();

// 获取一条数据
app.post('/get', (req, rsp) => {
    rsp.json({
        success: true
    });
});

// 设置一条数据
app.put('/set', (req, rsp) => {
    rsp.json({
        success: true
    });
});

// 删除一条数据
app.delete('/remove', (req, rsp) => {
    rsp.json({
        success: true
    });
});



export default app;