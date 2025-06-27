import db from "../database/controller";

export default class Analytics {

    static registerView(page: string, sessionId: string) {
        db.saveAnalyticPageView(page, sessionId);
    }

    static getViewCount(page: string): number {
        return db.getAnalyticPageViews(page);
    }

}
