// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import auth from "../../../utils/common/authentication";
import db from "../../../utils/database/controller";
import date from "../../../utils/common/date";

router.get('/admin/', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        res.redirect("/admin/panel");
    } else {
        res.render("admin/index", {lightweight: true});
    }
});

router.get('/admin/panel', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        res.render("admin/panel")
    } else {
        res.redirect("/admin?error=" + encodeURIComponent("Incorrect username or password"));
    }
});

router.get('/admin/manage', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        let projects = db.getProjects();

        res.render("admin/manage", {projects})
    } else {
        res.redirect("/admin?error=" + encodeURIComponent("Incorrect username or password"));
    }
});

router.get('/admin/project/:id', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        const id = req.params.id;
        let project = db.getProjectById(id);

        if (project == null) {
            res.send("404 not found project");
        } else {
            res.render("admin/project", {project})
        }

    } else {
        res.redirect("/admin?error=" + encodeURIComponent("Incorrect username or password"));
    }
});

export default router;
