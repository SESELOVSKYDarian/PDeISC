import { getTheme, applyTheme, toggleTheme } from "/Context/theme.js";

const state = { ejercicios: [] };
const cards = document.getElementById("cards");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const feedback = document.getElementById("feedback");
const toTopBtn = document.getElementById("toTop");

// Pide los datos al backend.
async function loadData() {
  const [eRes, sRes] = await Promise.all([
    fetch("/api/ejercicios"),
    fetch("/api/secreto")
  ]);
  const ejerciciosData = await eRes.json();
  const secretoData = await sRes.json();
  state.ejercicios = ejerciciosData.ejercicios.map((e) =>
    e.metodo === "secreto" ? { ...e, secretoApi: secretoData } : e
  );
}

// Crea el bloque de un caso con su resumen.
function renderCaso(caso) {
  return `
    <div class="border rounded p-2 mb-2">
      <p class="mb-1"><strong>1. Consigna:</strong> ${caso.consigna}</p>
      <p class="mb-1"><strong>2. Array inicial:</strong> <code>${JSON.stringify(caso.arrayInicial)}</code></p>
      <p class="mb-1"><strong>3. Operaci?n aplicada:</strong> <code>${caso.operacion}</code></p>
      <p class="mb-1"><strong>4. Resultado final:</strong> <code>${JSON.stringify(caso.resultadoFinal)}</code></p>
      <p class="mb-0"><strong>5. Explicacion corta:</strong> ${caso.explicacion}</p>
    </div>
  `;
}

// Dibuja tarjetas en el DOM.
function renderCards(items) {
  if (!items.length) {
    cards.innerHTML = "";
    feedback.textContent = "No hay resultados para ese filtro o busqueda.";
    return;
  }

  feedback.textContent = `Mostrando ${items.length} ejercicio(s).`;
  cards.innerHTML = items.map((e) => `
    <article class="col-12 col-lg-6">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h2 class="h5 mb-0">${e.id}. ${e.metodo}</h2>
            <span class="badge badge-soft">${e.categoria}</span>
          </div>
          ${e.casos.map(renderCaso).join("")}
          ${e.metodo === "secreto" ? `<pre class="p-2 border rounded"><strong>Entrada:</strong> ${e.secretoApi.entrada}
<strong>Salida:</strong> ${e.secretoApi.salida}</pre>` : ""}
        </div>
      </div>
    </article>
  `).join("");
}

// Aplica buscador y filtro por categoria.
function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;

  if (q === "") {
    feedback.textContent = "Buscador vacio: mostrando segun categoria.";
  }

  const filtered = state.ejercicios.filter((e) => {
    const byCategory = cat === "todos" || e.categoria === cat;
    const byText = q === "" ||
      e.metodo.toLowerCase().includes(q) ||
      e.casos.some((c) => c.consigna.toLowerCase().includes(q));
    return byCategory && byText;
  });

  renderCards(filtered);
}

// Inicializa eventos del frontend.
function setupEvents() {
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);

  document.getElementById("themeBtn").addEventListener("click", () => {
    const next = toggleTheme();
    feedback.textContent = `Tema actual: ${next}`;
  });

  window.addEventListener("scroll", () => {
    toTopBtn.style.display = window.scrollY > 250 ? "inline-block" : "none";
  });

  toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Arranque principal de la pagina.
async function init() {
  applyTheme(getTheme());
  await loadData();
  setupEvents();
  applyFilters();
}

init().catch(() => {
  feedback.textContent = "No se pudieron cargar los datos del servidor.";
});
