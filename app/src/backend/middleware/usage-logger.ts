import { Request, Response, NextFunction } from 'express';
import log from "../utils/common/logger";

const usageLogger = (routeName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        log.addUsageLog(req, routeName);
        next();
    };
};

export default usageLogger;
