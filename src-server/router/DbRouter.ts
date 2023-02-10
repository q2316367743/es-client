import {Router} from "express";

const app = Router();

// 获取全部列表
app.get(':tableName/list', (req, rsp) => {
    rsp.json({
        success: true
    });
});

// 获取一条数据
app.get(':tableName/one', (req, rsp) => {
    rsp.json({
        success: true
    });
});

// 新增一条数据
app.post(':tableName/save', (req, rsp) => {
    rsp.json({
        success: true
    });
});

// 修改数据
app.put(':tableName/update', (req, rsp) => {
    rsp.json({
        success: true
    });
});

// 删除数据
app.delete(':tableName/delete', (req, rsp) => {
    rsp.json({
        success: true
    });
});

export default app;