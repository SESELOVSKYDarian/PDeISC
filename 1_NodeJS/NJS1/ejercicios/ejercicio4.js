import { pathToFileURL } from "node:url";

import { sumar, restar, multiplicar, dividir } from "./calculos.js";

// Este arreglo se exporta para que otros archivos, como server.js,
// puedan reutilizar los resultados del ejercicio 4.
export const resultadosEjercicio4 = [
    { operacion: "Suma", expresion: "5 + 3", resultado: sumar(5, 3) },
    { operacion: "Resta", expresion: "8 - 6", resultado: restar(8, 6) },
    { operacion: "Multiplicacion", expresion: "3 x 11", resultado: multiplicar(3, 11) },
    { operacion: "Division", expresion: "30 / 5", resultado: dividir(30, 5) }
];

// Esto comprueba si este archivo fue ejecutado directamente con Node.
// `pathToFileURL` convierte la ruta del archivo actual a formato URL
// para poder compararla con `import.meta.url`.
const esModuloPrincipal =
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href;

// Si el archivo se ejecuta por separado, muestra los resultados en consola.
// Si solo se importa desde otro archivo, este bloque no se ejecuta.
if (esModuloPrincipal) {
    for (const resultado of resultadosEjercicio4) {
        console.log(resultado.resultado.toString());
    }
}
