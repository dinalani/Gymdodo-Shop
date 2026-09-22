"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    const questionsContainer = document.getElementById("questions-container");
    const quizForm = document.getElementById("quizForm");
    const lotteryForm = document.getElementById("lotteryForm");
    const errorMsg = document.getElementById("quiz-error");

    const expressBase = typeof EXPRESS_BASE_URL !== "undefined" ? EXPRESS_BASE_URL : "http://localhost:3001";

    // 1. Fragen laden
    try {
        const response = await fetch(`${expressBase}/quiz`);
        if (!response.ok) throw new Error("Fehler beim Laden");
        const questions = await response.json();
        
        questionsContainer.innerHTML = "";
        
        questions.forEach((q, index) => {
            const optionsHtml = q.options.map(opt => `
                <label style="display: block; padding: 8px; cursor: pointer;">
                    <input type="radio" name="question_${q.id}" value="${opt}" required>
                    ${opt}
                </label>
            `).join("");

            const qHtml = `
                <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                    <p style="font-weight: bold; font-size: 1.1rem; margin-bottom: 10px;">${index + 1}. ${q.question}</p>
                    ${optionsHtml}
                </div>
            `;
            questionsContainer.insertAdjacentHTML("beforeend", qHtml);
        });

    } catch (error) {
        questionsContainer.innerHTML = "<p style='color: red;'>Quiz konnte nicht geladen werden.</p>";
    }

    // 2. Antworten auswerten
    quizForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMsg.style.display = "none";

        const formData = new FormData(quizForm);
        const userAnswers = {};
        for (let [name, value] of formData.entries()) {
            const qId = name.replace("question_", "");
            userAnswers[qId] = value;
        }

        try {
            const response = await fetch(`${expressBase}/quiz/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userAnswers)
            });
            const result = await response.json();

            if (result.success) {
                // Quiz bestanden
                quizForm.style.display = "none";
                lotteryForm.style.display = "block";
            } else {
                // Falsche Antworten
                errorMsg.style.display = "block";
            }
        } catch (error) {
            console.error("Fehler beim Auswerten:", error);
        }
    });

    // 3. Lotterie-Teilnahme absenden
    lotteryForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userData = {
            name: document.getElementById("teilnehmerName").value,
            email: document.getElementById("teilnehmerEmail").value
        };

        try {
            const response = await fetch(`${expressBase}/quiz/participate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            const result = await response.json();

            if (result.success) {
                lotteryForm.innerHTML = `<h3 style="color: green; text-align: center;">Vielen Dank, ${userData.name}! Du nimmst nun am Preisausschreiben teil.</h3>`;
            }
        } catch (error) {
            console.error("Fehler bei Teilnahme:", error);
        }
    });
});