// funciones chiquitas para no repetir la forma de las respuestas en cada controller

export function respuestaOk(res, mensaje, datos = {}, status = 200) {
  return res.status(status).json({ ok: true, mensaje, datos });
}

export function respuestaError(res, mensaje, errores = [], status = 400) {
  return res.status(status).json({ ok: false, mensaje, errores });
}
