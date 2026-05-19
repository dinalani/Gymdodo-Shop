"use strict";
//Mindestalter
const MINAGE = 18;

//Eingabe Age größer/gleich MinAge
function checkAge(age) {
    if (age >= MINAGE) {
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
showProducts(18);
