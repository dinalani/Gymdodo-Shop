"use strict";

const MINAGE = 18;

function checkAge(age) {
    return age >= MINAGE;
}

// AUFGABE 4 PREISFORMATIERUNG

// Vorgegebene Funktion ermittlung der Nachkommastellen
function countDecimals(value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split('.')[1]?.length || 0;
}

// Eigene Funktion formatierung der Preise
function formatPrice(price) {
    // toFixed(2) macht aus 25 -> "25.00" oder aus 7.9 -> "7.90"
    return price.toFixed(2).replace(".", ",") + " €";
}
// let i = countDecimals(price);

// if (i == 0) {
// price = price + ",00 EUR";
// }
// else if (i == 1) {
// price = price + "0 EUR";
// }
// else {
// price = price + " EUR";
// }
// return price.replace(".", ",");
// }


// Aufgabe 1: Produkt Array

const products = [
    {
        title: "Power Protein",
        desc: "Cremiger Genuss mit echtem Vanillegeschmack. Dein perfekter Begleiter für Muskelaufbau, Regeneration und in der Diät.",
        imgSrc: "img/Produkt1.png",
        imgAlt: "ein Bild von Vanilla Power Protein",
        price: 29.95, // Krummer Centbetrag
        tags: ["Proteine", "Supplements", "Muskelaufbau"],
        isAvailable: true
    },
    {
        title: "Zero Sauce",
        desc: "Veredle deine Lieblingsdesserts! Unsere süßen Soßen sind das perfekte Topping für Eis, Waffeln, Pancakes und Kuchen.",
        imgSrc: "img/Produkt2.png",
        imgAlt: "ein Bild von Zero Schoko und Erdbeersoße",
        price: 7.9, // Glatter Zehner-Centbetrag
        tags: ["Abnehmen"],
        isAvailable: true
    },
    {
        title: "IsoClear<br>Protein",
        desc: "Die fruchtige Alternative zum klassischen Milchshake. IsoClear löst sich in Wasser zu einem klaren, saftähnlichen Erfrischungsgetränk auf und liefert hochwertiges Eiweiß.",
        imgSrc: "img/Produkt3.png",
        imgAlt: "ein Bild von Isoclear Protein",
        price: 25, // Glatter Betrag ohne Cents
        tags: ["Proteine", "Supplements"],
        isAvailable: true
    },
    {
        title: "Dodo<br>Proteinriegel",
        desc: "Der Dodo Proteinriegel ist dein treuer Begleiter, wenn der Hunger kickt oder das Energieniveau sinkt. Er ist kompakt und lecker.",
        imgSrc: "img/Produkt4.png",
        imgAlt: "ein Bild von Dodo Proteinriegel",
        price: 4.99,
        tags: ["Proteine", "Muskelaufbau"],
        isAvailable: false //AUFGABE 3 TEST: Dieses Produkt wird nicht angezeigt
    },
    {
        title: "Dodo Energy<br>& Fokus",
        desc: "Der Dodo Energy ist dein perfekter Booster vor dem Training.",
        imgSrc: "img/Produkt5.png",
        imgAlt: "ein Bild von Dodo Energy & Fokus",
        price: 3.99,
        tags: ["Abnehmen", "Energy"],
        isAvailable: true
    },
    {
        title: "Flave Powder",
        desc: "Das Geschmackspulver für deinen Quark oder Shake ohne extra Kalorien.",
        imgSrc: "img/Produkt6.png",
        imgAlt: "ein Bild von Dodo Flave powder",
        price: 14.9,
        tags: ["Proteine", "Muskelaufbau"],
        isAvailable: true
    }
];


// Aufgabe 2 und 3

function showProducts(userAge) {
    const div = document.querySelector(".article-container");

    // Altersprüfung
    if (!checkAge(userAge)) {
        div.innerHTML = "";
        const message = document.createElement("p");
        message.textContent = "Du bist leider zu jung für diese Produkte.";
        message.style.color = "red";
        message.style.fontSize = "1.2rem";
        message.style.fontWeight = "bold";
        div.appendChild(message);
        return;
    }

    console.log("Hier wird die Darstellung der Produkte verarbeitet");
    const productTemplate = document.querySelector("template");

    // Nutzung der for...of-Schleife zum Durchlaufen des Arrays
    for (const product of products) {

        // aufgabe 3: Produkt überspringen, wenn es nicht verfügbar ist
        if (!product.isAvailable) {
            continue;
        }

        const productNode = productTemplate.content.cloneNode(true);

        // Attribute aus dem Objekt zuweisen
        productNode.querySelector(".shop-media img").src = product.imgSrc;
        productNode.querySelector(".shop-media img").alt = product.imgAlt;
        productNode.querySelector("h3").innerHTML = product.title;
        productNode.querySelector(".shop-meta").textContent = product.desc;

        // Preis formatieren und zuweisen
        productNode.querySelector(".shop-tag").textContent = formatPrice(product.price);

        // Labels generieren
        const labelsContainer = productNode.querySelector(".shop-labels");
        product.tags.forEach(tagText => {
            const span = document.createElement("span");
            span.textContent = tagText;
            labelsContainer.appendChild(span);
        });

        div.appendChild(productNode);
    }
}

