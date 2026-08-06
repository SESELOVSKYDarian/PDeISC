// centraliza el envío del código y permite trabajar en desarrollo sin smtp configurado
import nodemailer from 'nodemailer';
import { ENV } from '../config/environment.js';

let transportador;

function obtenerTransportador() {
  if (transportador) return transportador;
  if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASSWORD) return null;
  transportador = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: { user: ENV.SMTP_USER, pass: ENV.SMTP_PASSWORD }
  });
  return transportador;
}

export const MailerService = {
  async enviarCodigo(email, codigo) {
    const transporte = obtenerTransportador();
    if (!transporte) {
      console.log(`[auth] código de verificación para ${email}: ${codigo}`);
      return;
    }
    try {
      await transporte.sendMail({
        from: ENV.SMTP_USER,
        to: email,
        subject: 'Código de acceso al panel de El Ahorcado',
        text: `Tu código de verificación es ${codigo}. Vence en ${ENV.AUTH_CODE_MINUTES} minutos.`
      });
    } catch (error) {
      console.error('[auth] no se pudo enviar el código por smtp:', error.message);
      if (process.env.NODE_ENV === 'production') throw error;
      console.log(`[auth] código de verificación para ${email}: ${codigo}`);
    }
  }
};
