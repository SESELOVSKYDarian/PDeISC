import { createServer } from "node:http";

import { mensajesEjercicio1 } from "./ejercicios/ejercicio1.js";
import { resultadosEjercicio2 } from "./ejercicios/ejercicio2.js";
import { resultadosEjercicio3 } from "./ejercicios/ejercicio3.js";
import { resultadosEjercicio4 } from "./ejercicios/ejercicio4.js";

const resultadosEjercicio5 = [
    ...resultadosEjercicio2.map((item) => ({ ...item, origen: "Ejercicio 2" })),
    ...resultadosEjercicio3.map((item) => ({ ...item, origen: "Ejercicio 3" })),
    ...resultadosEjercicio4.map((item) => ({ ...item, origen: "Ejercicio 4" }))
];

const ejercicios = [
    {
        ruta: "/ejercicio1",
        titulo: "Ejercicio 1",
        descripcion: "Muestra dos mensajes basicos servidos desde Node.js.",
        contenido: renderEjercicio1(),
        consolaWeb: renderConsolaWebMensajes("Ejercicio 1", mensajesEjercicio1)
    },
    {
        ruta: "/ejercicio2",
        titulo: "Ejercicio 2",
        descripcion: "Operaciones matematicas resueltas directamente.",
        contenido: renderTarjetas(resultadosEjercicio2),
        consolaWeb: renderConsolaWebResultados("Ejercicio 2", resultadosEjercicio2)
    },
    {
        ruta: "/ejercicio3",
        titulo: "Ejercicio 3",
        descripcion: "Las mismas operaciones del ejercicio 2, pero hechas con funciones.",
        contenido: renderTarjetas(resultadosEjercicio3),
        consolaWeb: renderConsolaWebResultados("Ejercicio 3", resultadosEjercicio3)
    },
    {
        ruta: "/ejercicio4",
        titulo: "Ejercicio 4",
        descripcion: "Resultados obtenidos desde el modulo calculos.js.",
        contenido: renderTarjetas(resultadosEjercicio4),
        consolaWeb: renderConsolaWebResultados("Ejercicio 4", resultadosEjercicio4)
    },
    {
        ruta: "/ejercicio5",
        titulo: "Ejercicio 5",
        descripcion: "Los resultados anteriores mostrados en una tabla con estilo.",
        contenido: renderTabla(resultadosEjercicio5),
        consolaWeb: renderConsolaWebTabla("Ejercicio 5", resultadosEjercicio5)
    }
];

function renderEjercicio1() {
    return `
        <section class="mensajes">
            ${mensajesEjercicio1
                .map(
                    (mensaje, indice) => `
                        <article class="mensaje">
                            <span class="etiqueta">Linea ${indice + 1}</span>
                            <p>${mensaje}</p>
                        </article>
                    `
                )
                .join("")}
        </section>
    `;
}

function renderTarjetas(resultados) {
    return `
        <section class="grid">
            ${resultados
                .map(
                    (resultado, indice) => `
                        <article class="tarjeta">
                            <span class="etiqueta">Operacion ${indice + 1}</span>
                            <h2>${resultado.operacion}</h2>
                            <p>${resultado.expresion}</p>
                            <div class="resultado-box">
                                <span>Resultado</span>
                                <strong>${resultado.resultado}</strong>
                            </div>
                        </article>
                    `
                )
                .join("")}
        </section>
    `;
}

function renderTabla(resultados) {
    return `
        <section class="tabla-panel">
            <table>
                <thead>
                    <tr>
                        <th>Origen</th>
                        <th>Operacion</th>
                        <th>Expresion</th>
                        <th>Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    ${resultados
                        .map(
                            (resultado) => `
                                <tr>
                                    <td>${resultado.origen}</td>
                                    <td>${resultado.operacion}</td>
                                    <td>${resultado.expresion}</td>
                                    <td>${resultado.resultado}</td>
                                </tr>
                            `
                        )
                        .join("")}
                </tbody>
            </table>
        </section>
    `;
}

function renderConsolaWebMensajes(titulo, mensajes) {
    const mensajesJSON = JSON.stringify(mensajes);

    return `
        <script>
            const mensajes = ${mensajesJSON};
            console.log("${titulo}");
            mensajes.forEach((mensaje) => console.log(mensaje));
        </script>
    `;
}

