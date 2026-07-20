const express = require('express');
const routerJurado = express.Router();
const { loginJurado, registrarVotoJurado } = require('../controllers/juradoController');
routerJurado.post('/login', loginJurado);
routerJurado.post('/votar', registrarVotoJurado);
module.exports = routerJurado;