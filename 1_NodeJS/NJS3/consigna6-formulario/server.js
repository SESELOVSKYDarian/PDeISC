/**
 * @file app.js
 * @description Servidor Express para la Consigna 6 — Formulario con validación y SMTP.
 * Expone POST /registro con validación backend y envío de email opcional vía Nodemailer.
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeRegistration, validateRegistration } from './modules/validation.js';
import { sendRegistrationEmail, smtpIsConfigured } from './modules/mailer.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

/**
 * POST /registro
 * Recibe los datos del formulario, los sanitiza, valida en backend
 * y envía el email de confirmación si SMTP está configurado.
 */
app.post('/registro', async (req, res) => {
  const data = sanitizeRegistration(req.body);
  const { isValid, errors } = validateRegistration(data);

  if (!isValid) {
    return res.status(422).json({
      ok: false,
      message: 'Error de validacion en el servidor.',
      errors
    });
  }

  let emailStatus = 'SMTP no configurado. Ajusta el .env para habilitar el envio.';

  if (smtpIsConfigured()) {
    try {
      const result = await sendRegistrationEmail(data);
      emailStatus = result.message;
    } catch (error) {
      emailStatus = `Error al enviar: ${error.message}`;
    }
  }

  return res.status(200).json({
    ok: true,
    message: 'Registro procesado correctamente.',
    emailStatus,
    data
  });
});

app.listen(PORT, () => {
  console.log(`Consigna 6 lista en http://localhost:${PORT}`);
});
