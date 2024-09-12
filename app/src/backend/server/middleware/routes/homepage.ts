// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import date from "../../../utils/common/date";
import db from "../../../utils/database/proxy";
const marked = require('marked');

router.get('/', (req: Request, res: Response) => {
    res.render("home/index");
});

router.get('/about', (req: Request, res: Response) => {
    res.render("home/about");
});

router.get('/project/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const project = db.getProjectById(id);

    // TODO Abfangen ob project == null

    const markdown = marked.parse(project?.description);
    res.render("home/project", {project: project, markdown: markdown});
});

router.get('/work', (req: Request, res: Response) => {

    const filter = req.query.filter;
    let projects = db.getProjects();

    projects = projects.filter(project => project.isPublished);
    projects = projects.sort((left, right) : number => {
        return -1 * date.compareDates(left.startDate, right.startDate);
    });

    let topics = new Set<string>();

    projects.forEach(project => {
        project.topics.forEach(topic => {
            topics.add(topic);
        })
    });


    res.render('home/work', {projects: projects, topics: Array.from(topics).sort()});
});

export default router;
