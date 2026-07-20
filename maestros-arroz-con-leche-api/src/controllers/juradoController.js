const db = require('../config/db');
// const bcrypt = require('bcrypt'); // Descomentar al implementar hashing

const loginJurado = async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        const jurado = await db('jurados').where({ usuario }).first();

        if (!jurado) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Lógica de comparación de contraseña (usar bcrypt en producción)
        // const passwordMatch = await bcrypt.compare(contrasena, jurado.contrasena);
        const passwordMatch = (contrasena === jurado.contrasena); // Solo para desarrollo

        if (passwordMatch) {
            res.status(200).json({ message: 'Login exitoso', token: 'este_es_un_token_de_prueba_muy_seguro' });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en login de jurado:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const registrarVotoJurado = async (req, res) => {
    const { emprendedor_id, jurado_id, calificacion_tecnica, calificacion_sabor, calificacion_innovacion, calificacion_presentacion, notas } = req.body;
    
    if (!emprendedor_id || !jurado_id || !calificacion_tecnica || !calificacion_sabor || !calificacion_innovacion || !calificacion_presentacion) {
        return res.status(400).json({ message: 'Faltan datos para la calificación del jurado.' });
    }

    try {
        // 'onConflict' y 'merge' actúan como un "INSERT ... ON DUPLICATE KEY UPDATE"
        // Esto permite a un jurado calificar o actualizar su calificación para un emprendedor.
        await db('votos_jurado')
            .insert({
                emprendedor_id,
                jurado_id,
                calificacion_tecnica,
                calificacion_sabor,
                calificacion_innovacion,
                calificacion_presentacion,
                notas
            })
            .onConflict(['jurado_id', 'emprendedor_id'])
            .merge();

        res.status(201).json({ message: 'Calificación guardada correctamente.' });
    } catch (error) {
        console.error('Error al registrar voto del jurado:', error);
        res.status(500).json({ message: 'Error al guardar la calificación.' });
    }
};

module.exports = {
    loginJurado,
    registrarVotoJurado
};