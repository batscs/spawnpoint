// src/server.ts

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import path from "node:path";
import less from 'less-middleware';
import cookieParser from "cookie-parser";

import router_homepage from '../routes/homepage';
import router_admin from '../routes/admin';
import router_api from '../routes/api';
import logger from '../middleware/logger';

const app = express();
const port = 3000;

// Less Stylesheet
const lessSrcPath = path.join(__dirname, '../../frontend/less');
const cssDestPath = path.join(__dirname, '../../frontend/css');
// Use less-middleware to compile LESS files to CSS
app.use('/static/css', less(lessSrcPath, {
    dest: cssDestPath,
    force: true,
}));

// CookieParser
app.use(cookieParser());
// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '../../frontend/pug'));
app.set('view engine', 'pug');

// Static File-Serving
app.use('/favicon.ico', express.static(path.join(__dirname, "../../../data/resources/socials/favicon.png")));
app.use('/static/css', express.static(path.join(__dirname, "../../frontend/css")));
app.use('/static/js', express.static(path.join(__dirname, "../../frontend/js")));
app.use('/static/resources', express.static(path.join(__dirname, "../../../data/resources")));

app.set('trust proxy', true);

app.use(logger);
app.use(router_homepage);
app.use(router_admin);
app.use(router_api);


// TODO Eventuell sowas wie verifyIntegrity()
//  -> keine zwei Projects mit gleicher ID usw
//  -> alle Projecte haben die bestimmten Keys usw

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
