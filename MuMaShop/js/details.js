"use strict"; 

// VOTINGSYSTEM: Optionen aus dem Backend laden & Radio Buttons bauen
document.addEventListener("DOMContentLoaded", async () => {
    
    const optionsContainer = document.getElementById('dynamicDetailsOptions');
    if (!optionsContainer) return;

    try {
        const response = await fetch(`${VOTE_API_URL}/results`);
        if (!response.ok) throw new Error("Netzwerkfehler");

        const daten = await response.json();
        
        optionsContainer.innerHTML = ""; 
        
        let zähler = 1;

        for (const produktName in daten) {
            const htmlString = `
                <label class="voting-option" for="det${zähler}">
                    <input type="radio" id="det${zähler}" name="produkt" value="${produktName}" required>
                    <span class="option-text">${produktName}</span>
                </label>
            `;
            
            optionsContainer.insertAdjacentHTML('beforeend', htmlString);
            zähler++;
        }
        
    } catch (error) {
        optionsContainer.innerHTML = "<p style='color:red; text-align:center;'>Fehler beim Laden der Optionen. Läuft der Server?</p>";
    }
});