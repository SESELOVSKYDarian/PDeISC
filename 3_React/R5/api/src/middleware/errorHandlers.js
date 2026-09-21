export function notFound(_req, res) {
  res.status(404).json({ message: "Ruta inexistente." });
}

// JSON mal formado o demasiado grande: error del cliente, no del servidor
export function errorHandler(error, _req, res, _next) {
  if (error.type === "entity.parse.failed") return res.status(400).json({ message: "El JSON enviado no es válido." });
  if (error.type === "entity.too.large") return res.status(413).json({ message: "El pedido es demasiado grande." });

  console.error(error);
  res.status(500).json({ message: "Ocurrió un error inesperado." });
}
