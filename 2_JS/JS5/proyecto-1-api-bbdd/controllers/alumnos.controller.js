import {
  obtenerAlumnos,
  obtenerAlumnoPorId,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno
} from "../models/alumnos.model.js";
import {
  validarAlumno,
  validarId
} from "../validators/alumnos.validator.js";

export async function listarAlumnos(req, res) {
  try {
    const alumnos = await obtenerAlumnos();

    return res.json({
      ok: true,
      alumnos
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "No se pudieron obtener los alumnos",
      detalle: error.message
    });
  }
}

export async function crearNuevoAlumno(req, res) {
  try {
    const errores = validarAlumno(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: errores[0],
        errores
      });
    }

    const nuevoId = await crearAlumno(req.body);

    return res.status(201).json({
      ok: true,
      mensaje: "Alumno creado correctamente",
      id: nuevoId
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "No se pudo crear el alumno",
      detalle: error.message
    });
  }
}

export async function editarAlumnoExistente(req, res) {
  try {
    const errorId = validarId(req.params.id);

    if (errorId) {
      return res.status(400).json({
        ok: false,
        mensaje: errorId
      });
    }

    const errores = validarAlumno(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: errores[0],
        errores
      });
    }

    const alumno = await obtenerAlumnoPorId(req.params.id);

    if (!alumno) {
      return res.status(404).json({
        ok: false,
        mensaje: "No existe un alumno con ese id"
      });
    }

    await actualizarAlumno(req.params.id, req.body);

    return res.json({
      ok: true,
      mensaje: "Alumno actualizado correctamente"
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "No se pudo editar el alumno",
      detalle: error.message
    });
  }
}

export async function borrarAlumno(req, res) {
  try {
    const errorId = validarId(req.params.id);

    if (errorId) {
      return res.status(400).json({
        ok: false,
        mensaje: errorId
      });
    }

    const alumno = await obtenerAlumnoPorId(req.params.id);

    if (!alumno) {
      return res.status(404).json({
        ok: false,
        mensaje: "No existe un alumno con ese id"
      });
    }

    await eliminarAlumno(req.params.id);

    return res.json({
      ok: true,
      mensaje: "Alumno eliminado correctamente"
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "No se pudo eliminar el alumno",
      detalle: error.message
    });
  }
}

