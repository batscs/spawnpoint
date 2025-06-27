import date from "../common/date";

const fs = require('fs');
const path = require('path');
import auth from "../common/authentication";
import "./types";
import usageLogger from "../../middleware/usage-logger";

// todo in eigene type.ts datei extrahieren


/**
 * Öffnet Datenbankdatei aus dem data-Ordner
 * @param {string} filename Dateiname des JSON-Datei
 * @returns Datei-Inhalt
 */
const openFile = (filename : string): string => {
    // Pfad aufgrund unterschiedlicher Slashes bei Ordnerpfaden (Windows vs. Unix) dynamisch aufbauen
    const pathToFile = path.join('data', "database", `${filename}`);

    // Datei-Inhalt mit der UTF8-Zeichenkodierung interpretieren
    const options = { encoding: 'utf8' };

    // Datei öffnen
    const filecontent = fs.readFileSync(pathToFile, options);

    return filecontent;
}

const writeJson = (filename: string, data: [] | {}) => {
    // Build dynamic file path
    const pathToFile = path.join('data', "database", `${filename}.json`);

    // Write data to file
    fs.writeFileSync(pathToFile, JSON.stringify(data));
}

const appendLog = (filename: string, line: string) => {
    // Build dynamic file path
    const pathToFile = path.join('data', 'database', `${filename}.log`);

    // Append line to file
    fs.appendFileSync(pathToFile, `${line}\n`);
};

const loadJson = (table : string): {} | [] | null | any => {
    try {
        return JSON.parse(openFile(table + ".json"));
    } catch (err: any) {
        console.error("Could not loadJson database: " + table);
        return null;
    }
}

const load = (filename : string): {} | [] | null | any => {
    try {
        return openFile(filename);
    } catch (err: any) {
        console.error("Could not loadJson database: " + filename);
        return null;
    }
}

export default class DatabaseController {
    static loadLog = (name: string) => {
        return load(name + ".log");
    }

    static appendLog = (name: string, line: string) => {
        return appendLog(name, line);
    }

    static getUsage = (): usage_statistic[] => {
        return loadJson("usage") || [];
    }

    static trackUsage = (session: string, line: log) => {
        let usage = this.getUsage();

        // Find the session in the existing usage statistics
        let sessionData = usage.find(u => u.session.includes(session));

        // Get the current timestamp in milliseconds
        const currentTimestamp = new Date().getTime();

        const timeToLive: number = 86400000;

        // Check if session exists and the last log is not older than 24 hours (86400000 milliseconds)
        if (sessionData) {
            const lastLog = sessionData.lines[sessionData.lines.length - 1];
            const lastLogTimestamp = new Date(lastLog.timestamp).getTime();

            if ((currentTimestamp - lastLogTimestamp) <= timeToLive) {
                // If within 24 hours, append the new log
                sessionData.lines.push(line);
            } else {
                // If older than 24 hours, create a new session entry
                usage.push({
                    session: session,
                    first_seen: new Date().toISOString(),
                    lines: [line],
                    id: auth.generateToken() // You may have a function to generate a unique ID
                });
            }
        } else {
            // If session doesn't exist, create a new session entry
            usage.push({
                session: session,
                first_seen: new Date().toISOString(),
                lines: [line],
                id: auth.generateToken() // You may have a function to generate a unique ID
            });
        }

        writeJson("usage", usage);
    }

    static getConfig = (): config => {
        return loadJson("config");
    }

    static getJobs = (): job[] => {
        const jobs: job[] = loadJson("jobs");
        return jobs.sort((a, b) => b.id - a.id);  // Sort by id in ascending order
    }

    static getAbout = (): about => {
        return loadJson("about");
    }

    static getAnalytics = (): analytics => {
        const data = loadJson("analytics");
        if (!data || !Array.isArray(data.views)) {
            return { views: [] };
        }
        return data;
    }

    static saveAnalyticPageView = (page: string, session: string): void => {
        const analytics = this.getAnalytics();
        let pageEntry = analytics.views.find(view => view.page === page);

        if (pageEntry) {
            if (!pageEntry.sessions.includes(session)) {
                pageEntry.sessions.push(session);
            }
        } else {
            analytics.views.push({
                page: page,
                sessions: [session]
            });
        }

        console.log("test1")
        writeJson("analytics", analytics);
        console.log("test2")
    }

    static getAnalyticPageViews = (page: string): number => {
        const analytics = this.getAnalytics();
        const pageEntry = analytics.views.find(view => view.page === page);

        if (!pageEntry) {
            return 0;
        }
        return pageEntry.sessions.length;
    }


    static getProjects = (): project[] => {
        let values : {} | [] | null = loadJson("projects");
        let result : project[] = [];

        if (Array.isArray(values)) {
            result = values.sort((left, right) : number => {
                return -1 * date.compareDates(left.startDate, right.startDate);
            });
        }

        return result;
    }

    static getProjectById(projectId: string): project | null{
        return this.getProjects().find(p => p.id === projectId) || null;
    }

    static saveProject(project: project) {
        let dataset : project[] = this.getProjects();

        const existingProjectIndex : number = dataset.findIndex(p => p.id === project.id);

        if (existingProjectIndex !== -1) {
            // If project exists, replace it
            dataset[existingProjectIndex] = project;
        } else {
            // If project does not exist, add it to the dataset
            dataset.push(project);
        }

        writeJson("projects", dataset);
    }

    static saveJobs(jobs: job[]) {
        writeJson("jobs", jobs);
    }

    static saveAbout(about: about) {
        writeJson("about", about);
    }
}
