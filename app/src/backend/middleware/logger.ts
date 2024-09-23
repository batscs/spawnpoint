// src/middleware/logger.ts

import { Request, Response, NextFunction } from 'express';
import db from "../utils/database/controller";

const logger = (req: Request, res: Response, next: NextFunction) => {
    const ip : string | undefined = req.ip;
    const timestamp : string = new Date().toISOString();
    const url : string = req.baseUrl + req.path; // Constructing the URL without query parameters
    const params: string = JSON.stringify(req.params);
    const query : string = JSON.stringify(req.query);
    const body : string = JSON.stringify(req.body);
    const method : string = req.method;

    const line = `[${timestamp}] IP: ${ip} METHOD: ${method} URL: ${url} QUERY: ${query} BODY: ${body} PARAMS: ${params}`;

    if (
        url === '/' ||
        url === '/projects' ||
        url.startsWith('/project/') ||
        url === '/about' ||
        url.startsWith("/home")
    ) {
        db.addUsageLog(line);  // Add usage log for specific routes
    }

    console.log(line);
    db.addHttpLog(line);

    next();
};

export default logger;
