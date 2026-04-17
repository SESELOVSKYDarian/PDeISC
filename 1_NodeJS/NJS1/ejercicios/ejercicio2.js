export const resultadosEjercicio2 = [
    { operacion: "Suma", expresion: "4 + 5", resultado: 4 + 5 },
    { operacion: "Resta", expresion: "3 - 6", resultado: 3 - 6 },
    { operacion: "Multiplicacion", expresion: "2 x 7", resultado: 2 * 7 },
    { operacion: "Division", expresion: "20 / 4", resultado: 20 / 4 }
];

if (process.argv[1]?.endsWith("ejercicio2.js")) {
    for (const resultado of resultadosEjercicio2) {
        console.log(`${resultado.operacion}:`, resultado.resultado);
    }
}