// DOM-Elemente für Buttons und Dialog selektieren
const deselectButton = document.querySelector("#deselectButton");
const compareButton = document.querySelector("#compareButton");
const compareDialog = document.querySelector("#compareDialog");
const compareContainer = document.querySelector("#compareContainer");
const closeDialogButton = document.querySelector("#closeDialogButton");

// Aktualisiert disabled Status der Buttons basierend auf der Auswahl
function updateButtons() {
    // Ermitteln wie viele Cards aktuell angeklickt sind
    const selectedCards = document.querySelectorAll(".shop-card.selected");
    const count = selectedCards.length;

    // aufgabe 3: Button nur anklickbar wenn mind 1 Produkt gewählt 
    deselectButton.disabled = count === 0;

    // aufgabe 5: Button nur anklickbar, wenn genau 2 Produkte gewählt sind
    compareButton.disabled = count !== 2;
}

// Öffnet den Dialog und fügt die Kopien ein (aufgabe 5)
function openCompareDialog() {
    const selectedCards = document.querySelectorAll(".shop-card.selected");

    if (selectedCards.length === 2) {
        // Zuerst den Container leeren, falls vorher schon mal verglichen wurde
        compareContainer.innerHTML = "";

        // Kopien (cloneNode) der ausgewählten Karten hinzufügen
        selectedCards.forEach(card => {
            compareContainer.appendChild(card.cloneNode(true));
        });

        // Dialog öffnen
        compareDialog.showModal();
    }
}

// EVENT-LISTENER

// aufgabe 3: Button "Auswahl aufheben" klickbar machen
deselectButton.addEventListener("click", function () {
    const selectedCards = document.querySelectorAll(".shop-card.selected");
    selectedCards.forEach(card => {
        card.classList.remove("selected"); // Hervorhebung entfernen
    });
    updateButtons(); // ButtonZustände aktualisieren
});

//aufgabe 5: Button "Produkte vergleichen" klickbar machen
compareButton.addEventListener("click", openCompareDialog);

// aufgabe 6: Dialog schließen
closeDialogButton.addEventListener("click", function () {
    compareDialog.close();

    // Alle ausgewählten Produkte nicht mehr hervorheben
    const selectedCards = document.querySelectorAll(".shop-card.selected");
    selectedCards.forEach(card => {
        card.classList.remove("selected");
    });
    updateButtons();
});

// aufgabe 7: Tastatursteuerung
document.addEventListener("keydown", function (event) {
    // Wenn genau 2 Produkte ausgewählt sind und 'l' gedrückt wird
    if (event.key === "l") {
        const selectedCount = document.querySelectorAll(".shop-card.selected").length;
        if (selectedCount === 2) {
            openCompareDialog();
        }
    }
});

// HAUPTFUNKTION

function showProducts(userAge) {
    const div = document.querySelector(".article-container");

    if (!checkAge(userAge)) {
        div.innerHTML = "";
        const message = document.createElement("p");
        message.textContent = "Du bist leider zu jung für diese Produkte.";
        message.style.color = "red";
        message.style.fontSize = "1.2rem";
        message.style.fontWeight = "bold";
        div.appendChild(message);
        return;
    }

    const productTemplate = document.querySelector("template");

    for (const product of products) {
        if (!product.isAvailable) {
            continue;
        }

        const productNode = productTemplate.content.cloneNode(true);
        const shopCard = productNode.querySelector(".shop-card");

        productNode.querySelector(".shop-media img").src = product.imgSrc;
        productNode.querySelector(".shop-media img").alt = product.imgAlt;
        productNode.querySelector("h3").innerHTML = product.title;
        productNode.querySelector(".shop-meta").textContent = product.desc;
        productNode.querySelector(".shop-tag").textContent = formatPrice(product.price);

        const labelsContainer = productNode.querySelector(".shop-labels");
        product.tags.forEach(tagText => {
            const span = document.createElement("span");
            span.textContent = tagText;
            labelsContainer.appendChild(span);
        });

        // B8 aufgabe 1 & 2: Produkte auswählbar machen und auf 2 begrenzen
        shopCard.addEventListener("click", function () {
            // Methode contains prüft ob das Element eine Klasse hat
            const isSelected = shopCard.classList.contains("selected");
            const selectedCount = document.querySelectorAll(".shop-card.selected").length;

            if (isSelected) {
                // Erneuter Klick -> CSS Klasse wieder entfernen
                shopCard.classList.remove("selected");
            } else {
                // Nur hinzufügen wenn bisher weniger als 2 ausgewählt sind
                if (selectedCount < 2) {
                    shopCard.classList.add("selected"); // Setzen der CSS-Klasse
                }
            }

            // Wichtig!!!!! Nach jedem Klick die Buttons validieren mööööhhh
            updateButtons();
        });

        div.appendChild(productNode);
    }

    // Button Zustände setzen (Beim laden der Seite ist noch nichts ausgewählt)
    updateButtons();
}

// Funktionsaufruf
showProducts(19);