function renderConsolaWebResultados(titulo, resultados) {
    const resultadosJSON = JSON.stringify(resultados);

    return `
        <script>
            const resultados = ${resultadosJSON};
            console.log("${titulo}");
            resultados.forEach((resultado) => {
                console.log(resultado.operacion + ":", resultado.resultado);
            });
        </script>
    `;
}

function renderConsolaWebTabla(titulo, resultados) {
    const resultadosJSON = JSON.stringify(resultados);

    return `
        <script>
            const resultados = ${resultadosJSON};
            console.log("${titulo}");
            console.table(resultados);
        </script>
    `;
}

function renderNavegacion() {
    return ejercicios
        .map(
            (ejercicio) => `
                <a class="nav-link" href="${ejercicio.ruta}">${ejercicio.titulo}</a>
            `
        )
        .join("");
}

function renderHome() {
    return `
        <section class="hero">
            <span class="marca">NJS1</span>
            <h1>Ejercicios servidos por un servidor Node.js</h1>
            <p>
                Cada consigna ahora se puede abrir desde el navegador mediante rutas HTTP.
                Los ejercicios 2, 3 y 4 muestran operaciones; el 5 las resume en una tabla con estilo.
            </p>
        </section>

        <section class="lista-ejercicios">
            ${ejercicios
                .map(
                    (ejercicio) => `
                        <article class="item-ejercicio">
                            <h2>${ejercicio.titulo}</h2>
                            <p>${ejercicio.descripcion}</p>
                            <a href="${ejercicio.ruta}">Abrir ${ejercicio.titulo.toLowerCase()}</a>
                        </article>
                    `
                )
                .join("")}
        </section>
    `;
}

