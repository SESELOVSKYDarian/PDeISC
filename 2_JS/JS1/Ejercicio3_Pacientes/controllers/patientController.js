const emailService = require('../services/emailService');

// guardamos los pacientes aca en memoria para el backend
const memoryDB = {
    pacientes: []
};

const patientController = {
    registerPatient: async (req, res) => {
        try {
            const data = req.body;
            
            // validamos que los datos esten bien aca en el server
            if (!data.nombre || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(data.nombre) || data.nombre.trim().length < 3 || data.nombre.trim().length > 100) {
                return res.status(400).json({ error: 'Nombre inválido. Solo letras (mín. 3, máx. 100 caracteres).' });
            }
            if (!data.apellido || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(data.apellido) || data.apellido.trim().length < 2 || data.apellido.trim().length > 100) {
                return res.status(400).json({ error: 'Apellido inválido. Solo letras (mín. 2, máx. 100 caracteres).' });
            }
            if (!data.dni || !/^\d{7,8}$/.test(data.dni)) {
                return res.status(400).json({ error: 'DNI inválido.' });
            }
            if (!data.telefono || !/^\d{10,15}$/.test(data.telefono)) {
                return res.status(400).json({ error: 'Teléfono inválido.' });
            }
            if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                return res.status(400).json({ error: 'Email inválido.' });
            }

            // nos fijamos que no esten repetidos en el server
            const isTramiteDuplicated = memoryDB.pacientes.some(p => p.tramite === data.tramite);
            const isEmailDuplicated = memoryDB.pacientes.some(p => p.email === data.email);

            if (data.tramite && isTramiteDuplicated) {
                return res.status(409).json({ error: 'El número de trámite ya se encuentra registrado.' });
            }
            if (isEmailDuplicated) {
                return res.status(409).json({ error: 'El Email ya se encuentra registrado en el sistema.' });
            }

            // guardamos el paciente en nuestra "base de datos"
            const newPatient = {
                id: Date.now(),
                ...data
            };
            memoryDB.pacientes.push(newPatient);

            // le mandamos el mail de bienvenida
            await emailService.sendWelcomeEmail(data.email, data.nombre, data.apellido);

            return res.status(201).json({
                message: 'Paciente registrado correctamente.',
                paciente: newPatient
            });

        } catch (error) {
            console.error('Error en el registro del paciente:', error);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

module.exports = patientController;
