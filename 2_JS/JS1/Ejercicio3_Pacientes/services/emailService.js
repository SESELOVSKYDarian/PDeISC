const nodemailer = require('nodemailer');

const emailService = {
    sendWelcomeEmail: async (toEmail, nombre, apellido) => {
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
                from: '"Clínica Médica" <noreply@clinicamedica.com>',
                to: toEmail,
                subject: "✅ Alta de Paciente Exitosa",
                text: `Estimado/a ${nombre} ${apellido}, ha sido registrado correctamente en nuestro sistema de pacientes.`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 2px solid #0ea5e9; border-radius: 8px;">
                        <h2 style="color: #0ea5e9;">¡Bienvenido a Clínica Médica!</h2>
                        <p>Estimado/a <strong>${nombre} ${apellido}</strong>,</p>
                        <p>Le notificamos que sus datos han sido ingresados exitosamente en nuestro sistema de historia clínica digital.</p>
                        <hr>
                        <p style="font-size: 12px; color: #999;">Administración - Clínica Médica</p>
                    </div>
                `,
            };

            let info = await transporter.sendMail(mailOptions);
            console.log("------------------------------------------");
            console.log("📧 Correo de paciente enviado.");
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
