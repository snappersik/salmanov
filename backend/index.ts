import express from 'express';
import { configDotenv } from 'dotenv';
// import router from './routers/index.mjs';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import db_connect from './src/config/db_connect';
import { autoCreateRole } from './src/models/atUser/Role';
import router from './src/routers';


configDotenv();
db_connect(process.env.DB)
    .then(async () => {
        console.log('Connected to DB');
        await autoCreateRole();
    })
    .catch(error => console.log('DB Error', error));
    

const app = express();
app.use(express.json());
app.use(router);
app.use(cors({ origin: 'http://localhost:5173' })); // Порт фронта
app.use(cookieParser());
app.listen(process.env.PORT);
