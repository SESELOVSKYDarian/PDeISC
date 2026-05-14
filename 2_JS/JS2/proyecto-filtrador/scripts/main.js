import { borrarArchivo, editarArchivo, filtrarEnServidor, leerArchivo, obtenerArchivos, subirArchivo } from "./archivos.js";
import { $, actualizarSelectorArchivos, mostrarMensaje, mostrarToast, renderArchivos, renderNumeros, renderProceso, renderResultado } from "./dom.js";
import { describirProceso } from "./filtro.js";
import { iniciarTema } from "./theme.js";
import { marcarCampo, validarArchivoTxt } from "./validaciones.js";

let numeros = [];
let archivoActual = "";
let ultimoArchivoGuardado = null;

const inputArchivo = $("#archivo");
const btnSubir = $("#btnSubir");
const btnFiltrar = $("#btnFiltrar");
const btnLimpiar = $("#btnLimpiar");
const estado = $("#estado");
const listaNumeros = $("#listaNumeros");
const proceso = $("#proceso");
const resultado = $("#resultado");
const archivosContenedor = $("#archivos");
const editor = $("#editor");
const nombreArchivo = $("#nombreArchivo");
const contenidoArchivo = $("#contenidoArchivo");
const btnGuardarEdicion = $("#btnGuardarEdicion");
const btnCancelarEdicion = $("#btnCancelarEdicion");
const btnCerrarEditor = $("#btnCerrarEditor");
const confirmarCancelacion = $("#confirmarCancelacion");
const editorActions = $("#editorActions");
const btnConfirmarCancelar = $("#btnConfirmarCancelar");
const btnNoCancelar = $("#btnNoCancelar");
const btnVolverArriba = $("#backTopButton");
const uploadZone = $("#uploadZone");
const archivoSeleccionado = $("#archivoSeleccionado");
const modalEliminar = $("#modalEliminar");
const nombreArchivoEliminar = $("#nombreArchivoEliminar");
const btnConfirmarEliminar = $("#btnConfirmarEliminar");
const btnCancelarEliminar = $("#btnCancelarEliminar");
const btnCerrarModalEliminar = $("#btnCerrarModalEliminar");
const estadoEliminar = $("#estadoEliminar");
const selectorArchivos = $("#dropdownArchivos");
let contenidoOriginalArchivo = "";
let archivoAEliminar = "";

// actualiza botones y listas segun el estado actual
function actualizarVista() {
  renderNumeros(listaNumeros, numeros);
  renderProceso(proceso, describirProceso(numeros));
  btnFiltrar.disabled = numeros.length === 0;
  btnLimpiar.disabled = numeros.length === 0 && inputArchivo.files.length === 0;
  $("#contador").textContent = `${numeros.length} numeros cargados`;
}

// muestra el boton de volver arriba cuando la pagina baja
function actualizarVolverArriba() {
  btnVolverArriba.hidden = window.scrollY < 220;
}

