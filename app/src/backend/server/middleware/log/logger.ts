// src/middleware/logger.ts

import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
    const ip : string | undefined = req.ip;
    const timestamp : string = new Date().toISOString();
    const url : string = req.baseUrl + req.path; // Constructing the URL without query parameters
    const params: string = JSON.stringify(req.params);
    const query : string = JSON.stringify(req.query);
    const body : string = JSON.stringify(req.body);

    console.log(`[${timestamp}] IP: ${ip} URL: ${url} QUERY: ${query} BODY: ${body} PARAMS: ${params}`);

    next();
};

export default logger;
