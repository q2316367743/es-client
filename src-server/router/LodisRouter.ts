import {Router} from "express";
import SqliteInstance from "../component/SqliteInstance";

const app = Router();


// 获取一条数据
app.post('/get', (req, rsp) => {
    let key = req.body.key;
    if (!key) {
        rsp.json({
            success: false,
            data: "key不存在"
        });
        return;
    }
    SqliteInstance.all("select * from dict where `key` = ?", key, (err, rows) => {
        if (err) {
            console.error(err)
            rsp.json({
                success: false,
                data: err
            });
            return;
        }
        if (rows.length > 0) {
            rsp.json({
                success: true,
                data: rows.map(row => {
                    return {
                        id: rows[0].id,
                        value: JSON.parse(rows[0].value)
                    }
                })
            });
        } else {
            rsp.json({
                success: false,
                data: "未找到数据"
            })
        }
    })
});

// 设置一条数据
app.put('/set', (req, rsp) => {
    let key = req.body.key;
    let value = req.body.value;
    if (!key) {
        rsp.json({
            success: false,
            data: "key不能为空"
        });
        return;
    }
    SqliteInstance.prepare("insert into dict(`key`, value) values (?, ?)", [key, value], error => {
        if (error) {
            rsp.json({
                success: false,
                data: error
            });
        } else {
            rsp.json({
                success: true
            });
        }
    })
});

// 删除一条数据
app.delete('/remove', (req, rsp) => {
    rsp.json({
        success: true
    });
});


export default app;