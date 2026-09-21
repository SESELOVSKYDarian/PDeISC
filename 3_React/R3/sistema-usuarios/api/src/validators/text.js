// helpers para revisar que un dato llegue como texto
export const isText = (value) => typeof value === "string";

export const cleanText = (value) => (isText(value) ? value.trim() : "");
