const express = require('express');
const routerVotos = express.Router();
const { registrarVotoPublico } = require('../controllers/votosController');
routerVotos.post('/', registrarVotoPublico);
module.exports = routerVotos;