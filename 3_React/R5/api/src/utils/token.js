import jwt from "jsonwebtoken";
import { config } from "../config.js";

// el token solo guarda el id: el rol se lee siempre de la BBDD
export const createToken = (user) => jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "8h" });

export const verifyToken = (token) => jwt.verify(token, config.jwtSecret);
