// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import auth from "../utils/common/authentication";
import analytics from "../utils/common/analytics";
import db from "../utils/database/controller";
import log from "../utils/common/logger";


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

router.get('/admin/jobs', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        let jobs = db.getJobs();
        res.render("admin/jobs", {jobs})
    } else {
        res.redirect("/admin?error=" + encodeURIComponent("Incorrect username or password"));
    }
});

router.get('/admin/about', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        let about = db.getAbout();
        res.render("admin/about", {about})
    } else {
        res.redirect("/admin?error=" + encodeURIComponent("Incorrect username or password"));
    }
});

router.post('/admin/jobs', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        let body = req.body;
        let jobs: job[] = body.jobs;
        db.saveJobs(jobs);
        res.send({ success: true });
    } else {
        res.send({ error: "unauthorized" });
    }
});

router.post('/admin/about', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        let body = req.body;
        let about: about = body.about;
        db.saveAbout(about);
        res.send({ success: true });
    } else {
        res.send({ error: "unauthorized" });
    }
});

router.get('/admin/logout', (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect("/admin/");
});

router.get('/admin/projects', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        let projects = db.getProjects().map(project => {
            return {
                ...project, // Spread all existing project properties
                views: analytics.getViewCount(`/project/${project.id}`) // Add viewCount
            };
        });
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
        res.setHeader('Content-Type', 'text/plain');  // Set the correct header for plain text
        res.send(log.getHttpLog());
    } else {
        res.send("not enough permissions");
    }
});

router.get('/admin/log', (req: Request, res: Response) => {
    if (req.cookies && auth.authenticateToken(req.cookies["token"])) {
        let usageLogs = log.getUsageLog();

        // Sort usageLogs by `first_seen`, newest first
        usageLogs.sort((a, b) => new Date(b.first_seen).getTime() - new Date(a.first_seen).getTime());

        res.render("admin/log", { usageLogs });
    } else {
        res.send("not enough permissions");
    }
});

router.get('/admin/log/usage', (req: Request, res: Response) => {
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        res.setHeader('Content-Type', 'text/plain');  // Set the correct header for plain text
        res.send(log.getUsageLog());
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
