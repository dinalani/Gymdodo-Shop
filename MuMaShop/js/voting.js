"use strict";

// ABSTIMMUNGS-SEITE 
async function ladeVotingOptionen() {
    const optionsContainer = document.getElementById('dynamicVotingOptions');
    if (!optionsContainer) return;

    try {
        const response = await fetch(`${VOTE_API_URL}/results`);
        if (!response.ok) throw new Error("Netzwerkfehler");

        const daten = await response.json();
        optionsContainer.innerHTML = ""; 
        let zähler = 1;

        for (const produktName in daten) {
            const htmlString = `
                <label class="voting-option" for="prod${zähler}">
                    <input type="radio" id="prod${zähler}" name="produkt" value="${produktName}" required>
                    <span class="option-text">${produktName}</span>
                </label>
            `;
            optionsContainer.insertAdjacentHTML('beforeend', htmlString);
            zähler++;
        }
    } catch (error) {
        optionsContainer.innerHTML = "<p style='color:red; text-align:center;'>Fehler beim Laden. Server Port 3001 checken!</p>";
    }
}

// Voting absenden
function initVotingForm() {
    const votingForm = document.getElementById('votingForm');
    if (!votingForm) return;

    votingForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const checkedRadio = document.querySelector('input[name="produkt"]:checked');
        if (!checkedRadio) return; 

        const selectedProduct = checkedRadio.value;
        const feedbackMsg = document.getElementById('feedbackMessage');

        try {
            const response = await fetch(`${VOTE_API_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ produkt: selectedProduct })
            });

            if (response.ok) {
                feedbackMsg.innerText = "Stark! Deine Stimme ist in der Höhle angekommen.";
                feedbackMsg.style.color = "green";
                votingForm.reset(); 
            }
        } catch (error) {
            feedbackMsg.innerText = "Fehler: Der Server schläft noch.";
            feedbackMsg.style.color = "red";
        }
    });
}

// DETAILS-SEITE (details.html)
async function ladeDetailsOptionen() {
    const detailsContainer = document.getElementById('dynamicDetailsOptions');
    if (!detailsContainer) return;

    try {
        const response = await fetch(`${VOTE_API_URL}/results`);
        if (!response.ok) throw new Error("Netzwerkfehler");

        const daten = await response.json();
        detailsContainer.innerHTML = ""; 
        let zähler = 1;

        for (const produktName in daten) {
            const htmlString = `
                <label class="voting-option" for="detailProd${zähler}">
                    <input type="radio" id="detailProd${zähler}" name="produktDetail" value="${produktName}" required>
                    <span class="option-text">${produktName}</span>
                </label>
            `;
            detailsContainer.insertAdjacentHTML('beforeend', htmlString);
            zähler++;
        }
    } catch (error) {
        detailsContainer.innerHTML = "<p style='color:red; text-align:center;'>Fehler beim Laden der Optionen.</p>";
    }
}

// Einzelnes Ergebnis abfragen 
async function frageErgebnisAb() {
    const checkedRadio = document.querySelector('input[name="produktDetail"]:checked');
    const displayMsg = document.getElementById('singleResultDisplay');
    
    if (!checkedRadio) {
        displayMsg.innerText = "Bitte wähle zuerst ein Artefakt aus der Liste!";
        displayMsg.style.color = "red";
        return;
    }

    const selectedProduct = checkedRadio.value;
    displayMsg.innerText = "Frage Höhlenmalereien ab...";
    displayMsg.style.color = "#333";

    try {
        const response = await fetch(`${VOTE_API_URL}/results`);
        if (!response.ok) throw new Error("Netzwerkfehler");

        const daten = await response.json();
        const votes = daten[selectedProduct] || 0;

        displayMsg.innerText = `Für "${selectedProduct}" wurde bisher ${votes} mal gestimmt!`;
        displayMsg.style.color = "green";
        
    } catch (error) {
        displayMsg.innerText = "Fehler: Konnte das Ergebnis vom Server nicht laden.";
        displayMsg.style.color = "red";
    }
}

//  INITIALISIERUNG
document.addEventListener("DOMContentLoaded", () => {
    ladeVotingOptionen();   
    initVotingForm();      
    ladeDetailsOptionen(); 
});