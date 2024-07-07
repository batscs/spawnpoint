// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();

import db from "../../../utils/database/proxy";
import internal from "node:stream";

router.get('/', (req: Request, res: Response) => {
    res.render("home/index");
});

router.get('/work', (req: Request, res: Response) => {

    const filter = req.query.filter;
    let projects: any[] = db.getProjects();

    projects = projects.filter(project => project.isPublished);
    projects = projects.sort((left, right) : number => {
        if (left.startDate < right.startDate) {
            return 1;
        } else {
            return -1;
        }
    })

    if (filter === "favorites") {
        projects = projects.filter(project => project.isFavorite);
    } else if (filter === "software") {
        projects = [1,3,5];
    } else if (filter === "webdev") {
        projects = [8,9]
    }

    res.render('home/work', {projects});
});

export default router;
