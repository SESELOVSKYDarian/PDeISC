import nodemailer from 'nodemailer';

// si el puerto no viene bien uso 587
function parsePort(value) {
  const port = Number(value);
  return Number.isInteger(port) ? port : 587;
}

// con esto chequeo si esta listo para mandar mails
export function smtpIsConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

// aca armo la conexion de nodemailer
function createTransport() {
  const port = parsePort(process.env.SMTP_PORT);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// si hay smtp configurado mando el mail desde aca
export async function sendRegistrationEmail(data) {
  if (!smtpIsConfigured()) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  const transport = createTransport();
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await transport.sendMail({
    from: fromAddress,
    replyTo: process.env.SMTP_USER,
    to: data.email,
    subject: 'Registro recibido correctamente',
    text: [
      `Hola ${data.nombre} ${data.apellido},`,
      '',
      'Tu registro fue recibido correctamente.',
      `Edad: ${data.edad}`,
      `Genero: ${data.genero}`,
      `Pais: ${data.pais}`,
      `Intereses: ${data.intereses.join(', ')}`
    ].join('\n')
  });

  return { message: `Correo enviado con id ${info.messageId}.` };
}
