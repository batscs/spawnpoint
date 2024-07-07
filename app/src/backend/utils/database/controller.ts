const fs = require('fs');
const path = require('path');

/**
 * Öffnet Datenbankdatei aus dem data-Ordner
 * @param {string} filename Dateiname des JSON-Datei
 * @returns Datei-Inhalt
 */
const openFile = (filename : string): string => {
    // Pfad aufgrund unterschiedlicher Slashes bei Ordnerpfaden (Windows vs. Unix) dynamisch aufbauen
    const pathToFile = path.join('data', `${filename}.json`);

    // Datei-Inhalt mit der UTF8-Zeichenkodierung interpretieren
    const options = { encoding: 'utf8' };

    // Datei öffnen
    const filecontent = fs.readFileSync(pathToFile, options);

    return filecontent;
}

const load = (table : string) : any => {
    try {
        return JSON.parse(openFile(table));
    } catch (err: any) {
        return {};
    }
}

export default class DatabaseController {
    static getConfig = () => {
        return load("config");
    }

    static getProjects = () => {
        return load("projects");
    }
}