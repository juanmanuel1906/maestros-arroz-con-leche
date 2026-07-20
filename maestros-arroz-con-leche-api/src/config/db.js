const knex = require('knex');
const knexfile = require('../../knexfile');

// Selecciona la configuración de 'development' del knexfile.js
const db = knex(knexfile.development);

module.exports = db;