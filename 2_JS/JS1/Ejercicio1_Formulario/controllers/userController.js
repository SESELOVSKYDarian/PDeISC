const emailService = require('../services/emailService');

// funciones para validar que todo este bien antes de guardar
const isValidName = (str) => {
    // solo letras y espacios, nada de numeros por aca
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(str);
};

const userController = {
    registerUser: async (req, res) => {
        try {
            const { name, surname, email } = req.body;

            // validamos en el server por las dudas, igual que en el front
            if (!name || name.length < 3 || name.length > 100 || !isValidName(name)) {
                return res.status(400).json({ error: 'El nombre es inválido. Debe tener entre 3 y 100 caracteres y no contener números.' });
            }

            if (!surname || surname.length < 2 || surname.length > 100 || !isValidName(surname)) {
                return res.status(400).json({ error: 'El apellido es inválido. Debe tener entre 2 y 100 caracteres y no contener números.' });
            }

            const validTlds = ['.com', '.ar', '.net', '.org', '.edu'];
            const hasValidTld = validTlds.some(tld => email.endsWith(tld));
            if (!email || !email.includes('@') || !hasValidTld) {
                return res.status(400).json({ error: `El correo debe ser válido, contener "@" y terminar en uno de estos dominios: ${validTlds.join(', ')}.` });
            }

            // simulamos que guardamos el usuario en una base de datos
            const newUser = { id: Date.now(), name, surname, email };

            // mandamos el mail de bienvenida
            await emailService.sendWelcomeEmail(email, name);

            // si llegamos aca esta todo joya
            return res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: newUser
            });

        } catch (error) {
            console.error('Error en el registro:', error);
            return res.status(500).json({ error: 'Error interno del servidor al procesar el registro.' });
        }
    }
};

module.exports = userController;
