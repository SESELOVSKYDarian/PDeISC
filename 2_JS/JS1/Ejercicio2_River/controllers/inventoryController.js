const emailService = require('../services/emailService');

const isValidName = (str) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(str);
};

const inventoryController = {
    addItem: async (req, res) => {
        try {
            const { 
                encargado_nombre, 
                encargado_apellido, 
                email_contacto, 
                categoria, 
                nombre_producto, 
                precio, 
                stock, 
                metodo_almacenaje 
            } = req.body;

            // Validación estricta backend
            if (!encargado_nombre || encargado_nombre.length < 3 || encargado_nombre.length > 100 || !isValidName(encargado_nombre)) {
                return res.status(400).json({ error: 'El nombre del encargado es inválido (3-100 caracteres, sin números).' });
            }
            if (!encargado_apellido || encargado_apellido.length < 2 || encargado_apellido.length > 100 || !isValidName(encargado_apellido)) {
                return res.status(400).json({ error: 'El apellido del encargado es inválido (2-100 caracteres, sin números).' });
            }
            if (!email_contacto || !email_contacto.includes('@') || !email_contacto.endsWith('.com')) {
                return res.status(400).json({ error: 'El correo debe contener "@" y terminar en ".com".' });
            }
            if (!nombre_producto || nombre_producto.length < 2) {
                return res.status(400).json({ error: 'El nombre del producto es inválido.' });
            }
            if (precio === undefined || isNaN(precio) || precio < 0) {
                return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
            }
            if (stock === undefined || isNaN(stock) || stock < 0) {
                return res.status(400).json({ error: 'El stock debe ser un número positivo.' });
            }

            const newItem = {
                id: Date.now(),
                encargado_nombre,
                encargado_apellido,
                email_contacto,
                categoria,
                nombre_producto,
                precio: parseFloat(precio),
                stock: parseInt(stock, 10),
                metodo_almacenaje
            };

            // Notificación por correo
            await emailService.sendInventoryEmail(email_contacto, encargado_nombre, nombre_producto);

            return res.status(201).json({
                message: 'Ítem registrado exitosamente en el inventario.',
                item: newItem
            });

        } catch (error) {
            console.error('Error en el registro del inventario:', error);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

module.exports = inventoryController;
