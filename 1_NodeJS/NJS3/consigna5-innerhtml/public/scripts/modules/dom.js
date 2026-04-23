// junto lo que uso para insertar y limpiar bloques
export function getInnerHtmlElements() {
  return {
    output: document.getElementById('output'),
    feedback: document.getElementById('feedback'),
    insertButtons: document.querySelectorAll('.insert-btn'),
    clearButton: document.getElementById('clear-btn')
  };
}
