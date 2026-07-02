import {
  listarAlumnos,
  crearAlumno,
  editarAlumno,
  eliminarAlumno,
  solicitarJsonAlumnos
} from "./modules/apiAlumnos.js";
import {
  validarFormulario,
  formularioEsValido,
  validarTextoPersona,
  validarEdad
} from "./modules/validaciones.js";
import {
  pintarCampo,
  renderizarAlumnos,
  limpiarFormulario,
  activarModoEdicion,
  activarModoCreacion,
  mostrarEstado,
  renderizarJson
} from "./modules/domAlumnos.js";
import { obtenerTemaGuardado } from "../context/themeContext.js";
import { aplicarTema, alternarTema } from "./modules/tema.js";
import { controlarBotonSubir, subirArriba } from "./modules/scroll.js";
import { abrirModal, cerrarModal } from "./modules/modales.js";
import { mostrarToast } from "./modules/toasts.js";

const formulario = document.querySelector("#form-alumno");
const contenedorAlumnos = document.querySelector("#contenedor-alumnos");
const mensajeListado = document.querySelector("#mensaje-listado");
const contadorAlumnos = document.querySelector("#contador-alumnos");
const contenedorToasts = document.querySelector("#contenedor-toasts");
const estadoFormulario = document.querySelector("#estado-formulario");
const tituloFormulario = document.querySelector("#titulo-modal-formulario");
const botonGuardar = document.querySelector("#btn-guardar");
const botonCancelar = document.querySelector("#btn-cancelar");
const botonCrear = document.querySelector("#btn-crear");
const botonRecargar = document.querySelector("#btn-recargar");
const botonTema = document.querySelector("#btn-tema");
const botonSubir = document.querySelector("#btn-subir");
const linkTema = document.querySelector("#tema-css");
const salidaJson = document.querySelector("#salida-json");
const mensajeJson = document.querySelector("#mensaje-json");
const botonRecargarJson = document.querySelector("#btn-recargar-json");

const modalFormulario = document.querySelector("#modal-formulario");
const botonCerrarFormulario = document.querySelector("#btn-cerrar-formulario");
const modalEliminar = document.querySelector("#modal-eliminar");
const mensajeEliminar = document.querySelector("#mensaje-eliminar");
const botonCancelarEliminar = document.querySelector("#btn-cancelar-eliminar");
const botonConfirmarEliminar = document.querySelector("#btn-confirmar-eliminar");

const campos = {
  id: document.querySelector("#alumno-id"),
  nombre: document.querySelector("#nombre"),
  apellido: document.querySelector("#apellido"),
  edad: document.querySelector("#edad")
};

const mensajes = {
  nombre: document.querySelector("#error-nombre"),
  apellido: document.querySelector("#error-apellido"),
  edad: document.querySelector("#error-edad")
};

let alumnoAEliminar = null;

async function cargarAlumnos() {
  if (!contenedorAlumnos) {
    return false;
  }

  try {
    mensajeListado.textContent = "Cargando alumnos...";

    const data = await listarAlumnos();

    if (!data.ok) {
      mensajeListado.textContent = data.mensaje || "No se pudieron cargar los alumnos";
      mostrarToast(contenedorToasts, mensajeListado.textContent, "error");
      return false;
    }

    contadorAlumnos.textContent = data.alumnos.length;
    renderizarAlumnos(
      data.alumnos,
      contenedorAlumnos,
      mensajeListado,
      prepararEdicion,
      prepararEliminacion
    );

    return true;
  } catch (error) {
    mensajeListado.textContent = "Error al conectar con la API";
    mostrarToast(contenedorToasts, mensajeListado.textContent, "error", "Sin conexión");
    return false;
  }
}

async function cargarJsonReal() {
  if (!salidaJson) {
    return;
  }

  try {
    mensajeJson.textContent = "Cargando JSON real desde la API...";
    const data = await solicitarJsonAlumnos();
    renderizarJson(salidaJson, data);
    mensajeJson.textContent = "JSON obtenido correctamente desde POST /api/alumnos/listar";
    mensajeJson.className = "text-success fw-semibold";
  } catch (error) {
    mensajeJson.textContent = error.message || "No se pudo obtener el JSON";
    mensajeJson.className = "text-danger fw-semibold";
  }
}

function validarCampoEnVivo(nombreCampo) {
  let error = "";

  if (nombreCampo === "nombre") {
    error = validarTextoPersona(campos.nombre.value, "El nombre");
  }

  if (nombreCampo === "apellido") {
    error = validarTextoPersona(campos.apellido.value, "El apellido");
  }

  if (nombreCampo === "edad") {
    error = validarEdad(campos.edad.value);
  }

  pintarCampo(campos[nombreCampo], error, mensajes[nombreCampo]);
}

