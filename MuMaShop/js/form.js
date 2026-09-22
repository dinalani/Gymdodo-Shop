"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("kontaktForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const contactUrl = CONTACT_API_URL;

        try {
            const response = await fetch(contactUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                window.location.href = "danke.html";
            } else {
                alert("Fehler beim Speichern der Anfrage.");
            }
        } catch (error) {
            console.error("Netzwerkfehler:", error);
            alert("Verbindung zum Server fehlgeschlagen.");
        }
    });
});