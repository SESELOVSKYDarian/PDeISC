// junto los elementos que uso varias veces
export function getDomElements() {
  return {
    stage: document.getElementById('stage'),
    feedback: document.getElementById('feedback'),
    addTitleButton: document.getElementById('add-title-btn'),
    changeTextButton: document.getElementById('change-text-btn'),
    changeColorButton: document.getElementById('change-color-btn'),
    addImageButton: document.getElementById('add-image-btn'),
    changeImageButton: document.getElementById('change-image-btn'),
    resizeImageButton: document.getElementById('resize-image-btn')
  };
}

// me traigo el titulo si ya existe
export function getDynamicTitle() {
  return document.getElementById('dynamic-title');
}

// me traigo la imagen si ya existe
export function getDynamicImage() {
  return document.getElementById('dynamic-image');
}