function renderPagina(titulo, descripcion, contenido, consolaWeb = "") {
    return `<!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${titulo}</title>
                <style>
                    :root {
                        --fondo: #f6f1e8;
                        --panel: rgba(255, 252, 248, 0.88);
                        --panel-fuerte: #fffdfa;
                        --texto: #201a17;
                        --texto-suave: #6a5a50;
                        --acento: #bf5a31;
                        --acento-oscuro: #8e3f20;
                        --acento-suave: rgba(191, 90, 49, 0.12);
                        --borde: rgba(92, 70, 55, 0.12);
                        --sombra: 0 16px 36px rgba(58, 40, 28, 0.10);
                        --radio-grande: 28px;
                        --radio-mediano: 22px;
                        --radio-chico: 16px;
                        --ancho-maximo: 1100px;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    html {
                        scroll-behavior: smooth;
                    }

                    body {
                        margin: 0;
                        min-height: 100vh;
                        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                        color: var(--texto);
                        background:
                            radial-gradient(circle at top left, rgba(191, 90, 49, 0.18), transparent 24%),
                            radial-gradient(circle at bottom right, rgba(149, 114, 89, 0.12), transparent 26%),
                            linear-gradient(160deg, #fcf8f2 0%, #f1e7d8 52%, #eadcc8 100%);
                    }

                    .contenedor {
                        width: min(var(--ancho-maximo), calc(100% - 32px));
                        margin: 0 auto;
                        padding: 24px 0 56px;
                    }

                    .barra {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 14px;
                        margin-bottom: 20px;
                        padding: 14px;
                        position: sticky;
                        top: 12px;
                        z-index: 10;
                        border: 1px solid var(--borde);
                        border-radius: var(--radio-grande);
                        background: rgba(255, 252, 248, 0.72);
                        backdrop-filter: blur(14px);
                        box-shadow: 0 10px 28px rgba(58, 40, 28, 0.08);
                    }

                    .barra-marca {
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        color: var(--texto);
                        font-weight: 800;
                        letter-spacing: 0.04em;
                        text-transform: uppercase;
                    }

                    .barra-punto {
                        width: 10px;
                        height: 10px;
                        border-radius: 999px;
                        background: linear-gradient(135deg, #d67d56 0%, #bf5a31 100%);
                        box-shadow: 0 0 0 6px rgba(191, 90, 49, 0.12);
                    }

                    .burger {
                        display: none;
                        align-items: center;
                        justify-content: center;
                        width: 46px;
                        height: 46px;
                        padding: 0;
                        border: 1px solid var(--borde);
                        border-radius: 14px;
                        background: rgba(255, 255, 255, 0.72);
                        color: var(--texto);
                        cursor: pointer;
                    }

                    .burger-lineas {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                    }

                    .burger-lineas span {
                        display: block;
                        width: 18px;
                        height: 2px;
                        border-radius: 999px;
                        background: currentColor;
                        transition: transform 0.18s ease, opacity 0.18s ease;
                    }

                    .burger[aria-expanded="true"] .burger-lineas span:nth-child(1) {
                        transform: translateY(7px) rotate(45deg);
                    }

                    .burger[aria-expanded="true"] .burger-lineas span:nth-child(2) {
                        opacity: 0;
                    }

                    .burger[aria-expanded="true"] .burger-lineas span:nth-child(3) {
                        transform: translateY(-7px) rotate(-45deg);
                    }

                    .nav-menu {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        align-items: center;
                    }

                    .nav-link {
                        padding: 10px 15px;
                        border-radius: 999px;
                        border: 1px solid var(--borde);
                        background: rgba(255, 255, 255, 0.72);
                        color: var(--texto);
                        text-decoration: none;
                        font-weight: 600;
                        transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
                    }

                    .nav-link:hover {
                        transform: translateY(-1px);
                        background: var(--panel-fuerte);
                        border-color: rgba(191, 90, 49, 0.24);
                    }

                    .hero,
                    .encabezado,
                    .item-ejercicio,
                    .tarjeta,
                    .mensaje,
                    .tabla-panel {
                        border: 1px solid var(--borde);
                        border-radius: var(--radio-grande);
                        background: var(--panel);
                        box-shadow: var(--sombra);
                    }

                    .hero,
                    .encabezado {
                        padding: 36px;
                        margin-bottom: 22px;
                    }

                    .marca,
                    .etiqueta {
                        display: inline-block;
                        padding: 7px 12px;
                        border-radius: 999px;
                        background: var(--acento-suave);
                        color: var(--acento);
                        font-size: 0.8rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }

                    h1 {
                        margin: 16px 0 12px;
                        max-width: 12ch;
                        font-size: clamp(2.1rem, 5vw, 4rem);
                        line-height: 0.96;
                    }

                    h2 {
                        margin: 14px 0 10px;
                        font-size: clamp(1.2rem, 2.2vw, 1.5rem);
                    }

                    p {
                        margin: 0;
                        line-height: 1.68;
                        color: var(--texto-suave);
                    }

                    .lista-ejercicios,
                    .grid,
                    .mensajes {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
                        gap: 18px;
                    }

                    .item-ejercicio,
                    .tarjeta,
                    .mensaje {
                        padding: 24px;
                        min-height: 100%;
                    }

                    .item-ejercicio {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    .item-ejercicio,
                    .tarjeta,
                    .mensaje,
                    .tabla-panel,
                    .hero,
                    .encabezado {
                        backdrop-filter: blur(10px);
                    }

                    .item-ejercicio a {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin-top: 18px;
                        width: fit-content;
                        min-height: 42px;
                        padding: 0 16px;
                        border-radius: 999px;
                        background: var(--acento);
                        color: #fffaf6;
                        font-weight: 700;
                        text-decoration: none;
                        transition: background-color 0.18s ease, transform 0.18s ease;
                    }

                    .item-ejercicio a:hover {
                        transform: translateY(-1px);
                        background: var(--acento-oscuro);
                    }

                    .resultado-box {
                        margin-top: 18px;
                        padding: 16px;
                        border-radius: var(--radio-chico);
                        background: var(--panel-fuerte);
                        border: 1px solid var(--borde);
                    }

                    .resultado-box span {
                        display: block;
                        margin-bottom: 6px;
                        color: var(--texto-suave);
                    }

                    .resultado-box strong {
                        font-size: 1.6rem;
                        color: var(--acento);
                    }

                    .tabla-panel {
                        padding: 18px;
                        overflow-x: auto;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        min-width: 620px;
                        background: rgba(255, 255, 255, 0.45);
                        border-radius: var(--radio-mediano);
                        overflow: hidden;
                    }

                    th,
                    td {
                        padding: 14px 16px;
                        text-align: left;
                        border-bottom: 1px solid var(--borde);
                    }

                    th {
                        font-size: 0.84rem;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                        color: var(--texto-suave);
                    }

                    tbody tr:hover {
                        background: rgba(255, 255, 255, 0.55);
                    }

                    .mensaje p,
                    .tarjeta p {
                        overflow-wrap: anywhere;
                    }

                    a {
                        color: var(--acento);
                    }

                    @media (max-width: 900px) {
                        .hero,
                        .encabezado {
                            padding: 30px;
                        }

                        h1 {
                            max-width: 100%;
                        }
                    }

                    @media (max-width: 640px) {
                        .contenedor {
                            width: min(100% - 18px, var(--ancho-maximo));
                            padding: 14px 0 28px;
                        }

                        .barra {
                            position: static;
                            flex-wrap: wrap;
                            gap: 12px;
                            padding: 10px;
                            border-radius: 22px;
                        }

                        .burger {
                            display: inline-flex;
                        }

                        .nav-menu {
                            display: none;
                            width: 100%;
                            flex-direction: column;
                            align-items: stretch;
                            gap: 8px;
                            padding-top: 4px;
                        }

                        .nav-menu.is-open {
                            display: flex;
                        }

                        .hero,
                        .encabezado,
                        .item-ejercicio,
                        .tarjeta,
                        .mensaje,
                        .tabla-panel {
                            padding: 20px;
                        }

                        .nav-link {
                            text-align: center;
                            width: 100%;
                        }

                        h1 {
                            font-size: clamp(1.9rem, 9vw, 2.8rem);
                        }

                        .lista-ejercicios,
                        .grid,
                        .mensajes {
                            grid-template-columns: 1fr;
                        }

                        .item-ejercicio a {
                            width: 100%;
                        }
                    }

                    @media (max-width: 420px) {
                        .hero,
                        .encabezado {
                            padding: 18px;
                        }
                    }
                </style>
            </head>
            <body>
                <main class="contenedor">
                    <nav class="barra">
                        <div class="barra-marca">
                            <span class="barra-punto" aria-hidden="true"></span>
                            <span>NJS1</span>
                        </div>
                        <button class="burger" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Abrir navegacion">
                            <span class="burger-lineas" aria-hidden="true">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                        <div class="nav-menu" id="nav-menu">
                            <a class="nav-link" href="/">Inicio</a>
                            ${renderNavegacion()}
                        </div>
                    </nav>
                    ${descripcion
                        ? `
                            <section class="encabezado">
                                <span class="marca">Servidor HTTP</span>
                                <h1>${titulo}</h1>
                                <p>${descripcion}</p>
                            </section>
                        `
                        : ""
                    }
                    ${contenido}
                </main>
                ${consolaWeb}
                <script>
                    const burger = document.querySelector(".burger");
                    const navMenu = document.querySelector("#nav-menu");

                    if (burger && navMenu) {
                        burger.addEventListener("click", () => {
                            const abierto = burger.getAttribute("aria-expanded") === "true";
                            burger.setAttribute("aria-expanded", String(!abierto));
                            navMenu.classList.toggle("is-open", !abierto);
                        });

                        navMenu.querySelectorAll("a").forEach((link) => {
                            link.addEventListener("click", () => {
                                burger.setAttribute("aria-expanded", "false");
                                navMenu.classList.remove("is-open");
                            });
                        });
                    }
                </script>
            </body>
        </html>`;
}

