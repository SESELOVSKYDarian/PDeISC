// junto los botones, paneles y el texto de estado
export function getNavigationElements() {
  return {
    buttons: document.querySelectorAll('.nav-btn'),
    panels: document.querySelectorAll('.panel'),
    feedback: document.getElementById('feedback')
  };
}
