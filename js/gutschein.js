"use strict";

function ladeGutschein() {
    const ergebnisAnzeige = document.getElementById("coupon-result");

    // Ajax-Abruf vom Node-API-Server
    fetch("http://localhost:3000/coupon")
        .then(function (response) {
            return response.text(); // Die Antwort als reinen Text einlesen
        })
        .then(function (code) {
            // Teilaufgabe 1.5: Auswertung des Rückgabewerts
            if (code === "0") {
                ergebnisAnzeige.innerHTML = `
                    <div class="error-message">
                        Leider sind aktuell keine Gutscheine mehr verfügbar.
                    </div>
                `;
            } else {
                ergebnisAnzeige.innerHTML = `
                    <p>Dein persönlicher Rabattcode:</p>
                    <div class="coupon-code">${code}</div>
                `;
            }
        })
        .catch(function (error) {
            console.error("Fehler beim API-Abruf:", error);
            ergebnisAnzeige.innerHTML = "<p style='color: red;'>API-Server ist nicht erreichbar.</p>";
        });
}

// Sofort ausführen, wenn das Skript geladen wird
ladeGutschein();