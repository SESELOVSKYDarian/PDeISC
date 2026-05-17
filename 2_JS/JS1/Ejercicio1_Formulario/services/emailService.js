import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(toEmail, userName) {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const mailOptions = {
      from: '"Sistema de Registro" <noreply@registrosistema.com>',
      to: toEmail,
      subject: 'Registro Exitoso - Bienvenido',
      text: `Hola ${userName},\n\nTu registro se ha completado exitosamente con este correo electrónico.\n\nSaludos!`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de prueba enviado:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
}
