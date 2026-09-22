"use strict";

// TEILAUFGABE 1.1: TEAM-DATEN LADEN & RENDERN (DARK STAGE)

async function ladeTeam() {
    const container = document.getElementById("team-container");
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/team`);

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const teamMitglieder = await response.json();

        container.innerHTML = "";

        // Karten für jedes Team-Mitglied erzeugen
        teamMitglieder.forEach(person => {
            // Liste der Aufgaben
            const aufgabenHtml = person.tasks && Array.isArray(person.tasks)
                ? person.tasks.map(aufgabe => `<li>${aufgabe}</li>`).join("")
                : "<li>Allrounder im Gymdodo-Projekt</li>";

            // Hobbys
            const hobbysHtml = person.hobbies && Array.isArray(person.hobbies)
                ? person.hobbies.map(hobby => `<span class="pill">${hobby}</span>`).join("")
                : "";

            // Initiale für Bild-Fallback
            const initial = person.name ? person.name.charAt(0).toUpperCase() : "D";

            // HTML-Gerüst
            const cardHtml = `
                <article class="team-card premium-dark" data-id="${person.id}">
                    <div class="card-header">
                        <div class="avatar">
                            <img src="../${person.image}" 
                                 alt="${person.imageAlt || person.name}" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="avatar-fallback" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; background: #ff9253; color: white; font-size: 2rem; font-weight: bold;">${initial}</div>
                        </div>
                        <div class="title-group">
                            <h3>${person.name}</h3>
                            <span class="role">${person.role}</span>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        ${person.quote ? `<blockquote class="quote">${person.quote}</blockquote>` : ""}
                        
                        <p class="description">
                            ${person.description}
                        </p>
                        
                        <div class="tasks">
                            <h4>Hauptaufgaben</h4>
                            <ul>
                                ${aufgabenHtml}
                            </ul>
                        </div>
                        
                        <div class="hobbies">
                            ${hobbysHtml}
                        </div>
                    </div>
                </article>
            `;

            container.insertAdjacentHTML("beforeend", cardHtml);
        });

    } catch (error) {
        console.error("Fehler beim Abrufen der Teamdaten:", error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #ff4c4c; padding: 30px;">
                <p style="font-weight: bold; font-size: 1.2rem;">Das Team konnte nicht geladen werden.</p>
                <p>Bitte stelle sicher, dass der Node.js Server auf Port 1806 läuft.</p>
            </div>
        `;
    }
}

// Sobald der DOM geladen ist, das Team abrufen
document.addEventListener("DOMContentLoaded", () => {
    ladeTeam();
});