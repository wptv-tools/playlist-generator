const fs = require('fs');
const path = require('path');
const { argv } = require('process');

// Funktion zur Verarbeitung der Eingabedateien und Generierung der Playlist
function generatePlaylist(inputFilePath, outputFilePath) {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Lesen der JSON-Datei:', err);
            return;
        }

        let images;
        try {
            images = JSON.parse(data);
        } catch (parseErr) {
            console.error('Fehler beim Parsen der JSON-Datei:', parseErr);
            return;
        }

        const playlist = images.filter(image => {
            if (image.alwaysShow) {
                return true;
            }

            const now = new Date();
            const start = image.start ? new Date(image.start) : null;
            const end = image.end ? new Date(image.end) : null;

            if (start && end) {
                return now >= start && now <= end;
            } else if (start && !end) {
                return now >= start;
            } else if (!start && end) {
                return now <= end;
            }
            return false;
        }).map(image => image.name);

        fs.writeFile(outputFilePath, playlist.join('\n'), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Fehler beim Schreiben der Playlist-Datei:', writeErr);
                return;
            }

            console.log('Playlist erfolgreich erstellt:', outputFilePath);
        });
    });
}

// Funktion zum Parsen der Kommandozeilenargumente
function parseArguments() {
    const args = argv.slice(2);
    const inputIndex = args.indexOf('-i');
    const outputIndex = args.indexOf('-o');

    if (inputIndex === -1 || outputIndex === -1) {
        console.error('Fehler: Bitte sowohl Eingabe- als auch Ausgabepfade angeben.');
        console.error('Verwendung: node generatePlaylist.js -i /pfad/zur/eingabedatei.json -o /pfad/zur/playlist.txt');
        process.exit(1);
    }

    const inputFilePath = args[inputIndex + 1];
    const outputFilePath = args[outputIndex + 1];

    return { inputFilePath, outputFilePath };
}

// Hauptroutine
function main() {
    const { inputFilePath, outputFilePath } = parseArguments();
    generatePlaylist(inputFilePath, outputFilePath);
}

// Starte das Skript
main();
