import { showPanel } from './panels.js';

// segun el data-event le engancho el evento que toca
export function bindNavigationEvents(buttons, panels, feedbackElement) {
  buttons.forEach((button) => {
    const target = button.dataset.target;
    const eventName = button.dataset.event;

    if (eventName === 'click') {
      button.addEventListener('click', () => showPanel(panels, feedbackElement, target, eventName));
    }

    if (eventName === 'dblclick') {
      button.addEventListener('dblclick', () => showPanel(panels, feedbackElement, target, eventName));
    }

    if (eventName === 'mouseenter') {
      button.addEventListener('mouseenter', () => showPanel(panels, feedbackElement, target, eventName));
    }

    if (eventName === 'contextmenu') {
      button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        showPanel(panels, feedbackElement, target, eventName);
      });
    }

    if (eventName === 'keydown') {
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') showPanel(panels, feedbackElement, target, eventName);
      });
    }
  });
}
