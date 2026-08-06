// lógica de negocio del ranking de puntajes
import { ScoreModel } from '../models/score.model.js';
import { verificarTokenPartida } from '../utils/seguridad.js';

export function calcularResultadoPartida(partidaToken, letrasUtilizadas) {
  const partida = verificarTokenPartida(partidaToken);
  if (!partida || !Array.isArray(letrasUtilizadas)) {
    const error = new Error('La partida no es válida o ya venció.');
    error.status = 422;
    throw error;
  }

  const letras = [...new Set(letrasUtilizadas.map(letra => String(letra).toLowerCase()))];
  const letrasPalabra = partida.palabra.toLowerCase().split('');
  const letrasCorrectas = letras.filter(letra => letrasPalabra.includes(letra));
  const errores = letras.filter(letra => !letrasPalabra.includes(letra)).length;
  const gano = [...new Set(letrasPalabra)].every(letra => letras.includes(letra));
  if (!gano && errores < 6) {
    const error = new Error('La partida todavía no terminó.');
    error.status = 422;
    throw error;
  }

  const tiempo = Math.max(0, Math.floor((Date.now() - (partida.expiraEn - 2 * 60 * 60 * 1000)) / 1000));
  let puntos = Math.max(0, letrasCorrectas.length * 10 - errores * 5);
  if (gano) puntos += Math.max(0, 60 - tiempo);
  return { ...partida, tiempo, puntos, gano };
}

export const ScoreService = {
  async listar(filtros) {
    return ScoreModel.listar(filtros);
  },

  async crear({ nombre, partidaToken, letrasUtilizadas }) {
    const resultado = calcularResultadoPartida(partidaToken, letrasUtilizadas);
    const { tiempo, puntos } = resultado;
    const datos = { nombre: nombre.trim(), tiempo, puntos };
    if (await ScoreModel.existeScore(datos)) {
      const error = new Error('Ese score ya fue guardado.');
      error.status = 409;
      throw error;
    }
    const id = await ScoreModel.crear(datos);
    return { id, ...datos };
  },

  async actualizar(id, { nombre, tiempo, puntos }) {
    const datos = { nombre: nombre.trim(), tiempo, puntos };
    if (await ScoreModel.existeScore({ ...datos, excluirId: id })) {
      const error = new Error('Ese score ya existe en el ranking.');
      error.status = 409;
      throw error;
    }
    const actualizado = await ScoreModel.actualizar(id, { ...datos, tiempo: Number(tiempo), puntos: Number(puntos) });
    if (!actualizado) {
      const error = new Error('No se encontró el score a actualizar.');
      error.status = 404;
      throw error;
    }
    return true;
  },

  async eliminar(id) {
    const eliminado = await ScoreModel.eliminar(id);
    if (!eliminado) {
      const error = new Error('No se encontró el score a eliminar.');
      error.status = 404;
      throw error;
    }
    return true;
  }
};
