// src/middleware/httpLogger.ts

import { Request, Response, NextFunction } from 'express';
import log from "../utils/common/logger";

const httpLogger = (req: Request, res: Response, next: NextFunction) => {
    const ip : string | undefined = req.ip;
    const url : string = req.baseUrl + req.path; // Constructing the URL without query parameters
    const params: string = JSON.stringify(req.params);
    const query : string = JSON.stringify(req.query);
    const body : string = JSON.stringify(req.body);
    const method : string = req.method;

    const line = `IP: ${ip} METHOD: ${method} URL: ${url} QUERY: ${query} BODY: ${body} PARAMS: ${params}`;

    log.addHttpLog(line);

    next();
};

export default httpLogger;
