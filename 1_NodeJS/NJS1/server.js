import { createServer } from "node:http";

import { resultadosEjercicio4 } from "./ejercicios/ejercicio4.js";

// Convierte el arreglo de resultados en tarjetas HTML.
function crearResultadosHTML(resultados) {
    return resultados
        .map(
            (resultado, indice) => `
                <article class="tarjeta">
                    <span class="chip">Operacion ${indice + 1}</span>
                    <h2>${resultado.operacion}</h2>
                    <p>${resultado.expresion}</p>
                    <div class="resultado-box">
                        <span>Resultado</span>
                        <strong>${resultado.resultado}</strong>
                    </div>
                </article>
            `
        )
        .join("");
}

// Genera toda la pagina HTML que el servidor devolvera al navegador.
function hacerHTML(resultados) {
    return `
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>NJS1 | Ejercicio 4</title>
                <style>
                    :root {
                        --fondo: #f6efe7;
                        --panel: rgba(255, 251, 246, 0.94);
                        --borde: rgba(114, 84, 58, 0.14);
                        --texto: #2c221a;
                        --texto-suave: #6b5947;
                        --acento: #b75f37;
                        --acento-oscuro: #7c3f25;
                        --sombra: 0 20px 45px rgba(73, 51, 34, 0.12);
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        min-height: 100vh;
                        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                        color: var(--texto);
                        background:
                            radial-gradient(circle at top left, rgba(183, 95, 55, 0.22), transparent 28%),
                            linear-gradient(135deg, #fbf5ed 0%, #f3e7d8 52%, #eadcc7 100%);
                    }

                    .contenedor {
                        width: min(1080px, calc(100% - 32px));
                        margin: 0 auto;
                        padding: 44px 0 60px;
                    }

                    .hero {
                        padding: 30px;
                        border-radius: 28px;
                        border: 1px solid var(--borde);
                        background: var(--panel);
                        box-shadow: var(--sombra);
                    }

                    .hero span {
                        display: inline-block;
                        padding: 8px 14px;
                        border-radius: 999px;
                        background: rgba(183, 95, 55, 0.12);
                        color: var(--acento-oscuro);
                        font-size: 0.82rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                    }

                    .hero h1 {
                        margin: 16px 0 10px;
                        font-size: clamp(2.2rem, 5vw, 4rem);
                        line-height: 0.98;
                    }

                    .hero p {
                        margin: 0;
                        max-width: 700px;
                        color: var(--texto-suave);
                        line-height: 1.7;
                    }

                    .grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                        gap: 22px;
                        margin-top: 28px;
                    }

                    .tarjeta {
                        padding: 24px;
                        border-radius: 24px;
                        border: 1px solid var(--borde);
                        background: rgba(255, 252, 248, 0.98);
                        box-shadow: var(--sombra);
                    }

                    .chip {
                        display: inline-block;
                        margin-bottom: 14px;
                        padding: 7px 12px;
                        border-radius: 999px;
                        background: #2c221a;
                        color: #fff8f0;
                        font-size: 0.76rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                    }

                    .tarjeta h2 {
                        margin: 0 0 10px;
                        font-size: 1.35rem;
                    }

                    .tarjeta p {
                        margin: 0 0 18px;
                        color: var(--texto-suave);
                    }

                    .resultado-box {
                        padding: 16px;
                        border-radius: 18px;
                        background: #fffdf9;
                        border: 1px solid rgba(114, 84, 58, 0.1);
                    }

                    .resultado-box span {
                        display: block;
                        margin-bottom: 6px;
                        color: var(--texto-suave);
                        font-size: 0.9rem;
                    }

                    .resultado-box strong {
                        font-size: 1.6rem;
                        color: var(--acento);
                    }

                    @media (max-width: 640px) {
                        .contenedor {
                            width: min(100% - 20px, 1080px);
                            padding: 20px 0 28px;
                        }

                        .hero,
                        .tarjeta {
                            padding: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <main class="contenedor">
                    <section class="hero">
                        <span>NJS1</span>
                        <h1>Resultados del ejercicio 4</h1>
                        <p>
                            Esta pagina muestra unicamente las operaciones del ejercicio 4,
                            tomando los resultados exportados desde su archivo.
                        </p>
                    </section>

                    <section class="grid">
                        ${crearResultadosHTML(resultados)}
                    </section>
                </main>
            </body>
        </html>
    `;
}

// Crea un servidor HTTP simple.
// Si la ruta es "/" devuelve la pagina principal.
// Si la ruta no existe, responde con 404.
const server = createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(hacerHTML(resultadosEjercicio4));
        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - Ruta no encontrada");
});

// Pone el servidor a escuchar en el puerto 3000 de la maquina local.
server.listen(3000, "127.0.0.1", () => {
    console.log("Servidor listo en http://127.0.0.1:3000");
});
