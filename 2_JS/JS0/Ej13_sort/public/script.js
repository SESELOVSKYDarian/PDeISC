// Script para el método sort
let miArray = ["Manzana", "Banana", "Naranja"];

document.addEventListener("DOMContentLoaded", () => {
    updateArrayDisplay();
    
    const form = document.getElementById("actionForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const inputElement = document.getElementById("inputValue");
        const valor = inputElement.value.trim();
        
        if (!valor) return; // Validación básica
        
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
    // Lógica principal dependiendo del método
    let resultadoOperacion = "";
    
    try {
        if ("sort" === "push") {
            const nuevaLongitud = miArray.push(valor);
            resultadoOperacion = `Se agregó "${valor}". Nueva longitud: ${nuevaLongitud}`;
        } else if ("sort" === "pop") {
            const eliminado = miArray.pop();
            resultadoOperacion = `Se eliminó: "${eliminado || 'nada, array vacío'}"`;
        } else if ("sort" === "unshift") {
            const nuevaLongitud = miArray.unshift(valor);
            resultadoOperacion = `Se agregó al inicio "${valor}". Nueva longitud: ${nuevaLongitud}`;
        } else if ("sort" === "shift") {
            const eliminado = miArray.shift();
            resultadoOperacion = `Se eliminó del inicio: "${eliminado || 'nada, array vacío'}"`;
        } else if ("sort" === "splice") {
            // Ejemplo: splice(1, 1, valor) - Reemplaza el de índice 1
            if (miArray.length > 0) {
                const eliminados = miArray.splice(0, 1, valor);
                resultadoOperacion = `Se reemplazó "${eliminados[0]}" por "${valor}" en la posición 0`;
            } else {
                miArray.splice(0, 0, valor);
                resultadoOperacion = `Se insertó "${valor}" porque el array estaba vacío.`;
            }
        } else if ("sort" === "slice") {
            const copia = miArray.slice(0, parseInt(valor) || 2);
            resultadoOperacion = `Copia generada: ${JSON.stringify(copia)}`;
        } else if ("sort" === "indexOf") {
            const indice = miArray.indexOf(valor);
            resultadoOperacion = indice !== -1 ? `El elemento "${valor}" está en el índice ${indice}` : `El elemento "${valor}" NO se encontró (-1)`;
        } else if ("sort" === "includes") {
            const existe = miArray.includes(valor);
            resultadoOperacion = existe ? `El array SÍ incluye "${valor}"` : `El array NO incluye "${valor}"`;
        } else if ("sort" === "forEach") {
            let temp = "";
            miArray.forEach((item, idx) => { temp += `<li>${idx}: ${item} procesado con "${valor}"</li>`; });
            resultadoOperacion = `<ul>${temp}</ul>`;
        } else if ("sort" === "map") {
            const mapeado = miArray.map(item => item + " - " + valor);
            resultadoOperacion = `Array mapeado: ${JSON.stringify(mapeado)}`;
        } else if ("sort" === "filter") {
            const filtrado = miArray.filter(item => item.includes(valor));
            resultadoOperacion = `Elementos que contienen "${valor}": ${JSON.stringify(filtrado)}`;
        } else if ("sort" === "reduce") {
            const reducido = miArray.reduce((acc, curr) => acc + " | " + curr, valor);
            resultadoOperacion = `Reducción: ${reducido}`;
        } else if ("sort" === "sort") {
            miArray.push(valor);
            miArray.sort();
            resultadoOperacion = `Se agregó "${valor}" y se ordenó el array alfabéticamente.`;
        } else if ("sort" === "reverse") {
            if(valor !== "no") miArray.push(valor);
            miArray.reverse();
            resultadoOperacion = `Se agregó "${valor}" y se invirtió el orden del array.`;
        }
        
        updateArrayDisplay();
        showResult(resultadoOperacion);
    } catch (error) {
        showResult("Error en la operación: " + error.message);
    }
}
