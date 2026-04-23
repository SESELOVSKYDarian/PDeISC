/**
 * @module state
 * @description Estado mutable de la Consigna 1 (índice de imagen, color y tamaño).
 */

/**
 * Crea y retorna el estado inicial del proyecto DOM.
 * @returns {{ imageIndex: number, titleColorIndex: number, imageSize: number }}
 */
export function createDomState() {
  return {
    imageIndex: 0,
    titleColorIndex: 0,
    imageSize: 220
  };
}
