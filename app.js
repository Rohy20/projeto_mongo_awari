const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'mydb';
const collectionName = 'users';

// Função para conectar ao MongoDB
async function connect() {
  const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
  try {
    const collection = await connect();
    const user = req.body;
    const result = await collection.insertOne(user);
    res.json(result.ops[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o usuário' });
  }
});

// Rota para listar todos os usuários
app.get('/users', async (req, res) => {
  try {
    const collection = await connect();
    const users = await collection.find().toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar os usuários' });
  }
});

// Rota para buscar um usuário por ID
app.get('/users/:id', async (req, res) => {
  try {
    const collection = await connect();
    const userId = req.params.id;
    const user = await collection.findOne({ _id: ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o usuário' });
  }
});

// Inicie o servidor na porta 8080
app.listen(8080, () => {
  console.log('Servidor rodando em http://localhost:8080');
});
