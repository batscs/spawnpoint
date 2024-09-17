import date from "../common/date";

const fs = require('fs');
const path = require('path');
import "./types";

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

const writeFile = (filename: string, data: [] | {}) => {
    // Build dynamic file path
    const pathToFile = path.join('data', "database", `${filename}.json`);

    // Write data to file
    fs.writeFileSync(pathToFile, JSON.stringify(data));
}

const appendFile = (filename: string, line: string) => {
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
    static getConfig = () => {
        return loadJson("config");
    }

    static getJobs = (): job[] => {
        return loadJson("jobs");
    }

    static getAbout = (): about => {
        return loadJson("about");
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

        writeFile("projects", dataset);
    }

    static addHttpLog(log: string): void {
        appendFile("traffic_log", log);
    }

    static addUsageLog(log: string): void {
        appendFile("usage_log", log);
    }


    static getHttpLog(): string {
        return load("traffic_log.log");
    }

    static getUsageLog(): string {
        return load("usage_log.log");
    }
}
