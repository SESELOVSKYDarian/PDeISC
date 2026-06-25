export function getViewElements(prefix) {
  return {
    button: document.querySelector(`#${prefix}-load`),
    input: document.querySelector(`#${prefix}-search`),
    status: document.querySelector(`#${prefix}-status`),
    results: document.querySelector(`#${prefix}-results`)
  };
}

export function showStatus(element, message, type) {
  element.className = `status-box status-box--${type}`;
  element.textContent = message;
}

function createUserCard(user) {
  const article = document.createElement("article");
  article.className = "user-card";
  article.innerHTML = `
    <h3>${user.name}</h3>
    <p>${user.email}</p>
  `;
  return article;
}

function createEmptyCard() {
  const article = document.createElement("article");
  article.className = "empty-card";
  article.innerHTML = `
    <h3>Sin coincidencias</h3>
    <p>No hay usuarios que coincidan con la búsqueda.</p>
  `;
  return article;
}

export function renderUsers(container, users) {
  // limpio antes de volver a dibujar
  container.innerHTML = "";

  if (users.length === 0) {
    container.appendChild(createEmptyCard());
    return;
  }

  // dibujo la lista filtrada
  users.forEach((user) => {
    container.appendChild(createUserCard(user));
  });
}
