import http from "node:http";

const PORT = 3000;
let generatedCoupons = 0;
const MAX_COUPONS = 10; // Teilaufgabe 1.3: Maximal 10 Gutscheine

const server = http.createServer((req, res) => {
    // CORS-Header erlauben dem Browser den Zugriff von anderen Ports (z.B. Live Server)
    const headers = {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
    };

    // Teilaufgabe 1.1: Root-Endpoint / mit Statusmeldung und Uhrzeit
    if (req.url === "/") {
        res.writeHead(200, headers);
        const jetzt = new Date().toLocaleString("de-DE");
        res.end(`API running - ${jetzt}`);
        return;
    } 
    // Teilaufgabe 1.2 & 1.3: Endpoint /coupon
    else if (req.url === "/coupon" || req.url === "/coupon/") {
        res.writeHead(200, headers);
        
        if (generatedCoupons < MAX_COUPONS) {
            // Generiert den geforderten 6-stelligen numerischen Code
            const code = Math.floor(100000 + Math.random() * 900000);
            generatedCoupons++;
            res.end(String(code)); 
        } else {
            // Wenn das Limit erreicht ist, wird "0" ausgegeben
            res.end("0");
        }
        return;
    }

    // Teilaufgabe 1.4: Fehlerbehandlung für unbekannte Endpoints
    res.writeHead(404, headers);
    res.end("404 - Endpoint nicht gefunden");
});

server.listen(PORT, () => {
    console.log(`API Server läuft auf http://localhost:${PORT}`);
});