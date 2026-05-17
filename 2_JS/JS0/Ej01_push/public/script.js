// Script para el metodo push

// 1) Array vacio + 3 frutas con push()
const frutas = [];
frutas.push("Manzana");
frutas.push("Banana");
frutas.push("Naranja");

// 2) Agregar 3 amigos a un array existente
const amigos = ["Sofia"];
amigos.push("Lucas");
amigos.push("Martina");
amigos.push("Tomas");

// 3) Agregar un numero solo si es mayor al ultimo
const numeros = [5, 10, 15];
const nuevoNumero = 20;
if (nuevoNumero > numeros[numeros.length - 1]) {
    numeros.push(nuevoNumero);
}

let miArray = [...frutas];

document.addEventListener("DOMContentLoaded", () => {
    updateArrayDisplay();

    const form = document.getElementById("actionForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const inputElement = document.getElementById("inputValue");
        const valor = inputElement.value.trim();

        if (!valor) return; // Validacion basica

        ejecutarMetodo(valor);
        inputElement.value = ""; // Limpiar input
    });
});

function updateArrayDisplay() {
    document.getElementById("arrayState").innerText = JSON.stringify(miArray);
}

function showResult(message) {
    const resultBox = document.getElementById("resultBox");
    const resultText = document.getElementById("resultText");

    resultText.innerHTML = message;
    resultBox.classList.remove("d-none");
}

function ejecutarMetodo(valor) {
    // Logica principal dependiendo del metodo
    let resultadoOperacion = "";

    try {
        if ("push" === "push") {
            const nuevaLongitud = miArray.push(valor);
            resultadoOperacion = `Se agrego "${valor}". Nueva longitud: ${nuevaLongitud}`;
        } else if ("push" === "pop") {
            const eliminado = miArray.pop();
            resultadoOperacion = `Se elimino: "${eliminado || "nada, array vacio"}"`;
        } else if ("push" === "unshift") {
            const nuevaLongitud = miArray.unshift(valor);
            resultadoOperacion = `Se agrego al inicio "${valor}". Nueva longitud: ${nuevaLongitud}`;
        } else if ("push" === "shift") {
            const eliminado = miArray.shift();
            resultadoOperacion = `Se elimino del inicio: "${eliminado || "nada, array vacio"}"`;
        } else if ("push" === "splice") {
            // Ejemplo: splice(1, 1, valor) - Reemplaza el de indice 1
            if (miArray.length > 0) {
                const eliminados = miArray.splice(0, 1, valor);
                resultadoOperacion = `Se reemplazo "${eliminados[0]}" por "${valor}" en la posicion 0`;
            } else {
                miArray.splice(0, 0, valor);
                resultadoOperacion = `Se inserto "${valor}" porque el array estaba vacio.`;
            }
        } else if ("push" === "slice") {
            const copia = miArray.slice(0, parseInt(valor) || 2);
            resultadoOperacion = `Copia generada: ${JSON.stringify(copia)}`;
        } else if ("push" === "indexOf") {
            const indice = miArray.indexOf(valor);
            resultadoOperacion =
                indice !== -1
                    ? `El elemento "${valor}" esta en el indice ${indice}`
                    : `El elemento "${valor}" NO se encontro (-1)`;
        } else if ("push" === "includes") {
            const existe = miArray.includes(valor);
            resultadoOperacion = existe
                ? `El array SI incluye "${valor}"`
                : `El array NO incluye "${valor}"`;
        } else if ("push" === "forEach") {
            let temp = "";
            miArray.forEach((item, idx) => {
                temp += `<li>${idx}: ${item} procesado con "${valor}"</li>`;
            });
            resultadoOperacion = `<ul>${temp}</ul>`;
        } else if ("push" === "map") {
            const mapeado = miArray.map((item) => item + " - " + valor);
            resultadoOperacion = `Array mapeado: ${JSON.stringify(mapeado)}`;
        } else if ("push" === "filter") {
            const filtrado = miArray.filter((item) => item.includes(valor));
            resultadoOperacion = `Elementos que contienen "${valor}": ${JSON.stringify(filtrado)}`;
        } else if ("push" === "reduce") {
            const reducido = miArray.reduce((acc, curr) => acc + " | " + curr, valor);
            resultadoOperacion = `Reduccion: ${reducido}`;
        } else if ("push" === "sort") {
            miArray.push(valor);
            miArray.sort();
            resultadoOperacion = `Se agrego "${valor}" y se ordeno el array alfabeticamente.`;
        } else if ("push" === "reverse") {
            if (valor !== "no") miArray.push(valor);
            miArray.reverse();
            resultadoOperacion = `Se agrego "${valor}" y se invirtio el orden del array.`;
        }

        updateArrayDisplay();
        showResult(resultadoOperacion);
    } catch (error) {
        showResult("Error en la operacion: " + error.message);
    }
}
