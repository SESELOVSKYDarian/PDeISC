import { borrarArchivo, guardarArchivo, editarArchivo, leerArchivo, obtenerArchivos } from "./archivos.js";
import { $, mostrarMensaje, mostrarToast, renderArchivos, renderNumeros } from "./dom.js";
import { iniciarTema } from "./theme.js";
import { marcarInput, numeroRepetido, validarCantidad, validarNumero } from "./validaciones.js";

const numeros = [];
let archivoActual = "";
let ultimoArchivoGuardado = null;

const inputNumero = $("#numero");
const formNumero = $("#formNumero");
const listaNumeros = $("#listaNumeros");
const estadoNumero = $("#estadoNumero");
const estadoGeneral = $("#estadoGeneral");
const btnGuardar = $("#btnGuardar");
const btnLimpiar = $("#btnLimpiar");
const archivosContenedor = $("#archivos");
const editor = $("#editor");
const contenidoArchivo = $("#contenidoArchivo");
const nombreArchivo = $("#nombreArchivo");
const btnGuardarEdicion = $("#btnGuardarEdicion");
const btnCancelarEdicion = $("#btnCancelarEdicion");
const btnCerrarEditor = $("#btnCerrarEditor");
const confirmarCancelacion = $("#confirmarCancelacion");
const editorActions = $("#editorActions");
const btnConfirmarCancelar = $("#btnConfirmarCancelar");
const btnNoCancelar = $("#btnNoCancelar");
const btnVolverArriba = $("#backTopButton");
const modalEliminar = $("#modalEliminar");
const nombreArchivoEliminar = $("#nombreArchivoEliminar");
const btnConfirmarEliminar = $("#btnConfirmarEliminar");
const btnCancelarEliminar = $("#btnCancelarEliminar");
const btnCerrarModalEliminar = $("#btnCerrarModalEliminar");
const estadoEliminar = $("#estadoEliminar");
let contenidoOriginalArchivo = "";
let archivoAEliminar = "";

// refresca la pantalla segun los numeros cargados
function actualizarVistaNumeros() {
  renderNumeros(listaNumeros, numeros);
  $("#contador").textContent = `${numeros.length}/20 numeros cargados`;
  btnGuardar.disabled = numeros.length < 10 || numeros.length > 20;
  btnLimpiar.disabled = numeros.length === 0;
  mostrarMensaje(estadoGeneral, validarCantidad(numeros), numeros.length < 10 ? "warning" : "success");
}

// muestra el boton de volver arriba cuando la pagina baja
function actualizarVolverArriba() {
  btnVolverArriba.hidden = window.scrollY < 220;
}

// lleva la pantalla al inicio con desplazamiento suave
function volverArriba() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// carga los archivos existentes desde el backend
async function cargarArchivos() {
  const datos = await obtenerArchivos();
  renderArchivos(archivosContenedor, datos.archivos || [], abrirArchivo, eliminarArchivo, ultimoArchivoGuardado);
}

