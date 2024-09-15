// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import auth from "../../../utils/common/authentication";
import db from "../../../utils/database/controller";
import dbp from "../../../utils/database/proxy";
import multer, {FileFilterCallback} from 'multer';
import path from 'path';
import date from "../../../utils/common/date";

// Set up storageProjects for uploaded files
const storageProjects = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './data/resources/projects/');
    },
    filename: (req, file, cb) => {
        cb(null, `${auth.generateToken()}.png`);
    }
});

const storageMedia = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './data/resources/media/');
    },
    filename: (req, file, cb) => {
        cb(null, `${auth.generateToken()}.png`);
    }
});

// TODO Upload Filter falls logged in nur
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!req.cookies || !auth.authenticateToken(req.cookies["token"])) {
        console.log("DEBUG Multer: Unauthroized uploadProjects attempted");
        return cb(null, false);
    } else {
        return cb(null, true);
    }
}

// Initialize multer with storageProjects configuration
const uploadProjects = multer({ storage: storageProjects, fileFilter: fileFilter });
const uploadMedia = multer({ storage: storageMedia, fileFilter: fileFilter });

router.post('/admin/authenticate', (req: Request, res: Response) => {
    const password = req.body.password;

    if (auth.verifyPassword(password)) {
        const token : string = auth.generateToken();
        res.cookie("token", token);
        res.redirect("/admin/panel");
    } else {
        res.redirect("/admin");
    }
});

router.post('/admin/project/:id', uploadProjects.any(), (req: Request, res: Response) => {
    const id = req.params.id;
    const old: project | null = db.getProjectById(id);

    if (!req.cookies || !auth.authenticateToken(req.cookies["token"])) {
        res.send({ error: "unauthorized" });
    } else if (old == null) {
        res.send({ error: "project id invalid" });
    } else {
        // Check if a banner file has been uploaded
        let banner = old.banner;
        if (req.files && req.files.length == 1) {
            if (Array.isArray(req.files)) {

                if (banner == "") {
                    // TODO delete ./data/resources/projects/${banner}
                }

                banner = req.files[0].filename;
            }
        }

        const project: project = {
            id: id,
            name: req.body.name,
            topics: req.body.topics.split(","),
            details: req.body.details.split(","),
            description: req.body.description,
            isPublished: req.body.published === "true",
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            source: req.body.source,
            preview: req.body.preview,
            banner: banner
        }

        db.saveProject(project);
        res.send({ success: true });
    }
});

router.post("/api/admin/media/upload", uploadMedia.any(), (req: Request, res: Response) => {

    let filename : string = "";
    if (req.files && req.files.length == 1) {
        if (Array.isArray(req.files)) {
            filename = req.files[0].filename;
        }
    }

    res.send({ url: "/static/resources/media/" + filename });
});

router.get("/api/html/project/:projectid", (req: Request, res: Response) => {
    const id = req.params.projectid;
    let project = db.getProjectById(id);
    res.render("home/elements/card_project", {project});
});

router.post('/api/work', (req: Request, res: Response) => {
    const filter = req.body.filter; // topic
    let projects = dbp.getProjects();

    projects = projects.filter(project => project.isPublished);

    projects = projects.sort((left, right) : number => {
        return -1 * date.compareDates(left.startDate, right.startDate);
    });

    if (filter) {
        projects = projects.filter(projects => projects.topics.includes(filter));
    }

    res.send({projects: projects});
});

router.post('/admin/create', uploadProjects.any(), (req: Request, res: Response) => {

    if (!req.cookies || !auth.authenticateToken(req.cookies["token"])) {
        res.send({ error: "unauthorized" });
    } else {
        // Check if a banner file has been uploaded
        let banner : string = "";
        if (req.files && req.files.length == 1) {
            if (Array.isArray(req.files)) {
                banner = req.files[0].filename;
            }
        }

        const id = auth.generateToken();

        const project: project = {
            id: id,
            name: req.body.name,
            topics: req.body.topics.split(","),
            details: req.body.details.split(","),
            description: req.body.description,
            isPublished: req.body.published === "true",
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            source: req.body.source,
            preview: req.body.preview,
            banner: banner
        }

        db.saveProject(project);
        res.redirect("/admin/project/" + id);
    }
});


export default router;
