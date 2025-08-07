const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Suporta imagens base64 grandes

const db = new sqlite3.Database('./portfolio.db');

// Criação de tabelas
// Usuários: username único, senha, nome, email, role
// Portfólios: username, data (JSON string)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT,
    email TEXT,
    role TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    data TEXT
  )`);
});

// Criar usuário
app.post('/api/users', (req, res) => {
  const { username, password, name, email, role } = req.body;
  db.run(
    `INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)`,
    [username, password, name, email, role],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(
    `SELECT username, name, email, role FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      res.json(row);
    }
  );
});

// Salvar portfólio
app.post('/api/portfolio', (req, res) => {
  const { username, data } = req.body;
  db.run(
    `INSERT INTO portfolios (username, data) VALUES (?, ?)
     ON CONFLICT(username) DO UPDATE SET data=excluded.data`,
    [username, JSON.stringify(data)],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Buscar portfólio
app.get('/api/portfolio/:username', (req, res) => {
  db.get(
    `SELECT data FROM portfolios WHERE username = ?`,
    [req.params.username],
    (err, row) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(row ? JSON.parse(row.data) : {});
    }
  );
});

// Recuperação de senha (simples: retorna email se existir)
app.post('/api/recover', (req, res) => {
  const { email } = req.body;
  db.get(
    `SELECT username, email FROM users WHERE email = ?`,
    [email],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Email não encontrado' });
      res.json(row);
    }
  );
});

// Alterar senha
app.post('/api/change-password', (req, res) => {
  const { username, newPassword } = req.body;
  db.run(
    `UPDATE users SET password = ? WHERE username = ?`,
    [newPassword, username],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Listar todos os usuários (admin)
app.get('/api/users', (req, res) => {
  db.all(`SELECT username, name, email, role FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Excluir usuário (admin)
app.delete('/api/users/:username', (req, res) => {
  db.run(`DELETE FROM users WHERE username = ?`, [req.params.username], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    db.run(`DELETE FROM portfolios WHERE username = ?`, [req.params.username], function (err2) {
      if (err2) return res.status(400).json({ error: err2.message });
      res.json({ success: true });
    });
  });
});

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
}); 