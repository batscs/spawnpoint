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
    const pathToFile = path.join('data', "database", `${filename}.json`);
    console.log("DEBUG Database-Controller: Opening file: " + pathToFile);

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

const load = (table : string): {} | [] | null => {
    try {
        return JSON.parse(openFile(table));
    } catch (err: any) {
        console.error("Could not load database: " + table);
        return null;
    }
}

export default class DatabaseController {
    static getConfig = () => {
        return load("config");
    }

    static getProjects = (): project[] => {
        let values : {} | [] | null = load("projects");
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
}
