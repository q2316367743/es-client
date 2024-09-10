import Express from 'express';
import axios from 'axios';


let app = Express();
let PORT = 8888;

app.use(Express.json());

app.get('/api/preload/fetch',(req,res)=>{
    const config = req.body;
    axios.request(config)
    .then(rsp => {
        res.json({
            success: true,
            data: rsp
        })
    })
    .catch(e => {
        res.json({
            success: false,
            data: e
        });
    })
});


app.listen(PORT, function () {
    console.log('Express server listening...');
});