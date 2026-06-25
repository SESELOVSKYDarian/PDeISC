function createUserCard(user) {
  const article = document.createElement("article");
  article.className = "user-card";
  article.innerHTML = `
    <h3>${user.name}</h3>
    <p>${user.email}</p>
  `;
  return article;
}

export function renderUsers(container, users) {
  // limpio lo anterior
  container.innerHTML = "";

  // dibujo cada usuario
  users.forEach((user) => {
    container.appendChild(createUserCard(user));
  });
}
