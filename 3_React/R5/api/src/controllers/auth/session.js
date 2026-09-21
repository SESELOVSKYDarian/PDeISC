// requireAuth ya cargó el usuario desde la BBDD
export function session(req, res) {
  res.json({ user: req.user });
}
