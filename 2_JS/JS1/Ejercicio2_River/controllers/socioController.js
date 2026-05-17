import { sendWelcomeSocioEmail } from '../services/emailService.js';

const sociosDB = [];

export async function registerSocio(req, res) {
  try {
    const {
      tipo_documento,
      documento,
      tramite,
      nacionalidad,
      sexo,
      email,
      telefono,
      password,
      metodo_almacenaje
    } = req.body;

    if (!documento || !/^\d+$/.test(documento)) {
      return res.status(400).json({ error: 'El documento debe contener solo números.' });
    }
    if (!tramite || !/^\d+$/.test(tramite)) {
      return res.status(400).json({ error: 'El número de trámite debe contener solo números.' });
    }
    if (!nacionalidad || nacionalidad.trim().length < 2) {
      return res.status(400).json({ error: 'Nacionalidad inválida.' });
    }
    if (!['Masculino', 'Femenino', 'No Binario'].includes(sexo)) {
      return res.status(400).json({ error: 'Sexo inválido.' });
    }
    if (!telefono || !/^\+?\d{8,20}$/.test(telefono)) {
      return res.status(400).json({ error: 'Teléfono inválido.' });
    }

    const validTlds = ['.com', '.ar', '.net', '.org', '.edu'];
    const hasValidTld = validTlds.some((tld) => email?.endsWith(tld));
    if (!email || !email.includes('@') || !hasValidTld) {
      return res.status(400).json({ error: `El correo debe terminar en: ${validTlds.join(', ')}.` });
    }

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!\@#\$%\^&\*\(\)\-\+\?]).{12,}$/;
    if (!password || !pwdRegex.test(password)) {
      return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
    }

    const exists = sociosDB.some((s) => s.tramite === tramite);
    if (exists) {
      return res.status(400).json({ error: 'Este número de trámite ya ha sido utilizado.' });
    }

    const newSocio = {
      id: Date.now(),
      tipo_documento,
      documento,
      tramite,
      nacionalidad,
      sexo,
      email,
      telefono,
      metodo_almacenaje
    };

    sociosDB.push(newSocio);
    await sendWelcomeSocioEmail(email, documento);

    return res.status(201).json({
      message: 'Registro de Socio de River exitoso',
      socio: newSocio
    });
  } catch (error) {
    console.error('Error en el registro del socio:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
