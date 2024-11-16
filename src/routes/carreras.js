const express = require('express');
const router = express.Router();
const queries = require('../repositories/CarrerasRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todas las carreras 
router.get('/', isLoggedIn, async (request, response) => {
   const carreras = await queries.obtenerTodasLasCarreras();
   response.render('carreras/listado', { carreras: carreras }); // Mostramos el listado de carreras
});

// Endpoint que permite mostrar el formulario para agregar una nueva carrera
router.get('/agregar', isLoggedIn, async (request, response) => {
   response.render('carreras/agregar');
});

// Endpoint para agregar una carrera
router.post('/agregar', isLoggedIn, async (request, response) => {
  const { idcarrera, carrera } = request.body;
  const nuevaCarrera = { idcarrera, carrera };

  const resultado = await queries.insertarCarrera(nuevaCarrera);

  if (resultado) {
      request.flash('success', 'Registro insertado con éxito');
  } else {
      request.flash('error', 'Ocurrió un problema al guardar el registro');
  }

  response.redirect('/carreras');
});

// Endpoint para mostrar el formulario de modificación
router.get('/editar/:idcarrera', isLoggedIn, async (request, response) => {
   const { idcarrera } = request.params;
   const carrera = await queries.obtenerCarreraPorid(idcarrera);

   if (carrera) {
      response.render('carreras/editar', { idcarrera, carrera });
   } else {
      response.redirect('/carreras');
   }
});

// Endpoint que permite modificar una carrera
router.post('/editar/:id', isLoggedIn, async (request, response) => {
   const { id } = request.params;
   const { idcarrera, carrera } = request.body;
   const datosModificados = { idcarrera, carrera };

   const resultado = await queries.actualizarCarrera(id, datosModificados);

   if (resultado) {
      request.flash('success', 'Registro actualizado con éxito');
   } else {
      request.flash('error', 'Ocurrió un problema al actualizar el registro');
   }
   response.redirect('/carreras');
});

// Endpoint que permite eliminar una carrera
router.get('/eliminar/:idcarrera', isLoggedIn, async (request, response) => {
   const { idcarrera } = request.params;
   const resultado = await queries.eliminarCarrera(idcarrera);
   if (resultado > 0) {
      request.flash('success', 'Eliminación correcta');
   } else {
      request.flash('error', 'Error al eliminar');
   }
   response.redirect('/carreras');
});

module.exports = router;