import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeRegistration, validateRegistration } from './modules/validation.js';
import { sendRegistrationEmail, smtpIsConfigured } from './modules/mailer.js';

const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3006;

// server simple para levantar la consigna
server.use(express.json());
server.use('/public', express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// aca entra lo del formulario, se valida y si se puede se manda el mail
server.post('/registro', async (req, res) => {
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

server.listen(PORT, () => {
  console.log(`Consigna 6 lista en http://localhost:${PORT}`);
});