function mostrarEjerciciosEnConsolaNode() {
    console.log("Ejercicio 1");
    for (const mensaje of mensajesEjercicio1) {
        console.log(mensaje);
    }

    mostrarResultadosEnConsolaNode("Ejercicio 2", resultadosEjercicio2);
    mostrarResultadosEnConsolaNode("Ejercicio 3", resultadosEjercicio3);
    mostrarResultadosEnConsolaNode("Ejercicio 4", resultadosEjercicio4);

    console.log("Ejercicio 5");
    console.table(resultadosEjercicio5);
}

function mostrarResultadosEnConsolaNode(titulo, resultados) {
    console.log(titulo);
    for (const resultado of resultados) {
        console.log(`${resultado.operacion}:`, resultado.resultado);
    }
}

const server = createServer((req, res) => {
    const ruta = req.url ?? "/";

    if (ruta === "/" || ruta === "/index.html") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(renderPagina("NJS1 | Ejercicios", "", renderHome()));
        return;
    }

    const ejercicio = ejercicios.find((item) => item.ruta === ruta);

    if (ejercicio) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(renderPagina(`NJS1 | ${ejercicio.titulo}`, ejercicio.descripcion, ejercicio.contenido, ejercicio.consolaWeb));
        return;
    }

    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
        renderPagina(
            "404",
            "La ruta solicitada no existe en este servidor.",
            '<section class="encabezado"><p>Volve al <a href="/">inicio</a> para abrir cualquiera de los ejercicios.</p></section>'
        )
    );
});

mostrarEjerciciosEnConsolaNode();

server.listen(3000, "127.0.0.1", () => {
    console.log("Servidor listo en http://127.0.0.1:3000");
});
