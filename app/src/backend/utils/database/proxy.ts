import db from "./controller";

export default class DatabaseProxy {
    private static cacheTTL: number = 10; // TODO cacheTTL: 5 * 60 * 1000; // Cache-Zeit in Millisekunden (5 Minuten)
    private static cache: Map<string, { data: any, timestamp: number }> = new Map();

    private static getCachedResult(functionName: string, dbFunction: () => any): any {
        const now = Date.now();
        const cachedEntry = DatabaseProxy.cache.get(functionName);

        if (cachedEntry && (now - cachedEntry.timestamp < DatabaseProxy.cacheTTL)) {
            const result = cachedEntry.data;
            return result;
        } else {
            const data = dbFunction();
            DatabaseProxy.cache.set(functionName, { data, timestamp: now });
            return data;
        }
    }

    static getConfig() {
        return DatabaseProxy.getCachedResult("getConfig", db.getConfig);
    }

    static getAbout() {
        return DatabaseProxy.getCachedResult("getAbout", db.getAbout);
    }

    static getJobs() {
        return DatabaseProxy.getCachedResult("getJobs", db.getJobs);
    }

    static getProjects(): project[] {
        return DatabaseProxy.getCachedResult("getProjects", db.getProjects);
    }

    static getProjectById(projectId: string): project | null{
        return this.getProjects().find(p => p.id === projectId) || null;
    }

};
