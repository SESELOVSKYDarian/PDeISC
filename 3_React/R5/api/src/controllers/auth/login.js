import { findByEmail } from "../../services/users/findUser.js";
import { sendSession } from "../../utils/cookies.js";
import { checkPassword } from "../../utils/passwords.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { isText } from "../../validators/text.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!isText(email) || !isText(password)) {
      return res.status(400).json({ message: "Ingresá tu email y tu contraseña." });
    }

    const user = await findByEmail(normalizeEmail(email));
    const passwordOk = await checkPassword(password, user?.password_hash);
    if (!user || !passwordOk) return res.status(401).json({ message: "Email o contraseña incorrectos." });

    delete user.password_hash;
    sendSession(res, user);
  } catch (error) {
    next(error);
  }
}