async function manejarSubmit(evento) {
  evento.preventDefault();

  const errores = validarFormulario(campos);

  Object.entries(errores).forEach(([campo, error]) => {
    pintarCampo(campos[campo], error, mensajes[campo]);
  });

  if (!formularioEsValido(errores)) {
    mostrarEstado(estadoFormulario, "Corregí los campos marcados antes de guardar.", false);
    return;
  }

  const datos = {
    nombre: campos.nombre.value.trim(),
    apellido: campos.apellido.value.trim(),
    edad: Number(campos.edad.value)
  };

  try {
    const editando = campos.id.value !== "";
    const respuesta = editando
      ? await editarAlumno(campos.id.value, datos)
      : await crearAlumno(datos);

    if (!respuesta.ok) {
      mostrarEstado(estadoFormulario, respuesta.mensaje, false);
      mostrarToast(contenedorToasts, respuesta.mensaje, "error");
      return;
    }

    await cerrarModal(modalFormulario);
    limpiarFormulario(formulario, campos, mensajes);
    activarModoCreacion(campos, tituloFormulario, botonGuardar, botonCancelar);
    await cargarAlumnos();
    mostrarToast(
      contenedorToasts,
      respuesta.mensaje,
      "exito",
      editando ? "Alumno actualizado" : "Alumno creado"
    );
  } catch (error) {
    const mensaje = error.message || "No se pudo guardar el alumno";
    mostrarEstado(estadoFormulario, mensaje, false);
    mostrarToast(contenedorToasts, mensaje, "error");
  }
}

function prepararEdicion(alumno) {
  activarModoEdicion(alumno, campos, tituloFormulario, botonGuardar, botonCancelar);

  Object.keys(mensajes).forEach((campo) => {
    validarCampoEnVivo(campo);
  });

  mostrarEstado(estadoFormulario, "");
  abrirModal(modalFormulario, campos.nombre);
}

function prepararEliminacion(alumno) {
  alumnoAEliminar = alumno;
  mensajeEliminar.textContent =
    `¿Estás seguro de eliminar el registro de ${alumno.nombre} ${alumno.apellido}?`;
  abrirModal(modalEliminar, botonCancelarEliminar);
}

async function confirmarEliminacion() {
  if (!alumnoAEliminar) {
    return;
  }

  try {
    const respuesta = await eliminarAlumno(alumnoAEliminar.id);

    if (!respuesta.ok) {
      mensajeEliminar.textContent = respuesta.mensaje;
      mostrarToast(contenedorToasts, respuesta.mensaje, "error");
      return;
    }

    await cerrarModal(modalEliminar);
    alumnoAEliminar = null;
    await cargarAlumnos();
    mostrarToast(contenedorToasts, respuesta.mensaje, "exito", "Alumno eliminado");
  } catch (error) {
    mensajeEliminar.textContent = "No se pudo eliminar el alumno";
    mostrarToast(contenedorToasts, mensajeEliminar.textContent, "error");
  }
}

function prepararCreacion() {
  limpiarFormulario(formulario, campos, mensajes);
  activarModoCreacion(campos, tituloFormulario, botonGuardar, botonCancelar);
  mostrarEstado(estadoFormulario, "");
  abrirModal(modalFormulario, campos.nombre);
}

async function cancelarFormulario() {
  await cerrarModal(modalFormulario);
  limpiarFormulario(formulario, campos, mensajes);
  activarModoCreacion(campos, tituloFormulario, botonGuardar, botonCancelar);
  mostrarEstado(estadoFormulario, "");
}

async function cancelarEliminacion() {
  await cerrarModal(modalEliminar);
  alumnoAEliminar = null;
}

function inicializarTemaYScroll() {
  aplicarTema(obtenerTemaGuardado(), linkTema, botonTema);
  window.addEventListener("scroll", () => controlarBotonSubir(botonSubir));
  botonTema.addEventListener("click", () => {
    const nuevoTema = alternarTema(linkTema, botonTema);
    const nombreTema = nuevoTema === "dark" ? "oscuro" : "claro";

    mostrarToast(contenedorToasts, `Modo ${nombreTema} activado.`, "info", "Tema actualizado");
  });
  botonSubir.addEventListener("click", subirArriba);
}

function inicializarCRUD() {
  if (!formulario) {
    return;
  }

  campos.nombre.addEventListener("input", () => validarCampoEnVivo("nombre"));
  campos.apellido.addEventListener("input", () => validarCampoEnVivo("apellido"));
  campos.edad.addEventListener("input", () => validarCampoEnVivo("edad"));

  formulario.addEventListener("submit", manejarSubmit);
  botonCrear.addEventListener("click", prepararCreacion);
  botonCancelar.addEventListener("click", cancelarFormulario);
  botonCerrarFormulario.addEventListener("click", cancelarFormulario);
  botonRecargar.addEventListener("click", async () => {
    const listadoActualizado = await cargarAlumnos();

    if (listadoActualizado) {
      mostrarToast(contenedorToasts, "El listado está actualizado.", "info");
    }
  });
  botonCancelarEliminar.addEventListener("click", cancelarEliminacion);
  botonConfirmarEliminar.addEventListener("click", confirmarEliminacion);

  modalFormulario.addEventListener("click", (evento) => {
    if (evento.target === modalFormulario) {
      cancelarFormulario();
    }
  });

  modalEliminar.addEventListener("click", (evento) => {
    if (evento.target === modalEliminar) {
      cancelarEliminacion();
    }
  });

  modalFormulario.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    cancelarFormulario();
  });

  modalEliminar.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    cancelarEliminacion();
  });

  activarModoCreacion(campos, tituloFormulario, botonGuardar, botonCancelar);
  cargarAlumnos();
}

function inicializarJson() {
  if (!salidaJson) {
    return;
  }

  renderizarJson(salidaJson, { ok: true, mensaje: "Cargando..." });
  cargarJsonReal();
  if (botonRecargarJson) {
    botonRecargarJson.addEventListener("click", cargarJsonReal);
  }
}

inicializarTemaYScroll();
inicializarCRUD();
inicializarJson();
lucide.createIcons();

