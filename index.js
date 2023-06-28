const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let users = [];

// Rota de cadastro
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Verifica se o usuário já existe
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Usuário já existe.' });
  }

  // Cria um novo usuário
  const user = {
    id: users.length + 1,
    username,
    password
  };

  // Adiciona o usuário à lista
  users.push(user);

  res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Procura o usuário na lista
  const user = users.find(user => user.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  res.header('Access-Control-Allow-Origin', '*'); // Adiciona o cabeçalho Access-Control-Allow-Origin

  res.status(200).json({ message: 'Login bem-sucedido.', user });
});

// Rota de listagem de usuários
app.get('/users', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*'); // Adiciona o cabeçalho Access-Control-Allow-Origin

  res.json(users);
});

// Rota de detalhes do usuário
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  res.header('Access-Control-Allow-Origin', '*'); // Adiciona o cabeçalho Access-Control-Allow-Origin

  res.json(user);
});

// Rota de atualização do usuário
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, password } = req.body;
  let user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  user.username = username || user.username;
  user.password = password || user.password;

  res.header('Access-Control-Allow-Origin', '*'); // Adiciona o cabeçalho Access-Control-Allow-Origin

  res.json({ message: 'Usuário atualizado com sucesso.', user });
});

// Rota de exclusão do usuário
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(user => user.id === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  users.splice(index, 1);

  res.header('Access-Control-Allow-Origin', '*'); // Adiciona o cabeçalho Access-Control-Allow-Origin

  res.json({ message: 'Usuário excluído com sucesso.' });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});
