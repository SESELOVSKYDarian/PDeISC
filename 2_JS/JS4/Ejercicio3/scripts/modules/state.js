export const state = {
  fetchUsers: [],
  axiosUsers: []
};

export function saveUsers(key, users) {
  // guardo los usuarios una sola vez
  state[key] = users;
}

export function getSavedUsers(key) {
  return state[key];
}
