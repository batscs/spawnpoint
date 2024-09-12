import db from "./controller";

export default class DatabaseProxy {
    private static cacheTTL: number = 10; // TODO cacheTTL: 1 * 60 * 1000; // Cache-Zeit in Millisekunden (1 Minute)
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

    static getProjects(): project[] {
        return DatabaseProxy.getCachedResult("getProjects", db.getProjects);
    }

    static getProjectById(projectId: string): project | null{
        return this.getProjects().find(p => p.id === projectId) || null;
    }

    static saveProject(project: project) {
        db.saveProject(project);
    }
};
