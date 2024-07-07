// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();

import db from "../../../utils/database/proxy";

router.get('/api/test', (req: Request, res: Response) => {
    res.send("test api hi");
});

export default router;
