const express = require('express');
const path = require('path');

const app = express();

// Servir arquivos estáticos
app.use(express.static(__dirname));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para teste.html
app.get('/teste', (req, res) => {
  res.sendFile(path.join(__dirname, 'teste.html'));
});

// Rota para debug-user-agent.html
app.get('/debug', (req, res) => {
  res.sendFile(path.join(__dirname, 'debug-user-agent.html'));
});

// Rota para a54.html
app.get('/a54', (req, res) => {
  res.sendFile(path.join(__dirname, 'a54.html'));
});

// Rota para a55.html
app.get('/a55', (req, res) => {
  res.sendFile(path.join(__dirname, 'a55.html'));
});

// Rota para poco-m5-pro.html
app.get('/poco', (req, res) => {
  res.sendFile(path.join(__dirname, 'poco-m5-pro.html'));
});

// Rota para m34.html
app.get('/m34', (req, res) => {
  res.sendFile(path.join(__dirname, 'm34.html'));
});

app.listen(3000, '0.0.0.0', () => {
  console.log("Servidor rodando em todas as interfaces");
  console.log("Acesse: http://localhost:3000");
  console.log("Debug: http://localhost:3000/debug");
  console.log("Teste: http://localhost:3000/teste");
});