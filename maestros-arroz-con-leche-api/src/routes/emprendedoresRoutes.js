const express = require('express');
const router = express.Router();
const { getAllEmprendedores } = require('../controllers/emprendedoresController');

// GET /api/emprendedores
router.get('/', getAllEmprendedores);

module.exports = router;