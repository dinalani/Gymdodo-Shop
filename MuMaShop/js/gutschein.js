
// Serverstatus

async function holeServerStatus() {
    try {
        const response = await fetch(`${API_URL}/status`);
        
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const data = await response.json();
        const devNames = data.devs.join(" ");

        alert(`Server-läuft seit ${data.uptime} Dev-Team: ${devNames}`);

    } catch (error) {
        console.error("Fehler beim Abrufen des Server-Status:", error);
        alert("Der Server-Status konnte nicht abgerufen werden. Bitte prüfe, ob der Node-Server läuft.");
    }
}

// TEILAUFGABE 2.1: GUTSCHEIN ABRUFEN

async function holeGutschein() {
    try {
        const response = await fetch(`${API_URL}/coupon`);
        const text = await response.text();
        
        const container = document.getElementById("coupon-container");
        const ergebnis = document.getElementById("gutschein-ergebnis");

        container.style.display = "block";

        if (text === "0") {
            ergebnis.innerText = "Leider sind keine Gutscheine mehr verfügbar!";
            ergebnis.className = "error-msg";
        } else {
            ergebnis.innerText = text;
            ergebnis.className = "success-msg";
            
            // Anzeige der verbleibenden Gutscheine sofort aktualisieren
            updateStats();
        }
    } catch (error) {
        console.error("Fehler beim Abrufen des Gutscheins:", error);
    }
}

// TEILAUFGABE 2.4: VERBLEIBENDE GUTSCHEINE
async function updateStats() {
    const statsAusgabe = document.getElementById('stats-ausgabe');
    if (!statsAusgabe) return; 

    try {
        const response = await fetch(`${API_URL}/remaining`);
        const verbleibendText = await response.text();
        const verbleibendZahl = parseInt(verbleibendText);
        
        const vergeben = 10 - verbleibendZahl;
        
        statsAusgabe.innerText = `Bereits vergeben: ${vergeben} / 10 Gutscheinen`;
        
        // Wenn keine Gutscheine mehr übrig sind
        if (verbleibendZahl <= 0) {
            const button = document.getElementById('btn-generate');
            button.disabled = true;
            button.style.opacity = "0.5";
            button.innerText = "Alle Gutscheine vergeben";

            const container = document.getElementById('coupon-container');
            const ergebnisDiv = document.getElementById('gutschein-ergebnis');
            const label = document.getElementById('coupon-label');
            
            container.style.display = "block";
            label.innerText = "Aktion beendet";
            ergebnisDiv.innerText = "Es tut uns leid, aber alle Gutscheine sind bereits vergeben.";
            ergebnisDiv.className = "error-msg";
        }
    } catch (e) {
        statsAusgabe.innerText = "Status der Gutscheine konnte nicht geladen werden.";
    }
}

// TEILAUFGABE 2.2: GUTSCHEIN PRÜFEN
async function pruefeGutschein() {
    const inputFeld = document.getElementById('code-input');
    const container = document.getElementById('check-container');
    const ergebnisDiv = document.getElementById('check-ergebnis');
    
    if (!inputFeld || !container || !ergebnisDiv) return;

    const codeZumPruefen = inputFeld.value.trim();

    if (codeZumPruefen === "") {
        container.style.display = "block";
        ergebnisDiv.innerText = "Bitte gib einen Code ein.";
        ergebnisDiv.className = "error-msg";
        return; 
    }

    container.style.display = "block";
    ergebnisDiv.innerText = "Prüfe Code...";
    ergebnisDiv.className = "";

    try {
        const response = await fetch(`${API_URL}/check?code=${codeZumPruefen}`);
        const serverAntwort = (await response.text()).trim();

        if (serverAntwort === "Gutscheincode gültig") {
            ergebnisDiv.innerText = "Glückwunsch! Der Gutscheincode ist gültig.";
            ergebnisDiv.className = "success-msg"; 
        } else {
            ergebnisDiv.innerText = "Leider ist dieser Gutscheincode ungültig.";
            ergebnisDiv.className = "error-msg";   
        }
        
    } catch (error) {
        console.error("Fehler beim Abrufen der API:", error);
        ergebnisDiv.innerText = "Konnte keine Verbindung zum Server herstellen. Läuft api_server.js?";
        ergebnisDiv.className = "error-msg";
    }
}

// Führt die Statistik-Aktualisierung automatisch aus, sobald die Seite geladen ist
document.addEventListener("DOMContentLoaded", () => {
    updateStats();
});