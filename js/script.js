"use strict";

const MINAGE = 18;

function checkAge(age) {
    if (age >= MINAGE) {
        return true;
    } else {
        return false;
    }
}

// Funktion showProducts
function showProducts(userAge) {
    if (checkAge(userAge)) {
        console.log("Hier wird die Darstellung der Produkte verarbeitet");

        //Template selektieren
        const div = document.querySelector(".article-container");
        const productTemplate = document.querySelector("template");


        // Artikel 1: Power Protein Vanilla
        const product1 = productTemplate.content.cloneNode(true);

        product1.querySelector(".shop-media img").src = "img/Produkt1.png";
        product1.querySelector(".shop-media img").alt = "ein Bild von Vanilla Power Protein";
        product1.querySelector(".shop-tag").textContent = "29.99€";
        product1.querySelector("h3").innerHTML = "Power Protein<br>Vanilla";
        product1.querySelector(".shop-meta").textContent = "Cremiger Genuss mit echtem Vanillegeschmack. Dein perfekter Begleiter für Muskelaufbau, Regeneration und in der Diät.";

        //tags
        const labelsContainer1 = product1.querySelector(".shop-labels");
        const span1_1 = document.createElement("span");
        span1_1.textContent = "Proteine";
        labelsContainer1.appendChild(span1_1);

        const span1_2 = document.createElement("span");
        span1_2.textContent = "Supplements";
        labelsContainer1.appendChild(span1_2);

        div.appendChild(product1);


        // Artikel 2: Zero Sauce
        const product2 = productTemplate.content.cloneNode(true);

        product2.querySelector(".shop-media img").src = "img/Produkt2.png";
        product2.querySelector(".shop-media img").alt = "ein Bild von Zero Schoko und Erdbeersoße";
        product2.querySelector(".shop-tag").textContent = "7.99€";
        product2.querySelector("h3").innerHTML = "Zero<br>Sauce";
        product2.querySelector(".shop-meta").textContent = "Veredle deine Lieblingsdesserts! Unsere süßen Soßen sind das perfekte Topping für Eis, Waffeln, Pancakes und Kuchen.";

        const labelsContainer2 = product2.querySelector(".shop-labels");
        const span2_1 = document.createElement("span");
        span2_1.textContent = "Abnehmen";
        labelsContainer2.appendChild(span2_1);

        const span2_2 = document.createElement("span");
        span2_2.textContent = "Süß";
        labelsContainer2.appendChild(span2_2);

        div.appendChild(product2);


        // Artikel 3: IsoClear Protein
        const product3 = productTemplate.content.cloneNode(true);

        product3.querySelector(".shop-media img").src = "img/Produkt3.png";
        product3.querySelector(".shop-media img").alt = "ein Bild von Isoclear Protein";
        product3.querySelector(".shop-tag").textContent = "24.99€";
        product3.querySelector("h3").innerHTML = "IsoClear<br>Protein";
        product3.querySelector(".shop-meta").textContent = "Die fruchtige Alternative zum klassischen Milchshake. IsoClear löst sich in Wasser zu einem klaren, saftähnlichen Erfrischungsgetränk auf und liefert hochwertiges Eiweiß ohne milchigen Geschmack.";

        const labelsContainer3 = product3.querySelector(".shop-labels");
        const span3_1 = document.createElement("span");
        span3_1.textContent = "Proteine";
        labelsContainer3.appendChild(span3_1);

        const span3_2 = document.createElement("span");
        span3_2.textContent = "Supplements";
        labelsContainer3.appendChild(span3_2);

        div.appendChild(product3);


        // Artikel 4: Dodo Proteinriegel
        const product4 = productTemplate.content.cloneNode(true);

        product4.querySelector(".shop-media img").src = "img/Produkt4.png";
        product4.querySelector(".shop-media img").alt = "ein Bild von Dodo Proteinriegel";
        product4.querySelector(".shop-tag").textContent = "4.99€";
        product4.querySelector("h3").innerHTML = "Dodo<br>Proteinriegel";
        product4.querySelector(".shop-meta").textContent = "Der Dodo Proteinriegel ist dein treuer Begleiter, wenn der Hunger kickt oder das Energieniveau sinkt. Er ist kompakt, lecker und sorgt dafür, dass du nicht zum „Sofa-Dodo“ mutierst.";

        const labelsContainer4 = product4.querySelector(".shop-labels");
        const span4_1 = document.createElement("span");
        span4_1.textContent = "Proteine";
        labelsContainer4.appendChild(span4_1);

        const span4_2 = document.createElement("span");
        span4_2.textContent = "Muskelaufbau";
        labelsContainer4.appendChild(span4_2);

        div.appendChild(product4);

    } else {
        console.log("Du bist zu jung möööööööh keine Proteine für dich");
    }
}

// Funktionsaufruf
showProducts(18);
