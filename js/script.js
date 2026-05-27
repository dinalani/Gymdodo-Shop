"use strict";

const MINAGE = 18;

function checkAge(age) {
    return age >= MINAGE;
}

// Ein Array mit allen Produkt-Informationen
const products = [
    {
        imgSrc: "img/Produkt1.png",
        imgAlt: "ein Bild von Vanilla Power Protein",
        price: "29.99€",
        title: "Power Protein",
        desc: "Cremiger Genuss mit echtem Vanillegeschmack. Dein perfekter Begleiter für Muskelaufbau, Regeneration und in der Diät.",
        tags: ["Proteine", "Supplements", "Muskelaufbau"]
    },
    {
        imgSrc: "img/Produkt2.png",
        imgAlt: "ein Bild von Zero Schoko und Erdbeersoße",
        price: "7.99€",
        title: "Zero Sauce",
        desc: "Veredle deine Lieblingsdesserts! Unsere süßen Soßen sind das perfekte Topping für Eis, Waffeln, Pancakes und Kuchen.",
        tags: ["Abnehmen"]
    },
    {
        imgSrc: "img/Produkt3.png",
        imgAlt: "ein Bild von Isoclear Protein",
        price: "24.99€",
        title: "IsoClear<br>Protein",
        desc: "Die fruchtige Alternative zum klassischen Milchshake. IsoClear löst sich in Wasser zu einem klaren, saftähnlichen Erfrischungsgetränk auf und liefert hochwertiges Eiweiß ohne milchigen Geschmack.",
        tags: ["Proteine", "Supplements"]
    },
    {
        imgSrc: "img/Produkt4.png",
        imgAlt: "ein Bild von Dodo Proteinriegel",
        price: "4.99€",
        title: "Dodo<br>Proteinriegel",
        desc: "Der Dodo Proteinriegel ist dein treuer Begleiter, wenn der Hunger kickt oder das Energieniveau sinkt. Er ist kompakt, lecker und sorgt dafür, dass du nicht zum „Sofa-Dodo“ mutierst.",
        tags: ["Proteine", "Muskelaufbau"]
    },
    {
        imgSrc: "img/Produkt5.png",
        imgAlt: "ein Bild von Dodo Energy & Fokus",
        price: "3.99€",
        title: "Dodo Energy<br>& Fokus",
        desc: "Der Dodo Energy ist BLA bljdhsihhe lopus ipsum ipsum",
        tags: ["Abnehmen", "Energy"]
    },
    {
        imgSrc: "img/Produkt6.png",
        imgAlt: "ein Bild von Dodo Flave powder",
        price: "14.99€",
        title: "Flave Powder",
        desc: "Der Dodo Energy ist BLA bljdhsihhe lopus ipsum ipsum",
        tags: ["Proteine", "Muskelaufbau"]
    }
];

function showProducts(userAge) {
    const div = document.querySelector(".article-container");

    // Wenn der User zu jung ist
    if (!checkAge(userAge)) {
        div.innerHTML = "";

        // Absatz-Element <p>
        const message = document.createElement("p");

        // Fehlernachricht
        message.textContent = "Du bist leider zu jung für diese Produkte.";

        // Style
        message.style.color = "red";
        message.style.fontSize = "1.2rem";
        message.style.fontWeight = "bold";

        div.appendChild(message);

        // Funktion hier abbrechen damit keine Produkte geladen werden
        return;
    }

    console.log("Hier wird die Darstellung der Produkte verarbeitet");
    const productTemplate = document.querySelector("template");

    // Ab hier folgt die normale Schleife für die Produkte
    products.forEach(product => {
        const productNode = productTemplate.content.cloneNode(true);

        productNode.querySelector(".shop-media img").src = product.imgSrc;
        productNode.querySelector(".shop-media img").alt = product.imgAlt;
        productNode.querySelector(".shop-tag").textContent = product.price;
        productNode.querySelector("h3").innerHTML = product.title;
        productNode.querySelector(".shop-meta").textContent = product.desc;

        const labelsContainer = productNode.querySelector(".shop-labels");
        product.tags.forEach(tagText => {
            const span = document.createElement("span");
            span.textContent = tagText;
            labelsContainer.appendChild(span);
        });

        div.appendChild(productNode);
    });
}

// Funktionsaufruf
showProducts(19);