// lleva la pantalla al inicio con desplazamiento suave
function volverArriba() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// carga la lista de archivos desde el servidor
async function cargarArchivos() {
  const datos = await obtenerArchivos();
  const lista = datos.archivos || [];
  renderArchivos(archivosContenedor, lista, abrirArchivo, eliminarArchivo, ultimoArchivoGuardado);
  actualizarSelectorArchivos(selectorArchivos, lista, usarArchivoExistente);
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

// abre un archivo para verlo y editarlo
async function abrirArchivo(nombre) {
  const datos = await leerArchivo(nombre);
  if (!datos.ok) return mostrarMensaje(estado, datos.error, "danger");

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
  mostrarMensaje(estado, "Edicion cancelada.", "info");
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
  mostrarMensaje(estado, "Edicion cancelada. Los cambios no se guardaron.", "info");
}

// actualiza el texto visible de la zona de subida
function mostrarArchivoSeleccionado(archivo) {
  archivoSeleccionado.textContent = archivo ? `Archivo seleccionado: ${archivo.name}` : "Solo se aceptan archivos .txt";
}

// sube el txt elegido y muestra sus numeros
async function subirTxt() {
  const archivo = inputArchivo.files[0];
  if (!validarArchivoTxt(archivo)) {
    marcarCampo(inputArchivo, false);
    return mostrarMensaje(estado, "Seleccione un archivo .txt valido.", "danger");
  }

  const datos = await subirArchivo(archivo);
  if (!datos.ok) return mostrarMensaje(estado, datos.error, "danger");

  numeros = datos.numeros;
  marcarCampo(inputArchivo, true);
  mostrarMensaje(estado, `Archivo ${datos.archivo.nombre} subido correctamente. Quedo guardado en el directorio del servidor.`, "success");
  $("#btnDropdownArchivos").textContent = "Selecciona un archivo...";
  actualizarVista();
  await cargarArchivos();
}

// carga el contenido de un archivo seleccionado de la biblioteca
async function usarArchivoExistente(nombre) {
  if (!nombre) return;

  const datos = await leerArchivo(nombre);
  if (!datos.ok) return mostrarMensaje(estado, datos.error, "danger");

  const numerosLeidos = (datos.archivo.contenido || "").split(/\r?\n/).filter((n) => n.trim() !== "");
  numeros = numerosLeidos.map(Number).filter((n) => !isNaN(n));

  inputArchivo.value = ""; // clear input
  mostrarArchivoSeleccionado(null);
  mostrarMensaje(estado, `Usando archivo: ${nombre}`, "success");
  actualizarVista();
}

// pide al backend el filtrado real y guarda resultado
async function filtrarNumeros() {
  const datos = await filtrarEnServidor(numeros);
  if (!datos.ok) return mostrarMensaje(estado, datos.error, "danger");

  renderResultado(resultado, datos.resultado);
  ultimoArchivoGuardado = datos.archivo.nombre;
  mostrarMensaje(estado, `Resultado guardado en ${datos.archivo.nombre}. Se genero una copia local y otra en el directorio del servidor.`, "success");
  mostrarToast("¡Filtrado completado! Revisa la seccion Biblioteca para ver el archivo.", "info");
  await cargarArchivos();
}

// limpia el archivo subido y el resultado mostrado
function limpiarTodo() {
  numeros = [];
  inputArchivo.value = "";
  inputArchivo.classList.remove("is-valid", "is-invalid");
  uploadZone.classList.remove("is-valid", "is-invalid", "is-dragging");
  mostrarArchivoSeleccionado(null);
  resultado.innerHTML = "";
  mostrarMensaje(estado, "", "info");
  actualizarVista();
}

// guarda los cambios del editor
async function guardarEdicion() {
  if (!archivoActual) {
    return mostrarMensaje(estado, "Primero abra un archivo para editarlo.", "warning");
  }

  try {
    btnGuardarEdicion.disabled = true;
    const datos = await editarArchivo(archivoActual, contenidoArchivo.value);
    if (!datos.ok) return mostrarMensaje(estado, datos.error, "danger");

    contenidoArchivo.value = datos.archivo.contenido;
    cerrarEditor();
    mostrarMensaje(estado, "Archivo editado correctamente.", "success");
    mostrarToast("Cambios guardados correctamente.");
    await cargarArchivos();
  } catch {
    mostrarMensaje(estado, "No se pudo guardar. Revise que el servidor este activo.", "danger");
  } finally {
    btnGuardarEdicion.disabled = false;
  }
}

// valida archivo apenas cambia el input
inputArchivo.addEventListener("change", () => {
  const archivo = inputArchivo.files[0];
  const esValido = validarArchivoTxt(archivo);
  marcarCampo(inputArchivo, esValido);
  uploadZone.classList.toggle("is-valid", esValido);
  uploadZone.classList.toggle("is-invalid", !esValido);
  mostrarArchivoSeleccionado(esValido ? archivo : null);
  btnLimpiar.disabled = inputArchivo.files.length === 0 && numeros.length === 0;
  mostrarMensaje(estado, esValido ? "Archivo TXT listo para subir." : "El archivo debe ser .txt.", esValido ? "success" : "danger");
});

// resalta la zona mientras se arrastra un archivo encima
uploadZone.addEventListener("dragover", (evento) => {
  evento.preventDefault();
  uploadZone.classList.add("is-dragging");
});

// quita el resaltado cuando el archivo sale de la zona
uploadZone.addEventListener("dragleave", () => {
  uploadZone.classList.remove("is-dragging");
});

// toma el archivo soltado y lo coloca en el input real
uploadZone.addEventListener("drop", (evento) => {
  evento.preventDefault();
  uploadZone.classList.remove("is-dragging");

  const archivo = evento.dataTransfer.files[0];
  const dataTransfer = new DataTransfer();
  if (archivo) dataTransfer.items.add(archivo);
  inputArchivo.files = dataTransfer.files;
  inputArchivo.dispatchEvent(new Event("change"));
});

btnSubir.addEventListener("click", subirTxt);
btnFiltrar.addEventListener("click", filtrarNumeros);
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
actualizarVista();
actualizarVolverArriba();
cargarArchivos();
