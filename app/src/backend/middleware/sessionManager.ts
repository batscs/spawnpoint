// src/middleware/httpLogger.ts

import { Request, Response, NextFunction } from 'express';
import log from "../utils/common/logger";
import auth from "../utils/common/authentication";
import crypto from "crypto";
import {publicDecrypt} from "node:crypto";

const sessionManager = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies?.session) {
        const id: string = generateSessionId();

        // Set cookie "forever" (z.B. 10 Jahre)
        res.cookie("session", id, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 Jahre in Millisekunden
        });
    }

    next();
};

function generateSessionId(): string {
    // Generate a new token
    const token : string = crypto.randomUUID();

    return token;
}

export default sessionManager;
