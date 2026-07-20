const db = require('../config/db');

/**
 * Obtiene todos los emprendedores de la base de datos.
 * Selecciona únicamente el ID y el nombre del negocio, que es lo que
 * necesita el frontend para el selector.
 */
const getAllEmprendedores = async (req, res) => {
    try {
        const emprendedores = await db('emprendedores')
            .select('id', 'nombre_negocio')
            .orderBy('nombre_negocio', 'asc'); // Ordena alfabéticamente
        console.log('Emprendedores obtenidos:', emprendedores);
        res.status(200).json(emprendedores);
    } catch (error) {
        console.error('Error al obtener los emprendedores:', error);
        res.status(500).json({ message: 'Error interno del servidor al consultar los emprendedores.' });
    }
};

module.exports = {
    getAllEmprendedores
};