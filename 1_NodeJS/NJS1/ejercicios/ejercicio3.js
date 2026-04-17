function sumar(a, b) {
    return a + b;
}

function restar(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    return a / b;
}

export const resultadosEjercicio3 = [
    { operacion: "Suma", expresion: "sumar(4, 5)", resultado: sumar(4, 5) },
    { operacion: "Resta", expresion: "restar(3, 6)", resultado: restar(3, 6) },
    { operacion: "Multiplicacion", expresion: "multiplicar(2, 7)", resultado: multiplicar(2, 7) },
    { operacion: "Division", expresion: "dividir(20, 4)", resultado: dividir(20, 4) }
];

if (process.argv[1]?.endsWith("ejercicio3.js")) {
    for (const resultado of resultadosEjercicio3) {
        console.log(`${resultado.operacion}:`, resultado.resultado);
    }
}
