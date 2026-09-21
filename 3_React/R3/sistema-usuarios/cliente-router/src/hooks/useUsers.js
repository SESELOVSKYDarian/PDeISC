import { useEffect, useState } from "react";
import { getMessage } from "@/services/api";
import { createUserRequest, deleteUserRequest, listUsersRequest, updateUserRequest } from "@/services/usersService";

// lista de usuarios del panel admin + sus operaciones
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState(null);

  async function load(term = search) {
    try {
      setUsers(await listUsersRequest(term));
    } catch (error) {
      setNotice({ error: true, text: getMessage(error) });
    }
  }

  useEffect(() => {
    load("");
  }, []);

  // devuelve "" si salió bien, o el mensaje de error para mostrarlo en el modal
  async function saveUser(values, id) {
    try {
      if (id) await updateUserRequest({ ...values, id });
      else await createUserRequest(values);
      setNotice({ text: id ? "Usuario actualizado." : "Usuario creado correctamente." });
      await load();
      return "";
    } catch (error) {
      return getMessage(error);
    }
  }

  async function deleteUser(id) {
    try {
      await deleteUserRequest(id);
      setNotice({ text: "Usuario eliminado." });
      await load();
    } catch (error) {
      setNotice({ error: true, text: getMessage(error) });
    }
  }

  return { users, search, setSearch, load, notice, saveUser, deleteUser };
}
