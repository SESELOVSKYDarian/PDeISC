// pedidos salientes hacia Google, GitHub y Discord
async function requestJson(url, options) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
  const data = await response.json().catch(() => ({}));

  // GitHub avisa los errores con 200 y un campo "error"
  if (!response.ok || data.error) {
    const detail = data.error_description || data.error?.message || data.error || response.status;
    throw new Error(`El proveedor respondió con error: ${detail}`);
  }
  return data;
}

export const postForm = (url, fields, extraHeaders = {}) =>
  requestJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", ...extraHeaders },
    body: new URLSearchParams(fields),
  });

export const getJson = (url, token, extraHeaders = {}) => {
  const headers = { Accept: "application/json", "User-Agent": "usuarios-oauth", ...extraHeaders };
  if (token) headers.Authorization = `Bearer ${token}`;
  return requestJson(url, { headers });
};
