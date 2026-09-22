# MuMa Mall Shop 21

Das Projekt besteht aus zwei Hauptkomponenten:
*   **MuMa Shop:** Frontend
*   **VM-Server:** Backend

---

## Frontend

Aufgrund von CORS-Richtlinien muss das Frontend über die IDE bereitgestellt werden (z. B. über den Live Server in VS Code).

## Backend

Navigiere in den Backend-Ordner und installiere die Abhängigkeiten:

```bash
cd VM-Server
npm install
```

Für den Shop müssen **beide** Server parallel laufen (in zwei separaten Terminals):

1. API-Server starten:
```bash
node api_server.js
```

2. Express-Server starten:
```bash
node express_server.js
```