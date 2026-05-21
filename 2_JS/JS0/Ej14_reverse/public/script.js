// Script para el mÃ©todo reverse
let miArray = ["Manzana", "Banana", "Naranja"];

document.addEventListener("DOMContentLoaded", () => {
    updateArrayDisplay();
    
    const form = document.getElementById("actionForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const inputElement = document.getElementById("inputValue");
        const valor = inputElement.value.trim();
        
        if (!valor) return; // ValidaciÃ³n bÃ¡sica
        
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
    // LÃ³gica principal dependiendo del mÃ©todo
    let resultadoOperación = "";
    
    try {
        if ("reverse" === "push") {
            const nuevaLongitud = miArray.push(valor);
            resultadoOperación = `Se agregÃ³ "${valor}". Nueva longitud: ${nuevaLongitud}`;
        } else if ("reverse" === "pop") {
            const eliminado = miArray.pop();
            resultadoOperación = `Se eliminÃ³: "${eliminado || 'nada, array vacÃ­o'}"`;
        } else if ("reverse" === "unshift") {
            const nuevaLongitud = miArray.unshift(valor);
            resultadoOperación = `Se agregÃ³ al inicio "${valor}". Nueva longitud: ${nuevaLongitud}`;
        } else if ("reverse" === "shift") {
            const eliminado = miArray.shift();
            resultadoOperación = `Se eliminÃ³ del inicio: "${eliminado || 'nada, array vacÃ­o'}"`;
        } else if ("reverse" === "splice") {
            // Ejemplo: splice(1, 1, valor) - Reemplaza el de Ã­ndice 1
            if (miArray.length > 0) {
                const eliminados = miArray.splice(0, 1, valor);
                resultadoOperación = `Se reemplazÃ³ "${eliminados[0]}" por "${valor}" en la posiciÃ³n 0`;
            } else {
                miArray.splice(0, 0, valor);
                resultadoOperación = `Se insertÃ³ "${valor}" porque el array estaba vacÃ­o.`;
            }
        } else if ("reverse" === "slice") {
            const copia = miArray.slice(0, parseInt(valor) || 2);
            resultadoOperación = `Copia generada: ${JSON.stringify(copia)}`;
        } else if ("reverse" === "indexOf") {
            const indice = miArray.indexOf(valor);
            resultadoOperación = indice !== -1 ? `El elemento "${valor}" estÃ¡ en el Ã­ndice ${indice}` : `El elemento "${valor}" NO se encontrÃ³ (-1)`;
        } else if ("reverse" === "includes") {
            const existe = miArray.includes(valor);
            resultadoOperación = existe ? `El array SÃ incluye "${valor}"` : `El array NO incluye "${valor}"`;
        } else if ("reverse" === "forEach") {
            let temp = "";
            miArray.forEach((item, idx) => { temp += `<li>${idx}: ${item} procesado con "${valor}"</li>`; });
            resultadoOperación = `<ul>${temp}</ul>`;
        } else if ("reverse" === "map") {
            const mapeado = miArray.map(item => item + " - " + valor);
            resultadoOperación = `Array mapeado: ${JSON.stringify(mapeado)}`;
        } else if ("reverse" === "filter") {
            const filtrado = miArray.filter(item => item.includes(valor));
            resultadoOperación = `Elementos que contienen "${valor}": ${JSON.stringify(filtrado)}`;
        } else if ("reverse" === "reduce") {
            const reducido = miArray.reduce((acc, curr) => acc + " | " + curr, valor);
            resultadoOperación = `ReducciÃ³n: ${reducido}`;
        } else if ("reverse" === "sort") {
            miArray.push(valor);
            miArray.sort();
            resultadoOperación = `Se agregÃ³ "${valor}" y se ordenÃ³ el array alfabÃ©ticamente.`;
        } else if ("reverse" === "reverse") {
            if(valor !== "no") miArray.push(valor);
            miArray.reverse();
            resultadoOperación = `Se agregÃ³ "${valor}" y se invirtiÃ³ el orden del array.`;
        }
        
        updateArrayDisplay();
        showResult(resultadoOperación);
    } catch (error) {
        showResult("Error en la operaciÃ³n: " + error.message);
    }
}
