// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import auth from "../utils/common/authentication";
import db from "../utils/database/controller";
import date from "../utils/common/date";

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

router.get('/admin/logout', (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect("/admin/");
});

router.get('/admin/projects', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        let projects = db.getProjects();
        res.render("admin/projects", {projects})
    } else {
        res.redirect("/admin?error=" + encodeURIComponent("Incorrect username or password"));
    }
});

router.get('/admin/create-project', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        res.render("admin/create-project")
    } else {
        res.redirect("/admin?error=" + encodeURIComponent("Incorrect username or password"));
    }
});

router.get('/admin/log/http', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        const log = db.getHttpLog();
        res.setHeader('Content-Type', 'text/plain');  // Set the correct header for plain text
        res.send(log);
    } else {
        res.send("not enough permissions");
    }
});

router.get('/admin/log/usage', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        const log = db.getUsageLog();
        res.setHeader('Content-Type', 'text/plain');  // Set the correct header for plain text
        res.send(log);
    } else {
        res.send("not enough permissions");
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