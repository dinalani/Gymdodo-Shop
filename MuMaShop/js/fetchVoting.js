"use strict"; 

// ERGEBNISSE LADEN & POLLING (Teilaufgabe 1.5 & 2.4)

async function ladeErgebnisse() {
    const tableBody = document.getElementById('resultsTableBody');
    const timeDisplay = document.getElementById('lastFetchTime');

    if (!tableBody) return;

    try {
        const response = await fetch(`${VOTE_API_URL}/results`);
        if (!response.ok) throw new Error('Netzwerkantwort war nicht ok');

        const daten = await response.json();
        
        tableBody.innerHTML = "";

        for (const [produktName, stimmenAnzahl] of Object.entries(daten)) {
            const tr = document.createElement('tr');
            
            const tdProdukt = document.createElement('td');
            tdProdukt.textContent = produktName;
            
            const tdStimmen = document.createElement('td');
            tdStimmen.textContent = stimmenAnzahl;

            tr.appendChild(tdProdukt);
            tr.appendChild(tdStimmen);
            
            tableBody.appendChild(tr);
        }

        // Aktuelle Uhrzeit formatieren und eintragen
        if (timeDisplay) {
            const jetzt = new Date();
            timeDisplay.innerText = jetzt.toLocaleTimeString('de-DE');
        }

    } catch (error) {
        console.error('Fehler beim Laden der Ergebnisse:', error);
        tableBody.innerHTML = "<tr><td colspan='2' style='color: red; padding: 15px;'>Fehler beim Laden der Daten. Express-Server läuft nicht.</td></tr>";
    }
}

// Sobald die Seite geladen ist: Einmalig aufrufen, danach das Polling starten
document.addEventListener("DOMContentLoaded", () => {
    ladeErgebnisse(); 
    
    // alle 3 sek aktualisiert
    setInterval(ladeErgebnisse, 3000);
});

// DELETE ENDPOINT (Stimmen zurücksetzen)
document.addEventListener("DOMContentLoaded", () => {
    const resetBtn = document.getElementById('resetVotesBtn');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', async () => {
        const confirmReset = confirm("Willst du die Evolution wirklich zurückdrehen und alle Stimmen löschen?");
        if (!confirmReset) return;

        const feedbackObj = document.getElementById('resetFeedback');

        try {
            const response = await fetch(`${VOTE_API_URL}`, {
                method: 'DELETE' 
            });

            if (!response.ok) throw new Error("Server antwortet mit Fehler");

            feedbackObj.innerText = "Meteorit eingeschlagen! Alle Ergebnisse wurden auf 0 gesetzt.";
            feedbackObj.style.color = "green"; // Färbt den Text der Erfolgsmeldung grün

            // Tabelle sofort neu laden
            ladeErgebnisse(); 

            // Meldung verschwindet nach 4 Sekunden (4000 Millisekunden)
            setTimeout(() => {
                feedbackObj.innerText = "";
            }, 4000);

        } catch (error) {
            // Gibt den genauen Fehler für Entwickler in der Browser-Konsole aus
            console.error("Fehler beim Zurücksetzen:", error);
            feedbackObj.innerText = "Fehler: Der Server konnte nicht erreicht werden.";
            feedbackObj.style.color = "red"; 
        }
    });
});