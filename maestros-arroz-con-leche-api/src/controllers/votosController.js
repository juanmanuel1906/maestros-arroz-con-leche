const db = require('../config/db');

const registrarVotoPublico = async (req, res) => {
    const { emprendedor_id, device_id, calificacion_sabor, calificacion_creatividad, calificacion_presentacion } = req.body;

    if (!emprendedor_id || !device_id || !calificacion_sabor || !calificacion_creatividad || !calificacion_presentacion) {
        return res.status(400).json({ message: 'Faltan datos para registrar el voto.' });
    }

    try {
        // La restricción UNIQUE en la base de datos manejará los duplicados.
        // Knex lanzará un error si se intenta insertar un duplicado.
        await db('votos_publico').insert({
            emprendedor_id,
            device_id,
            calificacion_sabor,
            calificacion_creatividad,
            calificacion_presentacion
        });
        res.status(201).json({ message: '¡Gracias por tu voto! Ha sido registrado exitosamente.' });
    } catch (error) {
        // El código de error para una violación de restricción UNIQUE en MySQL es 'ER_DUP_ENTRY'
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Ya has votado por este emprendedor desde este dispositivo.' });
        }
        console.error('Error al registrar voto del público:', error);
        res.status(500).json({ message: 'Error al guardar el voto.' });
    }
};

module.exports = {
    registrarVotoPublico
};
