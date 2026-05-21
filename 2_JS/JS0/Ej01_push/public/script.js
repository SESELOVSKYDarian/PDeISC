// Script para el método push

// 1) Array vacío + 3 frutas con push()
const frutas = [];
frutas.push("Manzana");
frutas.push("Banana");
frutas.push("Naranja");

// 2) Agregar 3 amigos a un array existente
const amigos = ["Sofia"];
amigos.push("Lucas");
amigos.push("Martina");
amigos.push("Tomas");

// 3) Agregar un número solo si es mayor al ultimo
const números = [5, 10, 15];
const nuevoNumero = 20;
if (nuevoNumero > números[números.length - 1]) {
    números.push(nuevoNumero);
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

        ejecutarMétodo(valor);
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

function ejecutarMétodo(valor) {
    // Logica principal dependiendo del método
    let resultadoOperación = "";

    try {
        if ("push" === "push") {
            const nuevaLongitud = miArray.push(valor);
            resultadoOperación = `Se agrego "${valor}". Nueva longitud: ${nuevaLongitud}`;
        } else if ("push" === "pop") {
            const eliminado = miArray.pop();
            resultadoOperación = `Se elimino: "${eliminado || "nada, array vacío"}"`;
        } else if ("push" === "unshift") {
            const nuevaLongitud = miArray.unshift(valor);
            resultadoOperación = `Se agrego al inicio "${valor}". Nueva longitud: ${nuevaLongitud}`;
        } else if ("push" === "shift") {
            const eliminado = miArray.shift();
            resultadoOperación = `Se elimino del inicio: "${eliminado || "nada, array vacío"}"`;
        } else if ("push" === "splice") {
            // Ejemplo: splice(1, 1, valor) - Reemplaza el de indice 1
            if (miArray.length > 0) {
                const eliminados = miArray.splice(0, 1, valor);
                resultadoOperación = `Se reemplazo "${eliminados[0]}" por "${valor}" en la posicion 0`;
            } else {
                miArray.splice(0, 0, valor);
                resultadoOperación = `Se inserto "${valor}" porque el array estaba vacío.`;
            }
        } else if ("push" === "slice") {
            const copia = miArray.slice(0, parseInt(valor) || 2);
            resultadoOperación = `Copia generada: ${JSON.stringify(copia)}`;
        } else if ("push" === "indexOf") {
            const indice = miArray.indexOf(valor);
            resultadoOperación =
                indice !== -1
                    ? `El elemento "${valor}" esta en el indice ${indice}`
                    : `El elemento "${valor}" NO se encontro (-1)`;
        } else if ("push" === "includes") {
            const existe = miArray.includes(valor);
            resultadoOperación = existe
                ? `El array SI incluye "${valor}"`
                : `El array NO incluye "${valor}"`;
        } else if ("push" === "forEach") {
            let temp = "";
            miArray.forEach((item, idx) => {
                temp += `<li>${idx}: ${item} procesado con "${valor}"</li>`;
            });
            resultadoOperación = `<ul>${temp}</ul>`;
        } else if ("push" === "map") {
            const mapeado = miArray.map((item) => item + " - " + valor);
            resultadoOperación = `Array mapeado: ${JSON.stringify(mapeado)}`;
        } else if ("push" === "filter") {
            const filtrado = miArray.filter((item) => item.includes(valor));
            resultadoOperación = `Elementos que contienen "${valor}": ${JSON.stringify(filtrado)}`;
        } else if ("push" === "reduce") {
            const reducido = miArray.reduce((acc, curr) => acc + " | " + curr, valor);
            resultadoOperación = `Reduccion: ${reducido}`;
        } else if ("push" === "sort") {
            miArray.push(valor);
            miArray.sort();
            resultadoOperación = `Se agrego "${valor}" y se ordeno el array alfabeticamente.`;
        } else if ("push" === "reverse") {
            if (valor !== "no") miArray.push(valor);
            miArray.reverse();
            resultadoOperación = `Se agrego "${valor}" y se invirtio el orden del array.`;
        }

        updateArrayDisplay();
        showResult(resultadoOperación);
    } catch (error) {
        showResult("Error en la operación: " + error.message);
    }
}
