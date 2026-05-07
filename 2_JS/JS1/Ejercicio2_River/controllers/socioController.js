const emailService = require('../services/emailService');

// aca guardamos los socios en memoria pal server
const sociosDB = [];

const socioController = {
    registerSocio: async (req, res) => {
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

            // validamos todo bien aca en el backend
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

            // nos fijamos que el mail termine bien
            const validTlds = ['.com', '.ar', '.net', '.org', '.edu'];
            const hasValidTld = validTlds.some(tld => email.endsWith(tld));
            if (!email || !email.includes('@') || !hasValidTld) {
                return res.status(400).json({ error: `El correo debe terminar en: ${validTlds.join(', ')}.` });
            }

            // la clave tiene que ser fuerte como pide el ejercicio
            const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!\@#\$%\^&\*\(\)\-\+\?]).{12,}$/;
            if (!password || !pwdRegex.test(password)) {
                return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
            }

            // el tramite no se puede repetir, el dni si (segun pidio el usuario)
            const exists = sociosDB.some(s => s.tramite === tramite);
            if (exists) {
                return res.status(400).json({ error: 'Este número de trámite ya ha sido utilizado.' });
            }

            const newSocio = {
                id: Date.now(),
                tipo_documento,
                documento,
                tramite, // Guardar trámite para validación posterior
                nacionalidad,
                sexo,
                email,
                telefono,
                metodo_almacenaje
            };

            sociosDB.push(newSocio);

            // le avisamos por mail
            await emailService.sendWelcomeSocioEmail(email, documento);

            return res.status(201).json({
                message: '¡Registro de Socio de River exitoso!',
                socio: newSocio
            });

        } catch (error) {
            console.error('Error en el registro del socio:', error);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

module.exports = socioController;
