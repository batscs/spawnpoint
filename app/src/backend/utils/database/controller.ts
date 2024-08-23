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
    console.log(pathToFile);

    // Datei-Inhalt mit der UTF8-Zeichenkodierung interpretieren
    const options = { encoding: 'utf8' };

    // Datei öffnen
    const filecontent = fs.readFileSync(pathToFile, options);

    return filecontent;
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
        let result = load("projects");
        return Array.isArray(result) ? result : [];
    }
}