// elimina un archivo despues de confirmar
function eliminarArchivo(nombre) {
  archivoAEliminar = nombre;
  nombreArchivoEliminar.textContent = nombre;
  mostrarMensaje(estadoEliminar, "", "info");
  modalEliminar.hidden = false;
  document.body.classList.add("modal-open");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// confirma la eliminacion real del archivo
async function confirmarEliminacion() {
  const nombre = archivoAEliminar;
  if (!nombre) return;

  try {
    btnConfirmarEliminar.disabled = true;
    const datos = await borrarArchivo(nombre);
    if (!datos.ok) return mostrarMensaje(estadoEliminar, datos.error, "danger");

    if (ultimoArchivoGuardado === nombre) ultimoArchivoGuardado = null;
    mostrarToast("Archivo eliminado correctamente.");
    cerrarModalEliminar();
    await cargarArchivos();
  } catch {
    mostrarMensaje(estadoEliminar, "No se pudo eliminar el archivo. Revise el servidor.", "danger");
  } finally {
    btnConfirmarEliminar.disabled = false;
  }
}

// cierra el modal de eliminacion
function cerrarModalEliminar() {
  modalEliminar.hidden = true;
  document.body.classList.remove("modal-open");
  archivoAEliminar = "";
}

// abre un txt para verlo y editarlo
async function abrirArchivo(nombre) {
  const datos = await leerArchivo(nombre);
  if (!datos.ok) return mostrarMensaje(estadoGeneral, datos.error, "danger");

  archivoActual = nombre;
  nombreArchivo.textContent = `${datos.archivo.nombre} - creado el ${datos.archivo.fechaCreacion}`;
  contenidoArchivo.value = datos.archivo.contenido;
  contenidoOriginalArchivo = datos.archivo.contenido;
  btnGuardarEdicion.disabled = true;
  confirmarCancelacion.hidden = true;
  editorActions.hidden = false;
  editor.hidden = false;
  document.body.classList.add("modal-open");
  contenidoArchivo.focus();
}

// revisa si el editor tiene cambios reales para permitir guardar
function actualizarEstadoEditor() {
  const hayCambios = contenidoArchivo.value !== contenidoOriginalArchivo;
  btnGuardarEdicion.disabled = !archivoActual || !hayCambios;
  if (!hayCambios) {
    confirmarCancelacion.hidden = true;
    editorActions.hidden = false;
  }
}

// cierra el editor y descarta los datos temporales
function cerrarEditor() {
  editor.hidden = true;
  document.body.classList.remove("modal-open");
  archivoActual = "";
  contenidoOriginalArchivo = "";
  contenidoArchivo.value = "";
  btnGuardarEdicion.disabled = true;
  confirmarCancelacion.hidden = true;
  editorActions.hidden = false;
}

// muestra la decision de salida sin abrir otro modal
function mostrarConfirmacionSalida() {
  confirmarCancelacion.hidden = false;
  editorActions.hidden = true;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// pide confirmacion si el usuario intenta cancelar con cambios
function cancelarEdicion() {
  const hayCambios = contenidoArchivo.value !== contenidoOriginalArchivo;
  if (hayCambios) {
    mostrarConfirmacionSalida();
    return;
  }

  cerrarEditor();
  mostrarMensaje(estadoGeneral, "Edicion cancelada.", "info");
}

// avisa que la cruz no descarta cambios pendientes
function cerrarDesdeCruz() {
  const hayCambios = contenidoArchivo.value !== contenidoOriginalArchivo;
  if (hayCambios) {
    mostrarConfirmacionSalida();
    return;
  }

  cerrarEditor();
}

// confirma que se descartan cambios pendientes
function confirmarSalidaSinGuardar() {
  cerrarEditor();
  mostrarMensaje(estadoGeneral, "Edicion cancelada. Los cambios no se guardaron.", "info");
}

// agrega un numero validado al array real
function agregarNumero(evento) {
  evento.preventDefault();
  const valor = inputNumero.value.trim();

  if (!validarNumero(valor)) {
    marcarInput(inputNumero, false);
    return mostrarMensaje(estadoNumero, "Ingrese solo numeros. El campo no puede quedar vacio.", "danger");
  }

  if (numeros.length >= 20) {
    marcarInput(inputNumero, false);
    return mostrarMensaje(estadoNumero, "Ya cargo el maximo de 20 numeros.", "danger");
  }

  if (numeroRepetido(numeros, valor)) {
    marcarInput(inputNumero, false);
    return mostrarMensaje(estadoNumero, "Ese numero ya fue cargado. No se permiten repetidos.", "danger");
  }

  numeros.push(Number(valor));
  inputNumero.value = "";
  inputNumero.classList.remove("is-valid", "is-invalid");
  mostrarMensaje(estadoNumero, "", "info");
  mostrarToast("Numero agregado correctamente.");
  actualizarVistaNumeros();
}

// guarda el txt final si la cantidad es correcta
async function finalizarArchivo() {
  const datos = await guardarArchivo(numeros);
  if (!datos.ok) return mostrarMensaje(estadoGeneral, datos.error, "danger");

  ultimoArchivoGuardado = datos.archivo.nombre;
  numeros.length = 0;
  actualizarVistaNumeros();
  await cargarArchivos();
  mostrarMensaje(estadoGeneral, `Archivo ${datos.archivo.nombre} guardado en carpeta local y en el directorio del servidor.`, "success");
  mostrarToast("¡Archivo generado! Revisa la seccion Biblioteca para ver el archivo.", "info");
}

// limpia todo lo cargado en memoria
function limpiarTodo() {
  numeros.length = 0;
  inputNumero.value = "";
  inputNumero.classList.remove("is-valid", "is-invalid");
  mostrarMensaje(estadoNumero, "", "info");
  actualizarVistaNumeros();
}

// guarda los cambios escritos en el editor
async function guardarEdicion() {
  if (!archivoActual) {
    return mostrarMensaje(estadoGeneral, "Primero abra un archivo para editarlo.", "warning");
  }

  try {
    btnGuardarEdicion.disabled = true;
    const datos = await editarArchivo(archivoActual, contenidoArchivo.value);
    if (!datos.ok) return mostrarMensaje(estadoGeneral, datos.error, "danger");

    contenidoArchivo.value = datos.archivo.contenido;
    cerrarEditor();
    await cargarArchivos();
    mostrarMensaje(estadoGeneral, "Archivo editado correctamente.", "success");
    mostrarToast("Cambios guardados correctamente.");
  } catch {
    mostrarMensaje(estadoGeneral, "No se pudo guardar. Revise que el servidor este activo.", "danger");
  } finally {
    btnGuardarEdicion.disabled = false;
  }
}

// valida el input mientras el usuario escribe
inputNumero.addEventListener("input", () => {
  const esValido = validarNumero(inputNumero.value);
  const esRepetido = esValido && numeroRepetido(numeros, inputNumero.value.trim());
  marcarInput(inputNumero, esValido && !esRepetido);
  mostrarMensaje(
    estadoNumero,
    esRepetido ? "Ese numero ya esta cargado." : esValido ? "Numero valido." : "Solo se aceptan numeros.",
    esValido && !esRepetido ? "success" : "danger"
  );
});

formNumero.addEventListener("submit", agregarNumero);
btnGuardar.addEventListener("click", finalizarArchivo);
btnLimpiar.addEventListener("click", limpiarTodo);
btnGuardarEdicion.addEventListener("click", guardarEdicion);
btnCancelarEdicion.addEventListener("click", cancelarEdicion);
btnCerrarEditor.addEventListener("click", cerrarDesdeCruz);
btnConfirmarCancelar.addEventListener("click", confirmarSalidaSinGuardar);
btnNoCancelar.addEventListener("click", () => {
  confirmarCancelacion.hidden = true;
  editorActions.hidden = false;
  contenidoArchivo.focus();
});
contenidoArchivo.addEventListener("input", actualizarEstadoEditor);
btnVolverArriba.addEventListener("click", volverArriba);
btnConfirmarEliminar.addEventListener("click", confirmarEliminacion);
btnCancelarEliminar.addEventListener("click", cerrarModalEliminar);
btnCerrarModalEliminar.addEventListener("click", cerrarModalEliminar);
window.addEventListener("scroll", actualizarVolverArriba);
modalEliminar.addEventListener("click", (evento) => {
  if (evento.target === modalEliminar) cerrarModalEliminar();
});
editor.addEventListener("click", (evento) => {
  if (evento.target === editor) cerrarDesdeCruz();
});
window.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && !editor.hidden) cerrarDesdeCruz();
});
iniciarTema();
actualizarVistaNumeros();
actualizarVolverArriba();
cargarArchivos();
