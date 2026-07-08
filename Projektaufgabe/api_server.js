import http from "node:http";
import fs from "node:fs"; // Wichtig für das Speichern und Lesen der Textdatei 

const port = 3000;
const codesFile = "gutscheincodes.txt"; 
const productsFile = "products.json"; // Datei für die Produkte

let ausgegebeneGutscheine = 0; 
const serverStartTime = new Date(); // Startzeit des Servers für die Uptime [cite: 5, 86]
let productsCallCounter = 0; // Zähler für Aufrufe von /products (Zusatzaufgabe) [cite: 9, 94]

// --- Zähler bei Server-Start initialisieren ---
if (fs.existsSync(codesFile)) {
    const inhalt = fs.readFileSync(codesFile, "utf-8");
    const zeilen = inhalt.split("\n").filter(zeile => zeile.trim() !== ""); 
    ausgegebeneGutscheine = zeilen.length;
}

const server = http.createServer((req, res) => {
    // CORS-Header und Standard-Header (werden bei Bedarf in den Routen für JSON überschrieben)
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    const urlObj = new URL(req.url, `http://${req.headers.host}`);

    // Endpoint '/'
    if (urlObj.pathname === "/") {
        const jetzt = new Date();
        res.writeHead(200);
        res.end(`API running. Aktuelles Datum: ${jetzt.toLocaleDateString("de-DE")}, Uhrzeit: ${jetzt.toLocaleTimeString("de-DE")}`);
        return;
    }

    // --- Teilaufgabe 1.1: Endpoint '/status' ---
    if (urlObj.pathname === "/status") {
        const status = {
            counter: ausgegebeneGutscheine,
            uptime: serverStartTime.toISOString(),
            owner: {
                company: "Gymdodo GmbH",
                shopnumber: 21,
                name: "Gymdodo Shop",
                adresse: "Campus Friedberg, Wilhelm-Leuschner-Straße 13"
            },
            devs: ["Isabel", "Felix", "Ardina"] // Eure Namen aus dem Footer
        };

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" }); [cite: 88]
        res.end(JSON.stringify(status)); [cite: 88]
        return;
    }

    // --- Teilaufgabe 2.2 & 2.3: Endpoint '/products' ---
    if (urlObj.pathname === "/products") {
        productsCallCounter++; // Erhöhe Aufrufzähler [cite: 9, 94]

        fs.readFile(productsFile, "utf-8", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Serverfehler beim Lesen der Produktdaten");
                return;
            }

            try {
                let productsArray = JSON.parse(data);

                // Zusatzaufgabe 2.3: Ab 20 Aufrufen steigen die Preise um 10% [cite: 9, 94]
                if (productsCallCounter >= 20) {
                    productsArray = productsArray.map(product => {
                        product.price = parseFloat((product.price * 1.1).toFixed(2));
                        return product;
                    });
                }

                res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                res.end(JSON.stringify(productsArray));
            } catch (e) {
                res.writeHead(500);
                res.end("Serverfehler beim Parsen der JSON-Produktdaten");
            }
        });
        return;
    }

    // --- Vorherige Endpoints beibehalten ---
    if (urlObj.pathname === "/coupon") {
        if (ausgegebeneGutscheine >= 10) {
            res.writeHead(200);
            res.end("0");
            return;
        }

        const neuerCode = "DODO-" + Math.floor(100000 + Math.random() * 900000);
        fs.appendFile(codesFile, neuerCode + "\n", function (error) {
            if (error) {
                res.writeHead(500);
                res.end("Fehler beim Speichern des Gutscheins");
                return;
            }
            ausgegebeneGutscheine++;
            res.writeHead(200);
            res.end(neuerCode);
        });
        return;
    }

    if (urlObj.pathname === "/check") {
        const checkCode = urlObj.searchParams.get("code");
        if (!checkCode) {
            res.writeHead(400);
            res.end("Code-Parameter fehlt");
            return;
        }

        fs.readFile(codesFile, "utf-8")
            .then(function (inhalt) {
                const zeilen = inhalt.split("\n");
                let gefunden = false;

                for (let i = 0; i < zeilen.length; i++) {
                    if (zeilen[i].trim() === checkCode) {
                        gefunden = true;
                        break;
                    }
                }

                res.writeHead(200);
                if (gefunden) {
                    res.end("Gutscheincode gültig");
                } else {
                    res.end("Gutschein ungültig");
                }
            })
            .catch(function (error) {
                res.writeHead(500);
                res.end("Serverfehler beim Lesen der Datei");
            });
        return;
    }

    if (urlObj.pathname === "/remaining") {
        const verbleibend = 10 - ausgegebeneGutscheine;
        res.writeHead(200);
        res.end(verbleibend.toString());
        return;
    }

    if (urlObj.pathname === "/stats") {
        res.writeHead(200);
        res.end(ausgegebeneGutscheine.toString());
        return;
    }

    // 404 Route, falls kein Pfad matcht
    res.writeHead(404);
    res.end("Endpoint nicht gefunden");
});

server.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});