// --- SERVIDOR NODE.JS COM EXPRESS ---

// 1. Importa os módulos
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// 2. Configura o servidor
const app = express();
const PORT = 3000;

// 3. Configura os middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 4. Conecta ao banco de dados
const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite");
        // Executa o script SQL para garantir que a tabela e os dados existam
        const sqlScript = fs.readFileSync(path.join(__dirname, 'db.sql'), 'utf8');
        db.exec(sqlScript);
    }
});

// 5. Define as rotas

// Rota para BUSCAR uma resposta (Leitura no DB)
app.post("/perguntar", (req, res) => {
    const pergunta = req.body.pergunta.toLowerCase().trim();
    const sql = "SELECT resposta FROM base_conhecimento WHERE pergunta = ?";

    db.get(sql, [pergunta], (err, row) => {
        if (err) {
            return res.status(500).json({ resposta: "Erro no servidor!" });
        }
        const resposta = row ? row.resposta : "Puxa, essa eu ainda não sei. Que tal me ensinar a resposta? (Dica: use a opção '/ensinar' para me ajudar!)";
        res.json({ resposta: resposta });
    });
});

// Rota para ENSINAR uma nova resposta (Escrita no DB)
app.post("/ensinar", (req, res) => {
    const { pergunta, resposta } = req.body;

    if (!pergunta || !resposta) {
        return res.status(400).json({ mensagem: "Por favor, preencha ambos os campos!" });
    }

    const sql = "INSERT OR REPLACE INTO base_conhecimento (pergunta, resposta) VALUES (?, ?)";
    const params = [pergunta.toLowerCase().trim(), resposta.trim()];

    db.run(sql, params, (err) => {
        if (err) {
            return res.status(500).json({ mensagem: "Erro ao salvar no banco de dados!" });
        }
        res.status(201).json({ mensagem: "Ótimo! Aprendi algo novo!" });
    });
});

// 6. Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});