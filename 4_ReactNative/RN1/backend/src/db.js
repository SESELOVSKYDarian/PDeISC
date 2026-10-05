import mysql from "mysql2/promise";
import { config } from "./config.js";

// pool contra la base ya creada por database/init.js
export const pool = mysql.createPool({ ...config.db, connectionLimit: 10 });
