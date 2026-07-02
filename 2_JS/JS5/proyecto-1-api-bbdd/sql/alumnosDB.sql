CREATE DATABASE IF NOT EXISTS alumnosDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE alumnosDB;

CREATE TABLE IF NOT EXISTS alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  edad INT NOT NULL
);

INSERT INTO alumnos (nombre, apellido, edad) VALUES
('Martina', 'Gómez', 17),
('Julián', 'Pérez', 18),
('Sofía', 'Rodríguez', 16),
('Mateo', 'Fernández', 19),
('Valentina', 'López', 18);

