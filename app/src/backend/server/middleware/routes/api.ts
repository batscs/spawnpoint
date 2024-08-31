// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import auth from "../../../utils/common/authentication";
import db from "../../../utils/database/proxy";
import multer from 'multer';
import path from 'path';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './data/resources/projects/');
    },
    filename: (req, file, cb) => {
        cb(null, `${auth.generateToken()}.png`);
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

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

router.post('/admin/project/:id', upload.any(), (req: Request, res: Response) => {
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
            topics: req.body.topics,
            categories: req.body.categories,
            description: req.body.description,
            isPublished: true,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            source: req.body.source,
            preview: req.body.preview,
            banner: banner
        }

        console.log("final banner: " + banner);
        db.saveProject(project);
        res.send({ success: true });
    }
});


export default router;
