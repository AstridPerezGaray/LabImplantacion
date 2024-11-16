const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars'); // Motor de plantillas Handlebars
const path = require('path');
const flash = require('connect-flash'); // Manejo de mensajes en la sesión
const session = require('express-session'); // Manejo de sesiones
const MySQLStore = require('express-mysql-session')(session); // Almacenamiento de sesiones en MySQL
const passport = require('passport'); // Autenticación de usuarios

// Inicializaciones
const app = express();
require('dotenv').config();
const { database } = require('./config/keys');
require('./lib/passportConfig'); // Configuración de autenticación con Passport

// Ajustes del servidor
app.set('port', process.env.PORT || 4500); // Definir el puerto del servidor
app.set('views', path.join(__dirname, 'views')); // Ruta de las vistas
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main', // Layout principal
    layoutsDir: path.join(app.get('views'), 'layouts'), // Directorio de layouts
    partialsDir: path.join(app.get('views'), 'partials'), // Directorio de vistas parciales
    extname: '.hbs', // Extensión de los archivos Handlebars
    helpers: require('./lib/handlebars') // Funciones de ayuda
}));
app.set('view engine', '.hbs'); // Configuración del motor de plantillas

// Middlewares
app.use(session({
    secret: process.env.SESSION_KEY, // Clave secreta para la sesión
    resave: false, // No renovar la sesión
    saveUninitialized: false, // No volver a inicializar la sesión si no se modifica
    store: new MySQLStore(database) // Almacenamiento de la sesión en MySQL
}));
app.use(flash()); // Usar flash para mostrar mensajes
app.use(morgan('dev')); // Usar morgan para registrar las peticiones
app.use(express.urlencoded({ extended: false })); // Para procesar datos de formularios
app.use(passport.initialize()); // Inicializar passport
app.use(passport.session()); // Usar sesión para passport

// Variables globales
app.use((req, res, next) => {
    // Hacer global el uso de flash y el usuario
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.user = req.user; // Información del usuario autenticado
    next(); // Continuar con la ejecución del siguiente middleware
});

// Rutas
app.use(require('./routes')); // Cargar las rutas principales
app.use(require('./routes/authentication')); // Rutas de autenticación
app.use('/estudiantes', require('./routes/estudiantes')); // Ruta para estudiantes
app.use('/carreras', require('./routes/carreras')); // Ruta para carreras
app.use('/materias', require('./routes/materias')); // Ruta para materias
app.use('/profesores', require('./routes/profesores')); // Ruta para profesores
app.use('/grupos', require('./routes/grupos')); // Ruta para grupos

// Archivos públicos (archivos estáticos como CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor iniciado en el puerto:', app.get('port'));
});
