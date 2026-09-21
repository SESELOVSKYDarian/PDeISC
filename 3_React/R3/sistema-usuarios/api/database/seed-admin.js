import "dotenv/config";
import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { config, requireConfig } from "../src/config.js";
import { pool } from "../src/services/db.js";
import { createUser } from "../src/services/users/createUser.js";
import { findByEmail } from "../src/services/users/findUser.js";
import { hashPassword } from "../src/utils/passwords.js";

requireConfig();
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error("Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env");

const server = await mysql.createConnection({ host: config.db.host, port: config.db.port, user: config.db.user, password: config.db.password });
await server.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await server.end();

const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
for (const statement of schema.split(";").map((item) => item.trim()).filter(Boolean)) await pool.query(statement);

const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
if (await findByEmail(email)) console.log("Base, tablas y administrador ya verificados.");
else { await createUser({ nombre: "Administrador", email, passwordHash: await hashPassword(process.env.ADMIN_PASSWORD), rol: "administrador" }); console.log("Base, tablas y administrador creados."); }
await pool.end();
