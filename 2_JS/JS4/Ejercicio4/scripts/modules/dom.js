export function getViewElements(prefix) {
  return {
    button: document.querySelector(`#${prefix}-button`),
    status: document.querySelector(`#${prefix}-status`),
    container: document.querySelector(`#${prefix}-students`)
  };
}

export function showStatus(element, message, type) {
  element.className = `status-box status-box--${type}`;
  element.textContent = message;
}

function clearContainer(container) {
  container.innerHTML = "";
}

function createStudentCard(student) {
  const article = document.createElement("article");
  article.className = "student-card";
  article.innerHTML = `
    <h3>${student.nombre}</h3>
    <p><strong>Curso:</strong> ${student.curso}</p>
    <p><strong>Email:</strong> ${student.email}</p>
  `;
  return article;
}

export function renderStudents(container, students) {
  // limpio la lista anterior
  clearContainer(container);

  // muestro todos los alumnos
  students.forEach((student) => {
    container.appendChild(createStudentCard(student));
  });
}
