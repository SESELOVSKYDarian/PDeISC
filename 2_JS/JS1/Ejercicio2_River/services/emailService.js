const nodemailer = require('nodemailer');

const emailService = {
    sendWelcomeSocioEmail: async (toEmail, documento) => {
        try {
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
                from: '"Socios River Plate" <noreply@sociosriver.com>',
                to: toEmail,
                subject: "✅ Bienvenido a River Plate",
                text: `Felicidades, el documento ${documento} ha sido registrado como socio.\n\nSaludos!`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 2px solid #E3001B;">
                        <h2 style="color: #E3001B;">¡Bienvenido a River Plate!</h2>
                        <p>Te notificamos que el documento <strong>${documento}</strong> ha sido asociado correctamente.</p>
                        <hr>
                        <p style="font-size: 12px; color: #999;">El Más Grande Lejos</p>
                    </div>
                `,
            };

            let info = await transporter.sendMail(mailOptions);
            console.log("------------------------------------------");
            console.log("📧 Correo de bienvenida enviado.");
            console.log("📨 URL para previsualizar: %s", nodemailer.getTestMessageUrl(info));
            console.log("------------------------------------------");

            return info;
        } catch (error) {
            console.error("Error al enviar el correo: ", error);
            throw error;
        }
    }
};

module.exports = emailService;
