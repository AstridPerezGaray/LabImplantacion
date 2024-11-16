const express = require('express');
const router = express.Router();
const queries = require('../repositories/GrupoRepository');
const materiasQuery = require('../repositories/MateriasRepository');
const profesoresQuery = require('../repositories/ProfesoresRepository');
const estudiantesQuery = require('../repositories/EstudianteRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos los grupos
router.get('/', isLoggedIn, async (request, response) => {
  console.log('Entrando a consultar los grupos');
  const grupos = await queries.obtenerTodosLosGrupos();
  console.log('Consulta de grupos realizada con éxito');

  response.render('grupos/listado', { grupos }); // Mostrar listado de grupos
});

// Endpoint para mostrar el formulario de agregar un nuevo grupo
router.get('/agregar', isLoggedIn, async (request, response) => {
  const lstMaterias = await materiasQuery.obtenerTodasLasMaterias();
  const lstProfesores = await profesoresQuery.obtenerTodosLosProfesores();

  response.render('grupos/agregar', { lstMaterias, lstProfesores });
});

// Endpoint para agregar un grupo
router.post('/agregar', isLoggedIn, async (request, response) => {
  const { num_grupo, anio, ciclo, idmateria, idprofesor } = request.body;
  const nuevoGrupo = { num_grupo, anio, ciclo, idmateria, idprofesor };

  const resultado = await queries.insertarGrupo(nuevoGrupo);

  if (resultado) {
    request.flash('success', 'Grupo agregado con éxito');
  } else {
    request.flash('error', 'Ocurrió un problema al agregar el grupo');
  }

  response.redirect('/grupos');
});

// Endpoint para mostrar el formulario de edición de grupo
router.get('/editar/:idgrupo', isLoggedIn, async (request, response) => {
  const { idgrupo } = request.params;
  const grupo = await queries.obtenerGrupoPorid(idgrupo);

  if (grupo) {
    const lstMaterias = await materiasQuery.obtenerTodasLasMaterias();
    const lstProfesores = await profesoresQuery.obtenerTodosLosProfesores();
    response.render('grupos/editar', { lstMaterias, lstProfesores, idgrupo, grupo });
  } else {
    response.redirect('/grupos');
  }
});

// Endpoint para actualizar un grupo
router.post('/editar/:id', isLoggedIn, async (request, response) => {
  const { id } = request.params;
  const { num_grupo, anio, ciclo, idmateria, idprofesor } = request.body;
  const datosModificados = { num_grupo, anio, ciclo, idmateria, idprofesor };

  const resultado = await queries.actualizarGrupo(id, datosModificados);

  if (resultado) {
    request.flash('success', 'Grupo actualizado con éxito');
  } else {
    request.flash('error', 'Ocurrió un problema al actualizar el grupo');
  }

  response.redirect('/grupos');
});

// Endpoint para eliminar un grupo
router.get('/eliminar/:idgrupo', isLoggedIn, async (request, response) => {
  const { idgrupo } = request.params;
  const resultado = await queries.eliminarGrupo(idgrupo);

  if (resultado > 0) {
    request.flash('success', 'Grupo eliminado con éxito');
  } else {
    request.flash('error', 'Ocurrió un problema al eliminar el grupo');
  }

  response.redirect('/grupos');
});

// Endpoint para asignar estudiantes a un grupo
router.get('/asignargrupo/:idgrupo', isLoggedIn, async (request, response) => {
  const { idgrupo } = request.params;
  const lstEstudiantes = await estudiantesQuery.obtenerTodosLosEstudiantes();
  response.render('grupos/asignargrupo', { lstEstudiantes, idgrupo });
});

// Endpoint para realizar la asignación de estudiantes a un grupo
router.post('/asignargrupo', isLoggedIn, async (request, response) => {
  const data = request.body;
  const result = processDataFromForm(data);
  let resultado = null;

  // Verificar los datos que se están recibiendo del formulario
  console.log("Datos recibidos del formulario:", result);

  for (const tmp of result.grupo_estudiantes) {
    const { idgrupo, idestudiante } = tmp;

    // Verificar si el estudiante ya está asignado al grupo
    console.log(`Verificando asignación para: idGrupo = ${idgrupo}, idEstudiante = ${idestudiante}`);
    const yaAsignado = await queries.verificarEstudianteEnGrupo(idgrupo, idestudiante);
    console.log("Ya está asignado:", yaAsignado);

    if (yaAsignado) {
      // Si el estudiante ya está asignado, notificar y continuar con el siguiente estudiante
      console.log(`El estudiante con ID ${idestudiante} ya está asignado al grupo.`);
      request.flash('error', `El estudiante con ID ${idestudiante} ya está asignado al grupo.`);
      continue;  // Continuar con el siguiente estudiante
    } else {
      // Si no está asignado, proceder con la asignación
      console.log("Asignando al estudiante...");
      resultado = await queries.asignarGrupo({ idgrupo, idestudiante });

      // Si la asignación fue exitosa
      console.log("Asignación de grupo realizada con éxito.");
      request.flash('success', 'Asignación de grupo realizada con éxito.');
    }

    if (!resultado) {
      // Si ocurre un error al asignar el grupo
      console.log("Error al asignar el grupo.");
      request.flash('error', 'Ocurrió un problema al realizar la asignación.');
      return response.redirect('/grupos');
    }
  }
  response.redirect('/grupos');
});

// Función para procesar los datos del formulario
function processDataFromForm(data) {
  const result = { grupo_estudiantes: [] };
  for (const key in data) {
    if (key.startsWith('grupo_estudiantes[')) {
      const match = key.match(/\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const property = match[2];
        if (!result.grupo_estudiantes[index]) {
          result.grupo_estudiantes[index] = {};
        }
        result.grupo_estudiantes[index][property] = data[key];
      }
    } else {
      result[key] = data[key];
    }
  }
  return result;
}

module.exports = router;
