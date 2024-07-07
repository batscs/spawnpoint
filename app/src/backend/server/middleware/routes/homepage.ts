// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();

import db from "../../../utils/database/proxy";

router.get('/', (req: Request, res: Response) => {
    res.render("home/index");
});

router.get('/work', (req: Request, res: Response) => {

    const filter = req.query.filter;
    let projects: any[] = [];

    if (filter === "favorites") {
        projects = [2,4,6];
    } else if (filter === "software") {
        projects = [1,3,5];
    } else if (filter === "webdev") {
        projects = [8,9]
    } else {
        projects = [1,2,3,4,5,6,8,9];
    }

    res.render('home/work', {projects});
});

export default router;
