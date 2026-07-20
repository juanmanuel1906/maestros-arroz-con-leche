// src/server.js (Corregido)

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar las rutas
const resultadosRoutes = require('./routes/resultadosRoutes');
const votosRoutes = require('./routes/votosRoutes');
const juradoRoutes = require('./routes/juradoRoutes');
const emprendedoresRoutes =require('./routes/emprendedoresRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// --- Rutas de la API ---
app.get('/api', (req, res) => {
    res.json({ message: '¡Bienvenido a la API del Festival El Día del Rey!' });
});

app.use('/api/resultados', resultadosRoutes);
app.use('/api/votos', votosRoutes);
app.use('/api/jurado', juradoRoutes);
app.use('/api/emprendedores', emprendedoresRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});