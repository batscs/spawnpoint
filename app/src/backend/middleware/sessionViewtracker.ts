import { Request, Response, NextFunction } from "express";
import analytics from "../utils/common/analytics";

type IdentifierExtractor = (req: Request) => string | undefined;

const sessionViewTracker = (getId: IdentifierExtractor) => {
    return (req: Request, res: Response, next: NextFunction) => {

        try {
            const sessionId = req.cookies?.session;

            const id = getId(req);

            if (sessionId && id) {
                analytics.registerView(id, sessionId);
            }
            next();
        } catch (error) {
            console.error("Error in sessionViewTracker:", error);
            next();
        }
    };
};

export default sessionViewTracker;
