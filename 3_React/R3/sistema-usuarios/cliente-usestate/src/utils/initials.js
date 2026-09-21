// "Ana Pérez" -> "AP"
export function initials(name = "") {
  const letters = name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]);
  return letters.join("").toUpperCase() || "?";
}
