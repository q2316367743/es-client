import {Router} from 'express';
import axios from "axios";

const app = Router();

app.post('/', async (req, rsp) => {
    const config = req.body;
    try {
        let response = await axios(config);
        rsp.json({
            success: true,
            data: {
                status: response.status,
                headers: response.headers,
                data: response.data
            }
        });
    } catch (e) {
        console.error(e);
        rsp.json({
            success: false,
            data: e
        });
    }
});

export default app;