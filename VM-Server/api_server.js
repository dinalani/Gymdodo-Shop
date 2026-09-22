import http from "node:http";
import fs from "node:fs";  

const port = 3000;
const host = "0.0.0.0"; 

const codesFile = "gutscheincodes.txt"; 
let ausgegebeneGutscheine = 0; 

const productsFile = fs.existsSync("json/products.json") ? "json/products.json" : "products.json";
const teamFile = fs.existsSync("json/team.json") ? "json/team.json" : "team.json";

let productsAufrufe = 0; 
let besucherZaehler = 0; 

if (fs.existsSync(codesFile)) {
    const inhalt = fs.readFileSync(codesFile, "utf-8");
    const zeilen = inhalt.split("\n").filter(zeile => zeile.trim() !== ""); 
    ausgegebeneGutscheine = zeilen.length;
}

const serverStartTime = new Date();

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const urlObj = new URL(req.url, `http://${host}:${port}`);

    if (urlObj.pathname === "/") {
        const jetzt = new Date();
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(`API running. Aktuelles Datum: ${jetzt.toLocaleDateString("de-DE")}`);
        return;
    }

    if (urlObj.pathname === "/visitors") {
        besucherZaehler++; 
        const stats = { visitors: besucherZaehler, products: productsAufrufe };
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(stats));
        return;
    }

    if (urlObj.pathname === "/status") {
        const statusData = {
            counter: ausgegebeneGutscheine, 
            uptime: serverStartTime,
            devs: ["Isabel", "Ardina"],
            owner: { company: "Gymdodo", devs: ["Isabel", "Felix", "Ardina"] }
        };
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(statusData, null, 2));
        return;
    }

    // Endpoint für die Statistiken
    if (urlObj.pathname === "/remaining") {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        // Berechnet verbleibende Gutscheine (maximal 10)
        let aktuelleAusgabe = 0;
        if (fs.existsSync(codesFile)) {
            const inhalt = fs.readFileSync(codesFile, "utf-8");
            aktuelleAusgabe = inhalt.split("\n").filter(z => z.trim() !== "").length;
        }
        const verbleibend = Math.max(0, 10 - aktuelleAusgabe);
        res.end(String(verbleibend));
        return;
    }

    if (urlObj.pathname === "/coupon") {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        
        // Datei-Zähler frisch einlesen
        if (fs.existsSync(codesFile)) {
            const inhalt = fs.readFileSync(codesFile, "utf-8");
            ausgegebeneGutscheine = inhalt.split("\n").filter(z => z.trim() !== "").length;
        } else {
            ausgegebeneGutscheine = 0;
        }

        if (ausgegebeneGutscheine < 10) {
            const code = String(Math.floor(100000 + Math.random() * 900000));
            fs.appendFileSync(codesFile, code + "\n");
            ausgegebeneGutscheine++; 
            res.end(code); 
        } else {
            res.end("0"); 
        }
        return;
    }

    if (urlObj.pathname === "/check") {
        const checkCode = urlObj.searchParams.get("code"); 
        res.setHeader("Content-Type", "text/plain; charset=utf-8");

        if (!fs.existsSync(codesFile) || !checkCode) {
            res.writeHead(200); res.end("Gutschein ungültig"); return;
        }

        fs.promises.readFile(codesFile, "utf-8")
            .then(inhalt => {
                const gefunden = inhalt.split("\n").some(zeile => zeile.trim() === checkCode);
                res.writeHead(200); res.end(gefunden ? "Gutscheincode gültig" : "Gutschein ungültig");
            })
            .catch(() => { res.writeHead(500); res.end("Serverfehler"); });
        return;
    }

    // PRODUKTE: KATEGORIE-, TAG- & SUCH-FILTER
    if (urlObj.pathname === "/products") {
        productsAufrufe++; 

        if (!fs.existsSync(productsFile)) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Produktdatenbank nicht gefunden.");
            return;
        }

        try {
            const rawData = fs.readFileSync(productsFile, "utf-8");
            let products = JSON.parse(rawData);

            // Tag-Filterung
            const tagFilter = urlObj.searchParams.get("tag");
            if (tagFilter) {
                products = products.filter(p => p.labels && p.labels.includes(tagFilter));
            }

            // Kategorie-Filterung
            const categoryFilter = urlObj.searchParams.get("category");
            if (categoryFilter) {
                products = products.filter(p => {
                    if (Array.isArray(p.category)) {
                        return p.category.includes(categoryFilter);
                    }
                    return p.category === categoryFilter;
                });
            }

            // Suchwort-Filterung (Name, Beschreibung, Tags)
            const searchFilter = urlObj.searchParams.get("search");
            if (searchFilter) {
                const lowerSearch = searchFilter.toLowerCase();
                products = products.filter(p => {
                    const matchName = p.name && p.name.toLowerCase().includes(lowerSearch);
                    const matchDesc = p.description && p.description.toLowerCase().includes(lowerSearch);
                    const matchTag = p.labels && p.labels.some(l => l.toLowerCase().includes(lowerSearch));
                    
                    return matchName || matchDesc || matchTag;
                });
            }

            // Preis-Erhöhung nach 20 Aufrufen
            if (productsAufrufe >= 20) {
                products = products.map(product => {
                    if (product.price) product.price = Number((product.price * 1.1).toFixed(2));
                    return product;
                });
            }

            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify(products, null, 2));
        } catch (error) {
            console.error("Fehler beim Laden der Produkte:", error);
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Serverfehler beim Laden der Produkte.");
        }
        return;
    }

    if (urlObj.pathname === "/team") {
        if (!fs.existsSync(teamFile)) {
            res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: "Team-Datenbank nicht gefunden." }));
            return;
        }
        try {
            const rawData = fs.readFileSync(teamFile, "utf-8");
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(rawData);
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: "Serverfehler" }));
        }
        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - Endpoint nicht gefunden.");
});

server.listen(port, host, () => {
    console.log(`Server läuft auf http://${host}:${port} | Vergebene Gutscheine: ${ausgegebeneGutscheine}`);
});