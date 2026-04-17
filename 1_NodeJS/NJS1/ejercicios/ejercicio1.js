export const mensajesEjercicio1 = [
    "Hola mundo desde Node.js",
    "Fin"
];

for (const mensaje of mensajesEjercicio1) {
    if (process.argv[1]?.endsWith("ejercicio1.js")) {
        console.log(mensaje);
    }
}
