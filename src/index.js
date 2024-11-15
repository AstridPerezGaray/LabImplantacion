const express = require('express'); 
const morgan = require('morgan'); 
const exphbs = require('express-handlebars'); // Motor de plantillas Handlebars 
const path = require('path'); 

// Inicializaciones 
const app = express(); 

require('dotenv').config();  // Cargar variables de entorno

// Ajustes del servidor 
app.set('port', process.env.PORT || 4500); 
app.set('views', path.join(__dirname, 'views')); // Ruta donde se encuentran las vistas 

// Configuración de Handlebars como motor de plantillas
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',  // Layout principal
    layoutsDir: path.join(app.get('views'), 'layouts'), // Ruta para los layouts
    partialsDir: path.join(app.get('views'), 'partials'), // Ruta para los parciales
    extname: '.hbs',  // Extensión de los archivos de plantillas
    helpers: require('./lib/handlebars')  // Cargar los helpers personalizados
}));

app.set('view engine', '.hbs'); // Configura la extensión para usar Handlebars

// Middleware de morgan para registrar las peticiones HTTP
app.use(morgan('dev'));     

// Middleware para aceptar datos de formularios
app.use(express.urlencoded({ extended: false })); 

// Configuración de rutas
app.use(require('./routes'));  // Carga las rutas generales desde 'routes/index.js'
app.use('/estudiantes', require('./routes/estudiantes')); // Ruta para estudiantes
app.use('/carreras', require('./routes/carreras')); // Ruta para carreras
app.use('/profesores', require('./routes/profesores')); // Ruta para profesores
app.use('/materias', require('./routes/materias'));


// Archivos estáticos (como CSS, imágenes, JS) accesibles desde el navegador
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(app.get('port'), () => { 
    console.log('Servidor iniciado en el puerto: ', app.get('port')); 
});
