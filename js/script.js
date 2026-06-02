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
    let priceString = price.toString();
    const decimals = countDecimals(price);

    // Nullen auffüllen je nach Anzahl der Nachkommastellen
    if (decimals === 0) {
        priceString += ",00";
    } else if (decimals === 1) {
        priceString = priceString.replace(".", ",") + "0";
    } else {
        priceString = priceString.replace(".", ",");
    }

    // Währung anhängen
    return priceString + " €";
}


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

// Funktionsaufruf
showProducts(19);