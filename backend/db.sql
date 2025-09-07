-- 1. Cria a tabela "base_conhecimento", caso ela ainda não exista
CREATE TABLE IF NOT EXISTS base_conhecimento (
  pergunta TEXT PRIMARY KEY,
  resposta TEXT NOT NULL
);

-- 2. Insere ou atualiza os dados de exemplo
INSERT OR REPLACE INTO base_conhecimento (pergunta, resposta) VALUES
  ('quem é você?', 'Eu sou um mini-chat criado para demonstrar a integração com banco de dados.'),
  ('como você funciona?', 'Você digita uma pergunta, eu consulto meu banco de dados e respondo.'),
  ('o que é html?', 'HTML é a linguagem usada para criar páginas web.');