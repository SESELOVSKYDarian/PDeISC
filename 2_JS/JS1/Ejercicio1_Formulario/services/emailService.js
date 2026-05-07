const nodemailer = require('nodemailer');

const emailService = {
    sendWelcomeEmail: async (toEmail, userName) => {
        try {
            // Utilizamos Ethereal Email para propósitos de prueba automáticos.
            // Esto crea una cuenta de prueba al vuelo y nos permite simular el envío.
            let testAccount = await nodemailer.createTestAccount();

            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });

            const mailOptions = {
                from: '"Sistema de Registro" <noreply@registrosistema.com>',
                to: toEmail,
                subject: "✅ Registro Exitoso - Bienvenido!",
                text: `Hola ${userName},\n\nTu registro se ha completado exitosamente con este correo electrónico.\n\nSaludos!`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #4CAF50;">¡Registro Exitoso!</h2>
                        <p>Hola <strong>${userName}</strong>,</p>
                        <p>Te informamos que tu registro se ha completado exitosamente utilizando este correo electrónico (${toEmail}).</p>
                        <p>¡Bienvenido a nuestra plataforma!</p>
                        <hr>
                        <p style="font-size: 12px; color: #999;">Este es un correo automático, por favor no responda.</p>
                    </div>
                `,
            };

            let info = await transporter.sendMail(mailOptions);

            console.log("------------------------------------------");
            console.log("📧 Correo de prueba enviado con éxito.");
            console.log("📨 URL para previsualizar el correo: %s", nodemailer.getTestMessageUrl(info));
            console.log("------------------------------------------");

            return info;
        } catch (error) {
            console.error("Error al enviar el correo: ", error);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    }
};

module.exports = emailService;
