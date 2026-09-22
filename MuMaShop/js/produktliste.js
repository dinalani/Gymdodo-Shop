"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("produktTabelleBody");
    const template = document.getElementById("produktTemplate");
    const summenAnzeige = document.getElementById("gesamtsumme");
    const form = document.getElementById("bestellForm");

    const productsUrl = `${API_URL}/products`;
    const expressBase = typeof EXPRESS_BASE_URL !== "undefined" ? EXPRESS_BASE_URL : "http://localhost:3001";
    const orderUrl = `${expressBase}/order`;

    let alleProdukte = [];
    let sichtbareProdukte = [];

    try {
        const response = await fetch(productsUrl);
        if (!response.ok) throw new Error("Fehler beim Laden der Produkte");
        
        alleProdukte = await response.json();
        sichtbareProdukte = alleProdukte.filter(p => p.available !== false);

        sichtbareProdukte.forEach((produkt, index) => {
            const clone = template.content.cloneNode(true);
            const row = clone.querySelector(".produkt-zeile");
            const checkbox = clone.querySelector(".produkt-checkbox");
            const nameCell = clone.querySelector(".produkt-name");
            const preisCell = clone.querySelector(".produkt-preis");

            checkbox.value = index;
            const units = produkt.availableUnits !== undefined ? Number(produkt.availableUnits) : 1;

            if (units <= 0) {
                checkbox.disabled = true;
                if (row) row.classList.add("out-of-stock");
                nameCell.innerHTML = `${produkt.name} <span class="out-of-stock-badge">derzeit nicht auf Lager</span>`;
            } else {
                nameCell.textContent = produkt.name;
                
                // EVENT LISTENER: Synchronisiert Checkbox-Änderungen zurück in den Warenkorb-Speicher
                checkbox.addEventListener("change", (e) => {
                    berechneSumme();
                    let cart = JSON.parse(localStorage.getItem("gymdodo_cart")) || [];
                    if (e.target.checked) {
                        if (!cart.includes(produkt.name)) cart.push(produkt.name);
                    } else {
                        cart = cart.filter(name => name !== produkt.name);
                    }
                    localStorage.setItem("gymdodo_cart", JSON.stringify(cart));
                });
            }
            
            const preis = parseFloat(produkt.price) || 0;
            preisCell.textContent = preis.toFixed(2) + " €";
            tbody.appendChild(clone);
        });

        // Haken aus localStorage initial setzen
        const cart = JSON.parse(localStorage.getItem("gymdodo_cart")) || [];
        document.querySelectorAll(".produkt-checkbox").forEach(cb => {
            const p = sichtbareProdukte[cb.value];
            if (cart.includes(p.name) && !cb.disabled) {
                cb.checked = true;
            }
        });
        berechneSumme();

    } catch (error) {
        console.error("Netzwerkfehler:", error);
        tbody.innerHTML = `<tr><td colspan="3" style="color: red; text-align: center; padding: 20px;">Produkte konnten nicht geladen werden. Läuft der Server auf Port 1806?</td></tr>`;
    }

    function berechneSumme() {
        let gesamt = 0;
        document.querySelectorAll(".produkt-checkbox:checked").forEach(cb => {
            const produkt = sichtbareProdukte[cb.value];
            if (produkt && produkt.price) gesamt += parseFloat(produkt.price) || 0;
        });
        summenAnzeige.textContent = gesamt.toFixed(2);
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const ausgewaehlteCheckboxes = document.querySelectorAll(".produkt-checkbox:checked");
            if (ausgewaehlteCheckboxes.length === 0) {
                alert("Bitte wählen Sie mindestens ein Produkt aus.");
                return;
            }

            const ausgewaehlteProdukte = Array.from(ausgewaehlteCheckboxes).map(cb => sichtbareProdukte[cb.value]);
            const bestelldaten = {
                anrede: document.getElementById("anrede").value,
                name: document.getElementById("bestellerName").value,
                email: document.getElementById("bestellerEmail").value,
                produkte: ausgewaehlteProdukte
            };

            try {
                const response = await fetch(orderUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bestelldaten)
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    // 1. Formular ausblenden
                    document.getElementById("bestellForm").style.display = "none";
                    
                    // 2. Daten in die Bestätigungsbox eintragen
                    document.getElementById("confirm-abholnummer").textContent = result.abholnummer;
                    document.getElementById("confirm-summe").textContent = result.gesamtsumme.toFixed(2);
                    
                    // 3. Bestätigungsbox einblenden
                    document.getElementById("order-confirmation").style.display = "block";
                    
                    // 4. Warenkorb leeren
                    localStorage.removeItem("gymdodo_cart"); 
                } else {
                    alert("Fehler bei der Vorbestellung: " + (result.error || "Unbekannter Fehler"));
                }
            } catch (error) {
                console.error("Netzwerkfehler beim Absenden:", error);
                alert("Verbindung zum Express-Server (Port 3001) fehlgeschlagen.");
            }
        });
    }
});