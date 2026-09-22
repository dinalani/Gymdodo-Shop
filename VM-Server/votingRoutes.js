import express from 'express'; 
import fs from 'node:fs'; 

const router = express.Router(); 
const dataFile = './data/voting_results.json'; 

// Standard-Objekt
const standardOptionen = {
    "Säbelzahn-BCAA (Kirsche)": 0,
    "Mammut-Masse-Gainer (Schoko)": 0,
    "Meteorit-Pre-Workout (Saurer Apfel)": 0,
    "Dino-Vegan-Protein (Vanille)": 0,
    "Urzeit-Creatin (Neutral)": 0
};

// ENDPUNKTE (GET, POST, DELETE)

// GET /rersults
// Gibt die Ergebnisse des votings zurück
router.get('/results', (req, res) => {
    const rawData = fs.readFileSync(dataFile, 'utf-8');
    res.status(200).json(JSON.parse(rawData));
});

// GET /voting/count/:id 
// Gibt nur die Stimmenanzahl für ein ganz bestimmtes Produkt zurück
router.get('/count/:id', (req, res) => {
    const rawData = fs.readFileSync(dataFile, 'utf-8');
    const ergebnisse = JSON.parse(rawData);
    const votes = ergebnisse[req.params.id] !== undefined ? ergebnisse[req.params.id] : 0;
    res.status(200).json({ product: req.params.id, votes: votes });
});

// POST /voting 
// nimmt eine neue Stimme entgegen und speichert sie 
router.post('/', (req, res) => {
    const neuesProdukt = req.body.produkt;
    if (!neuesProdukt) return res.status(400).json({ error: 'Kein Produkt ausgewählt.' });

    const ergebnisse = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    ergebnisse[neuesProdukt] = (ergebnisse[neuesProdukt] || 0) + 1;
    fs.writeFileSync(dataFile, JSON.stringify(ergebnisse, null, 2));
    res.status(200).json({ message: 'Stimme gezählt!' });
});

// DELETE /voting 
//  setzt alle Abstimmungsergebnisse wieder auf den Nullzustand zurück
router.delete('/', (req, res) => {
    fs.writeFileSync(dataFile, JSON.stringify(standardOptionen, null, 2));
    res.status(200).json({ message: 'Ergebnisse zurückgesetzt.' });
});

// EXPORT
export default router;