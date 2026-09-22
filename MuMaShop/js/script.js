"use strict";

// Native API
const API_URL = "http://localhost:3000"; 

// --- EXPRESS URL  ---
const EXPRESS_BASE_URL = "http://localhost:3001";

const VOTE_API_URL = `${EXPRESS_BASE_URL}/voting`; 
const CONTACT_API_URL = `${EXPRESS_BASE_URL}/kontakt`;

// Globale Hilfsfunktion zur Preisformatierung
function formatPrice(price) {
    return price.toFixed(2).replace(".", ",") + " €";
}

// GLOBALE SCRIPTS AUTOMATISCH LADEN (Injection)
function ladeModul(pfad) {
    const script = document.createElement("script");
    script.src = pfad;
    script.async = false;
    document.head.appendChild(script);
}

// Header & Footer JS automatisch einbinden
ladeModul("../js/header.js");
ladeModul("../js/footer.js");