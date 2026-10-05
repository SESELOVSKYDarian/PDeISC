// pedidos salientes hacia los proveedores
async function pedirJson(url, options) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const detalle = data.error_description || data.error?.message || data.error || res.status;
    throw new Error(`El proveedor respondió con error: ${detalle}`);
  }
  return data;
}

export const postForm = (url, campos, headers = {}) =>
  pedirJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", ...headers },
    body: new URLSearchParams(campos),
  });

export const getJson = (url, token, headers = {}) =>
  pedirJson(url, {
    headers: { Accept: "application/json", ...(token && { Authorization: `Bearer ${token}` }), ...headers },
  });
