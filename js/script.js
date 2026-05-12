"use strict";
//Mindestalter
const MIN_AGE = 18;

//Funktion checkAge
function checkAge(age) {
    if (age >= MIN_AGE) {
        return true;
    } else {
        return false;
    }
}

//Funktion showProducts mit if else ausgabe
function showProducts(userAge) {
    // Aufruf von checkAge innerhalb der Bedingung
    if (checkAge(userAge)) {
        console.log("Hier wird die Darstellung der Produkte verarbeitet");
    } else {
        console.log("Du bist zu jung möööööööh keine Proteine für dich");
    }
}

// Funktionsaufruf
showProducts(17);
