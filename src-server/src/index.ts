import Express from 'express';
import axios from 'axios';
import path from 'path';


let app = Express();
let PORT = 8848;

app.use(Express.json());
app.use('/', Express.static(path.join(__dirname, '../dist-static')))


app.post('/api/preload/fetch',(req,res)=>{
    const config = req.body;
    axios.request(config)
    .then(rsp => {
        res.json({
            success: true,
            data: {
                config: rsp.config,
                status: rsp.status,
                statusText: rsp.statusText,
                headers: rsp.headers,
                data: rsp.data
            }
        })
    })
    .catch(e => {
        console.log(e);
        res.json({
            success: false,
            data: e
        });
    })
});


app.listen(PORT, function () {
    console.log('Express server listening: http://localhost:8848');
});