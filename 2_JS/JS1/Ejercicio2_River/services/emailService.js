import nodemailer from 'nodemailer';

export async function sendWelcomeSocioEmail(toEmail, documento) {
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
      from: '"Socios River Plate" <noreply@sociosriver.com>',
      to: toEmail,
      subject: 'Bienvenido a River Plate',
      text: `Felicidades, el documento ${documento} ha sido registrado como socio.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de bienvenida enviado:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
}

export async function sendInventoryEmail(toEmail, encargadoNombre, nombreProducto) {
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
      from: '\"Inventario River\" <noreply@inventarioriver.com>',
      to: toEmail,
      subject: 'Ítem de inventario registrado',
      text: `Hola ${encargadoNombre}, el producto ${nombreProducto} fue registrado correctamente.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de inventario enviado:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error al enviar correo de inventario:', error);
    throw error;
  }
}
