-- SQL Script para la creación de la Base de Datos del Festival "El Día del Rey"
-- -----------------------------------------------------------------------------

-- 1. CREACIÓN DE LA BASE DE DATOS
-- Se crea la base de datos si no existe y se selecciona para su uso.
CREATE DATABASE IF NOT EXISTS maestros_arroz_con_leche_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE maestros_arroz_con_leche_db;

-- -----------------------------------------------------------------------------
-- 2. TABLA DE EMPRENDEDORES
-- Almacena la información de cada participante del festival.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emprendedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_negocio VARCHAR(100) NOT NULL,
    nombre_emprendedor VARCHAR(60) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. TABLA DE JURADOS
-- Almacena la información de los jurados y sus credenciales de acceso.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jurados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    -- En una aplicación real, la contraseña debe ser un hash (ej. VARCHAR(255))
    -- y no texto plano.
    passwrd VARCHAR(255) NOT NULL,
    credencial TEXT COMMENT 'Descripción o biografía corta del jurado'
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. TABLA DE VOTOS DEL PÚBLICO
-- Registra cada voto emitido por el público asistente.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS votos_publico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emprendedor_id INT NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    calificacion_sabor INT NOT NULL COMMENT 'Calificación de 1 a 5 estrellas',
    calificacion_creatividad INT NOT NULL COMMENT 'Calificación de 1 a 5 estrellas',
    calificacion_presentacion INT NOT NULL COMMENT 'Calificación de 1 a 5 estrellas',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Llave foránea para relacionar el voto con un emprendedor
    FOREIGN KEY (emprendedor_id) REFERENCES emprendedores(id) ON DELETE CASCADE,
    UNIQUE KEY idx_voto_unico (emprendedor_id, device_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. TABLA DE VOTOS DEL JURADO
-- Registra la evaluación técnica y detallada de cada jurado para cada emprendedor.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS votos_jurado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emprendedor_id INT NOT NULL,
    jurado_id INT NOT NULL,
    calificacion_tecnica DECIMAL(4, 2) NOT NULL COMMENT 'Calificación de 1.0 a 10.0',
    calificacion_sabor DECIMAL(4, 2) NOT NULL COMMENT 'Calificación de 1.0 a 10.0',
    calificacion_innovacion DECIMAL(4, 2) NOT NULL COMMENT 'Calificación de 1.0 a 10.0',
    calificacion_presentacion DECIMAL(4, 2) NOT NULL COMMENT 'Calificación de 1.0 a 10.0',
    notas TEXT COMMENT 'Comentarios adicionales del jurado',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Llaves foráneas para relacionar la calificación con un emprendedor y un jurado
    FOREIGN KEY (emprendedor_id) REFERENCES emprendedores(id) ON DELETE CASCADE,
    FOREIGN KEY (jurado_id) REFERENCES jurados(id) ON DELETE CASCADE,

    -- Restricción para asegurar que un jurado solo pueda calificar una vez a cada emprendedor
    UNIQUE KEY idx_jurado_emprendedor (jurado_id, emprendedor_id)
) ENGINE=InnoDB;


-- -----------------------------------------------------------------------------
-- INSERCIÓN DE DATOS DE EJEMPLO (Opcional)
-- Descomenta estas líneas si quieres poblar la base de datos con datos de prueba.
-- -----------------------------------------------------------------------------

INSERT INTO emprendedores (nombre_negocio, nombre_emprendedor) VALUES
('Dulce Tradición', 'Ana Pérez'),
('Arroz Celestial', 'Carlos Rojas'),
('El Caldero de la Abuela', 'María Jiménez');

INSERT INTO jurados (nombre, usuario, passwrd, credencial) VALUES
('Juan Gourmet', 'juang', 'hash_de_contrasena_segura', 'Chef profesional con 15 años de experiencia'),
('Sofia Marketing', 'sofiam', 'hash_de_contrasena_segura', 'Experta en marketing gastronómico');

-- Votos de ejemplo para "Dulce Tradición"
INSERT INTO votos_publico (emprendedor_id, calificacion_sabor, calificacion_creatividad, calificacion_presentacion) VALUES
(1, 5, 4, 5),
(1, 4, 5, 5);

-- Calificación de ejemplo de un jurado para "Dulce Tradición"
INSERT INTO votos_jurado (emprendedor_id, jurado_id, calificacion_tecnica, calificacion_sabor, calificacion_innovacion, calificacion_presentacion, notas) VALUES
(1, 1, 9.20, 8.80, 9.00, 9.50, 'Excelente cremosidad y punto de cocción del arroz.');

SELECT * FROM votos_publico;
DROP TABLE votos_publico;

DELETE FROM emprendedores WHERE id = 6;

-- --- Fin del Script ---