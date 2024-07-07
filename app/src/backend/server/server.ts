// src/server.ts

import express from 'express';
import bodyParser from "body-parser";
import path from "node:path";

import router_homepage from './middleware/routes/homepage';
import router_admin from './middleware/routes/admin';
import router_api from './middleware/routes/api';
import logger from './middleware/log/logger';

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '../../frontend/pug'));
app.set('view engine', 'pug');

// Static File-Serving
app.use('/static/css', express.static(path.join(__dirname, "../../frontend/css")));
app.use('/static/js', express.static(path.join(__dirname, "../../frontend/js")));
app.use('/static/img', express.static(path.join(__dirname, "../../frontend/img")));

app.use(logger);
app.use(router_homepage);
app.use(router_admin);
app.use(router_api);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
