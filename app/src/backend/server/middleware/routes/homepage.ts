// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import date from "../../../utils/common/date";

import db from "../../../utils/database/proxy";
import internal from "node:stream";

router.get('/', (req: Request, res: Response) => {
    res.render("home/index");
});

router.get('/work', (req: Request, res: Response) => {

    const filter = req.query.filter;
    let projects = db.getProjects();

    projects = projects.filter(project => project.isPublished);
    projects = projects.sort((left, right) : number => {
        return -1 * date.compareDates(left.startDate, right.startDate);
    });

    if (filter === "favorites") {
        projects = projects.filter(project => project.isFavorite);
    }

    res.render('home/work', {projects});
});

export default router;