// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import auth from "../../../utils/common/authentication";

import db from "../../../utils/database/proxy";

router.post('/admin/authenticate', (req: Request, res: Response) => {
    const password = req.body.password;

    if (auth.verifyPassword(password)) {
        console.log("jaaa");
        const token : string = auth.generateToken();
        res.cookie("token", token);
        res.redirect("/admin/panel");
    } else {
        res.redirect("/admin");
    }
});

export default router;
