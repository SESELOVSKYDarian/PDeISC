/**
 * @module mailer
 * @description Módulo de envío de emails SMTP para la Consigna 6.
 * Usa Nodemailer con configuración por variables de entorno.
 * Si SMTP no está configurado, lanza un error en lugar de fallar silenciosamente.
 */

import nodemailer from 'nodemailer';

/**
 * Parsea el puerto SMTP de la variable de entorno.
 * @param {string|undefined} value
 * @returns {number}
 */
function parsePort(value) {
  const port = Number(value);
  return Number.isInteger(port) ? port : 587;
}

/**
 * Verifica si todas las variables de entorno de SMTP están presentes.
 * @returns {boolean}
 */
export function smtpIsConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

/**
 * Crea un transporter de Nodemailer con la configuración del entorno.
 * @returns {import('nodemailer').Transporter}
 */
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

/**
 * Envía el email de confirmación de registro al destinatario.
 * @param {{ nombre: string, apellido: string, email: string, edad: string, genero: string, pais: string, intereses: string[] }} data
 * @returns {Promise<{ message: string }>}
 * @throws {Error} Si SMTP no está configurado.
 */
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
