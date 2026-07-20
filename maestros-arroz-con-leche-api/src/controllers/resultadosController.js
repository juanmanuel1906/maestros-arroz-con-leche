const db = require('../config/db');

const getResultadosFinales = async (req, res) => {
    try {
        // 1. Obtener los nombres de todos los emprendedores
        const emprendedores = await db('emprendedores').select('id', 'nombre_negocio');

        // 2. Calcular el puntaje promedio del jurado para cada emprendedor
        const juryScores = await db('votos_jurado')
            .select('emprendedor_id')
            .avg({ avg_jury_score: db.raw('(calificacion_tecnica * 0.4) + (calificacion_sabor * 0.3) + (calificacion_innovacion * 0.2) + (calificacion_presentacion * 0.1)') })
            .groupBy('emprendedor_id');

        // 3. Calcular el puntaje promedio del público para cada emprendedor
        const publicScores = await db('votos_publico')
            .select('emprendedor_id')
            .avg({ avg_public_score: db.raw('(calificacion_sabor + calificacion_creatividad + calificacion_presentacion) / 3') })
            .groupBy('emprendedor_id');

        // 4. Unir y calcular los resultados finales
        const finalResults = emprendedores.map(emp => {
            const juryVote = juryScores.find(j => j.emprendedor_id === emp.id);
            const publicVote = publicScores.find(p => p.emprendedor_id === emp.id);

            const juryScore = juryVote ? parseFloat(juryVote.avg_jury_score) : 0;
            const publicScore = publicVote ? parseFloat(publicVote.avg_public_score) : 0;

            // Normalizar puntaje del público a una escala de 10 para el cálculo
            const publicScoreNormalized = publicScore * 2;

            // Calcular el puntaje final ponderado (60% jurado, 40% público)
            const finalScore = (juryScore * 0.60) + (publicScoreNormalized * 0.40);

            return {
                id: emp.id,
                nombre_negocio: emp.nombre_negocio,
                detalle_puntajes: {
                    puntaje_jurado: parseFloat(juryScore.toFixed(3)),
                    puntaje_publico: parseFloat(publicScore.toFixed(3)), // Se devuelve en escala 1-5
                },
                puntaje_final: parseFloat(finalScore.toFixed(3))
            };
        }).sort((a, b) => b.puntaje_final - a.puntaje_final);

        res.status(200).json(finalResults);

    } catch (error) {
        console.error('Error al calcular resultados:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = {
    getResultadosFinales
};
