import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { config } from "../src/config.js";
import { sembrar } from "./seed.js";

const schemaPath = fileURLToPath(new URL("./schema.sql", import.meta.url));

// crea la base, las tablas y el seed si faltan
export async function initDatabase() {
  const { database, ...conexion } = config.db;
  const conn = await mysql.createConnection({ ...conexion, multipleStatements: true });
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4`);
    await conn.query(`USE \`${database}\``);
    await conn.query(await readFile(schemaPath, "utf8"));
    await sembrar(conn);
  } finally {
    await conn.end();
  }
}

// permite correrlo suelto: npm run db:init
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase()
    .then(() => console.log("Base de datos lista"))
    .catch((error) => { console.error(error.message); process.exit(1); });
}
