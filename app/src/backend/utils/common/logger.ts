import db from "../database/controller";

const filename_http = "http";
import { Router, Request, Response } from 'express';
import auth from "./authentication";

export default class Logger {

    static addHttpLog(line: string): void {
        const timestamp : string = new Date().toISOString();

        line = `[${timestamp}] ${line}`;

        db.appendLog(filename_http, line);
    }

    static addUsageLog(req : Request, line: string): void {
        if(!(req.cookies && auth.authenticateToken(req.cookies["token"]))) {
            const timestamp : string = new Date().toISOString();

            const session: string = req.ip || "unknown";

            const log: log = {
                timestamp: timestamp,
                line: line
            }

            db.trackUsage(session, log);
        }
    }

    static getHttpLog(): string {
        return db.loadLog(filename_http);
    }

    static getUsageLog(): usage_statistic[] {
        return db.getUsage();
    }
}