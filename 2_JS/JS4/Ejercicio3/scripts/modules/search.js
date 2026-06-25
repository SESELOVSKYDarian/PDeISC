export function filterUsers(users, searchValue) {
  // filtro sobre el array guardado
  const normalizedValue = searchValue.trim().toLowerCase();
  return users.filter((user) => user.name.toLowerCase().includes(normalizedValue));
}
