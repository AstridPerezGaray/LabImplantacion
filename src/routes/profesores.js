const express = require('express');
const router = express.Router();
const queries = require('../repositories/ProfesoresRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos los profesores
router.get('/',  isLoggedIn, async (request, response) => {
  console.log('Entro aqui');
    const profesores = await queries.obtenerTodosLosProfesores();

     response.render('profesores/listado', {profesores}); // Mostramos el listado de profesores
});

// Endpoint para mostrar el formulario de agregar un nuevo profesor
router.get('/agregar', isLoggedIn, async (request, response) => {
    // Renderizamos el formulario de agregar profesor
    response.render('profesores/agregar');
});


// Endpoint para agregar un nuevo profesor
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body;
    const nuevoProfesor = { nombre, apellido, fecha_nacimiento, profesion, genero, email };

    const resultado = await queries.insertarProfesor(nuevoProfesor);
    if (resultado) {
        request.flash('success', 'Profesor agregado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al agregar el profesor');
    }
    response.redirect('/profesores');
});


// Endpoint para mostrar el formulario de editar profesor
router.get('/editar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    const profesor = await queries.obtenerProfesorPorid(idprofesor);

    if (profesor) {
        response.render('profesores/editar', { idprofesor, profesor });
    } else {
        response.redirect('/profesores');
    }
});

// Endpoint para actualizar el profesor
router.post('/editar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body;
    const datosModificados = { nombre, apellido, fecha_nacimiento, profesion, genero, email };

    const resultado = await queries.actualizarProfesor(idprofesor, datosModificados);

    if (resultado) {
        request.flash('success', 'Registro actualizado con exito');
    } else {
        request.flash('error', 'Ocurrio un problema al actualizar el registro');
    }
    response.redirect('/profesores');
});


// Endpoint para mostrar el formulario de edición
router.get('/editar/:idprofesor',  isLoggedIn, async (request, response) => {
    
    
        const {idprofesor } = request.params;
        const profesor = await queries.obtenerProfesorPorid(idprofesor);

        if (profesor) {
          response.render('profesores/modificar', { idprofesor, profesor });
        }else{
          response.redirect('/profesores')
        }
        
  

});


// Endpoint que permite eliminar un profesor
router.get('/eliminar/:idprofesor',  isLoggedIn, async(request, response) => {
  // Desestructuramos el objeto que nos mandan en la peticion y extraemos el idprofesor
  const { idprofesor } = request.params;
  const resultado = await queries.eliminarProfesor(idprofesor);
  if (resultado>0) {
    request.flash('success', 'Registro eliminado con exito');
} else {
    request.flash('error', 'Ocurrio un problema al eliminar el registro');
}
  response.redirect('/profesores');
});


module.exports = router;