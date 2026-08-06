-- Base de datos del proyecto El Ahorcado
CREATE DATABASE IF NOT EXISTS Score
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE Score;

-- Tabla de palabras que usa el juego
CREATE TABLE IF NOT EXISTS palabras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  palabra VARCHAR(100) NOT NULL,
  categoria VARCHAR(60) NOT NULL DEFAULT 'general',
  pista VARCHAR(160) NULL,
  dificultad ENUM('facil', 'media', 'dificil') NOT NULL DEFAULT 'media',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_palabra UNIQUE (palabra),
  CONSTRAINT chk_palabra_longitud CHECK (CHAR_LENGTH(palabra) BETWEEN 3 AND 30)
) ENGINE=InnoDB;

CREATE INDEX idx_palabras_categoria ON palabras (categoria);
CREATE INDEX idx_palabras_dificultad ON palabras (dificultad);

-- Tabla de puntajes del ranking
CREATE TABLE IF NOT EXISTS score (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL,
  tiempo INT NOT NULL,
  puntos INT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_tiempo_positivo CHECK (tiempo >= 0),
  CONSTRAINT chk_puntos_positivo CHECK (puntos >= 0),
  CONSTRAINT chk_nombre_longitud CHECK (CHAR_LENGTH(nombre) BETWEEN 2 AND 40)
) ENGINE=InnoDB;

CREATE INDEX idx_score_puntos ON score (puntos DESC);
CREATE INDEX idx_score_tiempo ON score (tiempo ASC);
CREATE INDEX idx_score_fecha ON score (fecha DESC);

-- Códigos y sesiones temporales para el acceso al panel administrador
CREATE TABLE IF NOT EXISTS auth_codigos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  codigo_hash CHAR(64) NOT NULL,
  fecha_expiracion DATETIME NOT NULL,
  usado TINYINT(1) NOT NULL DEFAULT 0,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_auth_codigos_email (email),
  INDEX idx_auth_codigos_expiracion (fecha_expiracion)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auth_sesiones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token_hash CHAR(64) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL,
  fecha_expiracion DATETIME NOT NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_auth_sesiones_expiracion (fecha_expiracion)
) ENGINE=InnoDB;
