// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();

import db from "../../../utils/database/proxy";

router.get('/admin/', (req: Request, res: Response) => {
    res.render("admin/index");
});

export default router;
