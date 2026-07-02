import { Router } from "express";
import {
  listarAlumnos,
  crearNuevoAlumno,
  editarAlumnoExistente,
  borrarAlumno
} from "../controllers/alumnos.controller.js";

const router = Router();

router.post("/listar", listarAlumnos);
router.post("/crear", crearNuevoAlumno);
router.put("/:id", editarAlumnoExistente);
router.delete("/:id", borrarAlumno);

export default router;

