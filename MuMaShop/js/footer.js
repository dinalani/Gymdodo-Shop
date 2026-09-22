"use strict";

async function ladeFooter() {
    const placeholder = document.getElementById("footer-placeholder");
    if (!placeholder) return;
    try {
        const response = await fetch("footer.html");
        if (!response.ok) throw new Error("Konnte footer.html nicht laden");
        placeholder.innerHTML = await response.text();
        
        ladeBesucherZahl();
    } catch (error) {
        console.error("Fehler beim Laden des Footers:", error);
    }
}

async function ladeBesucherZahl() {
    const zaehlerFeld = document.getElementById("visitor-count");
    const produktZaehlerFeld = document.getElementById("products-count");
    if (!zaehlerFeld) return;
    
    try {
        const response = await fetch(`${API_URL}/visitors`); // API_URL aus script.js zu
        if (!response.ok) throw new Error("Netzwerkfehler");
        
        const data = await response.json();
        zaehlerFeld.innerText = data.visitors;
        if (produktZaehlerFeld) produktZaehlerFeld.innerText = data.products;
    } catch (error) {
        console.error("Fehler beim Abrufen der Zähler:", error);
        zaehlerFeld.innerText = "unbekannt";
        if (produktZaehlerFeld) produktZaehlerFeld.innerText = "unbekannt";
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ladeFooter);
} else {
    ladeFooter();
}