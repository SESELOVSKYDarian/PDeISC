import { getUsersWithAxios, getUsersWithFetch, submitWithAxios, submitWithFetch } from "./services/api.js";

// dejo la configuracion de cada bloque en un solo lugar
export const formsConfig = [
  {
    form: document.querySelector("#fetch-form"),
    status: document.querySelector("#fetch-status"),
    prefix: "fetch",
    usersLoader: getUsersWithFetch,
    submitter: submitWithFetch
  },
  {
    form: document.querySelector("#axios-form"),
    status: document.querySelector("#axios-status"),
    prefix: "axios",
    usersLoader: getUsersWithAxios,
    submitter: submitWithAxios
  }
];
