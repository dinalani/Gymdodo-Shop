import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import votingRoutes from './votingRoutes.js'; 

const app = express(); 
const port = 3001; 
const dataDir = './data'; 

const dataFile = path.join(dataDir, "voting_results.json"); 
const kontaktFile = path.join(dataDir, "kontaktanfragen.json"); 
const orderFile = path.join(dataDir, "vorbestellungen.json");
const lotteryFile = path.join(dataDir, "lottery.json"); 
const productsFile = fs.existsSync("./json/products.json") ? "./json/products.json" : "./products.json"; 
const quizFile = fs.existsSync("./json/quiz.json") ? "./json/quiz.json" : "./quiz.json"; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Stellt sicher, dass der data-Ordner existiert
function ensureDataDir() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

// Initialisierung beim Start
ensureDataDir();
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({
        "Säbelzahn-BCAA (Kirsche)": 0, "Mammut-Masse-Gainer (Schoko)": 0,
        "Meteorit-Pre-Workout (Saurer Apfel)": 0, "Dino-Vegan-Protein (Vanille)": 0,
        "Urzeit-Creatin (Neutral)": 0
    }, null, 2));
}

app.get('/', (req, res) => res.send('Express-API (Order, Kontakt, Voting, Quiz) läuft'));

// QUIZ & PREISAUSSCHREIBEN

// Fragen abrufen
app.get('/quiz', (req, res) => {
    try {
        const quizData = JSON.parse(fs.readFileSync(quizFile, "utf-8"));
        const safeQuiz = quizData.map(q => ({ id: q.id, question: q.question, options: q.options }));
        res.json(safeQuiz);
    } catch (error) {
        res.status(500).json({ error: "Fehler beim Laden des Quiz." });
    }
});

// Antworten prüfen
app.post('/quiz/check', (req, res) => {
    try {
        const userAnswers = req.body;
        const quizData = JSON.parse(fs.readFileSync(quizFile, "utf-8"));
        
        let allCorrect = true;
        quizData.forEach(q => {
            if (userAnswers[q.id] !== q.answer) {
                allCorrect = false;
            }
        });

        res.json({ success: allCorrect });
    } catch (error) {
        res.status(500).json({ error: "Serverfehler bei der Überprüfung." });
    }
});

// Teilnehmer-Daten in lottery.json speichern
app.post('/quiz/participate', (req, res) => {
    try {
        ensureDataDir();
        const userData = req.body;
        userData.teilgenommenAm = new Date().toISOString();

        let lottery = fs.existsSync(lotteryFile) ? JSON.parse(fs.readFileSync(lotteryFile, "utf-8")) : [];
        if (!Array.isArray(lottery)) lottery = [];

        lottery.push(userData);
        fs.writeFileSync(lotteryFile, JSON.stringify(lottery, null, 2), "utf-8");

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: "Serverfehler beim Speichern." });
    }
});

// KONTAKTANFRAGEN 
app.post('/kontakt', (req, res) => {
    try {
        ensureDataDir(); 
        const formData = req.body;
        formData.eingegangenAm = new Date().toISOString(); 
        let anfragen = fs.existsSync(kontaktFile) ? JSON.parse(fs.readFileSync(kontaktFile, "utf-8")) : [];
        if (!Array.isArray(anfragen)) anfragen = [];
        anfragen.push(formData);
        fs.writeFileSync(kontaktFile, JSON.stringify(anfragen, null, 2), "utf-8");
        res.status(200).json({ success: true, message: "Gespeichert" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Serverfehler" });
    }
});

// VORBESTELLUNGEN 
app.post('/order', (req, res) => {
    try {
        ensureDataDir(); 
        const bestellung = req.body;
        if (!bestellung.produkte || !Array.isArray(bestellung.produkte) || bestellung.produkte.length === 0) {
            return res.status(400).json({ success: false, error: "Keine Produkte ausgewählt." });
        }

        let alleProdukte = fs.existsSync(productsFile) ? JSON.parse(fs.readFileSync(productsFile, "utf-8")) : [];
        let serverseitigeSumme = 0;
        
        bestellung.produkte.forEach(bestelltesProdukt => {
            const dbProdukt = alleProdukte.find(p => p.id === bestelltesProdukt.id || p.name === bestelltesProdukt.name);
            if (dbProdukt) {
                serverseitigeSumme += parseFloat(dbProdukt.price) || 0;
                if (dbProdukt.availableUnits !== undefined && dbProdukt.availableUnits > 0) dbProdukt.availableUnits -= 1; 
            } else {
                serverseitigeSumme += parseFloat(bestelltesProdukt.price) || 0;
            }
        });

        fs.writeFileSync(productsFile, JSON.stringify(alleProdukte, null, 4), "utf-8");

        let vorbestellungen = fs.existsSync(orderFile) ? JSON.parse(fs.readFileSync(orderFile, "utf-8")) : [];
        if (!Array.isArray(vorbestellungen)) vorbestellungen = [];

        const abholnummer = vorbestellungen.length + 1;
        const neueBestellung = {
            abholnummer: abholnummer,
            anrede: bestellung.anrede,
            name: bestellung.name,
            email: bestellung.email,
            produkte: bestellung.produkte,
            gesamtsumme: Number(serverseitigeSumme.toFixed(2)),
            bestelltAm: new Date().toISOString()
        };

        vorbestellungen.push(neueBestellung);
        fs.writeFileSync(orderFile, JSON.stringify(vorbestellungen, null, 2), "utf-8");

        res.status(200).json({ success: true, abholnummer: abholnummer, gesamtsumme: Number(serverseitigeSumme.toFixed(2)) });
    } catch (error) {
        res.status(500).json({ success: false, error: "Serverfehler bei der Bestellung." });
    }
});

app.use('/voting', votingRoutes);

app.listen(port, () => {
    console.log(`Express-Server läuft auf http://localhost:${port}`);
});