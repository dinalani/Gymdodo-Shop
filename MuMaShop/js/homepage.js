"use strict";

// PRODUKTE LADEN (Nur Top 3 für Startseite)
async function ladeHomepageProdukte() {
    const container = document.getElementById("produkte-container");
    if (!container) return; 

    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);

        const alleProdukte = await response.json();
        
        // FIX: Filtere alle Produkte raus, die explicitly available: false sind
        const sichtbareProdukte = alleProdukte.filter(p => p.available !== false);
        const topProdukte = sichtbareProdukte.slice(0, 3);
        
        const cart = JSON.parse(localStorage.getItem("gymdodo_cart")) || [];
        
        container.innerHTML = ""; 

        topProdukte.forEach(produkt => {
            const labelsHtml = produkt.labels.map(label => `<a href="shop.html?tag=${encodeURIComponent(label)}" class="product-tag-link">${label}</a>`).join("");
            const formatierterPreis = typeof formatPrice === 'function' ? formatPrice(produkt.price) : `${produkt.price}€`;
            
            const units = produkt.availableUnits !== undefined ? Number(produkt.availableUnits) : 1;
            const inCart = cart.includes(produkt.name);
            
            let btnText = "Vorbestellen";
            let btnClass = "shop-link";
            let disabledAttr = "";

            if (units <= 0) {
                btnText = "Ausverkauft";
                btnClass = "shop-link sold-out";
                disabledAttr = "disabled";
            } else if (inCart) {
                btnText = "Im Warenkorb ✓";
                btnClass = "shop-link in-cart";
            }

            const htmlString = `
                <article class="shop-card" data-id="${produkt.id}">
                    <div class="shop-media">
                        <img src="../${produkt.image}" alt="${produkt.imageAlt}">
                    </div>
                    <div class="shop-body">
                        <p class="shop-tag">${produkt.name}</p>
                        <h3>${formatierterPreis}</h3>
                        <p class="shop-meta">${produkt.description}</p>
                        <div class="shop-labels">${labelsHtml}</div>
                        <button class="${btnClass}" data-name="${produkt.name}" ${disabledAttr}>${btnText}</button>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML("beforeend", htmlString);
        });
    } catch (error) {
        console.error("Fehler:", error);
        container.innerHTML = "<p class='error-msg'>Produkte konnten nicht geladen werden.</p>";
    }
}

function initVergleichsLogik() {
    const deselectButton = document.querySelector("#deselectButton");
    const compareButton = document.querySelector("#compareButton");
    const compareDialog = document.querySelector("#compareDialog");
    const compareContainer = document.querySelector("#compareContainer");
    const closeDialogButton = document.querySelector("#closeDialogButton");

    function updateButtons() {
        const selectedCards = document.querySelectorAll(".shop-card.selected");
        if (deselectButton) deselectButton.disabled = selectedCards.length === 0;
        if (compareButton) compareButton.disabled = selectedCards.length !== 2;
    }

    function openCompareDialog() {
        const selectedCards = document.querySelectorAll(".shop-card.selected");
        if (selectedCards.length === 2 && compareContainer && compareDialog) {
            compareContainer.innerHTML = "";
            selectedCards.forEach(card => compareContainer.appendChild(card.cloneNode(true)));
            compareDialog.showModal();
        }
    }

    document.addEventListener("click", function(event) {
        if (event.target.closest(".product-tag-link")) return;

        // WARENKORB TOGGLE
        if (event.target.closest(".shop-link")) {
            event.preventDefault();
            const btn = event.target.closest(".shop-link");
            
            if (btn.disabled || btn.classList.contains("sold-out")) return;

            const produktName = btn.getAttribute("data-name");
            let cart = JSON.parse(localStorage.getItem("gymdodo_cart")) || [];
            
            if (cart.includes(produktName)) {
                cart = cart.filter(name => name !== produktName);
                btn.classList.remove("in-cart");
                btn.textContent = "Vorbestellen";
            } else {
                cart.push(produktName);
                btn.classList.add("in-cart");
                btn.textContent = "Im Warenkorb ✓";
            }
            
            localStorage.setItem("gymdodo_cart", JSON.stringify(cart));
            return; 
        }

        const shopCard = event.target.closest(".shop-card");
        if (shopCard && deselectButton) { 
            if (shopCard.classList.contains("selected")) shopCard.classList.remove("selected");
            else if (document.querySelectorAll(".shop-card.selected").length < 2) shopCard.classList.add("selected");
            updateButtons();
        }
    });

    if (deselectButton) deselectButton.addEventListener("click", () => {
        document.querySelectorAll(".shop-card.selected").forEach(c => c.classList.remove("selected"));
        updateButtons(); 
    });
    if (compareButton) compareButton.addEventListener("click", openCompareDialog);
    if (closeDialogButton) closeDialogButton.addEventListener("click", () => {
        compareDialog.close();
        document.querySelectorAll(".shop-card.selected").forEach(c => c.classList.remove("selected"));
        updateButtons();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    ladeHomepageProdukte();
    initVergleichsLogik();
});