"use strict";

async function ladeNavigation() {
    const placeholder = document.getElementById("header-placeholder");
    if (!placeholder) return;
    try {
        const response = await fetch("header.html");
        if (!response.ok) throw new Error("Konnte header.html nicht laden");
        placeholder.innerHTML = await response.text();
        markiereAktiveSeite();
    } catch (error) {
        console.error("Fehler beim Laden der Navigation:", error);
    }
}

function markiereAktiveSeite() {
    let aktuelleURL = window.location.pathname.split("/").pop();
    if (aktuelleURL === "") aktuelleURL = "startseite.html";
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        if (link.getAttribute("href") === aktuelleURL) {
            link.classList.add("active");
        }
    });
}

// Stellt sicher, dass es lädt, egal wann das Skript eingefügt wird
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ladeNavigation);
} else {
    ladeNavigation();
}