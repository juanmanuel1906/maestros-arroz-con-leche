const express = require('express');
const router = express.Router();
const { getResultadosFinales } = require('../controllers/resultadosController');
router.get('/', getResultadosFinales);
module.exports = router;