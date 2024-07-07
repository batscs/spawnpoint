const file = require('../../src/backend/utils/file.ts');

if (file.openFile('history').length > 0) {
    console.log('Datei öffnen:', 'OK');
} else {
    console.log('Datei öffnen:', 'FEHLER');
}