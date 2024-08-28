// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import auth from "../../../utils/common/authentication";

import db from "../../../utils/database/proxy";

router.get('/admin/', (req: Request, res: Response) => {
    res.render("admin/index");
});

router.get('/admin/panel', (req: Request, res: Response) => {
    console.log("!!" + req.cookies);
    if(req.cookies && auth.authenticateToken(req.cookies["token"])) {
        console.log(req.cookies["token"]);
        res.send("logged in!")
    } else {
        res.redirect("/admin?error=" + encodeURIComponent("Incorrect username or password"));
    }
});

export default router;
