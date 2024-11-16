const express = require('express'); 
const morgan = require('morgan'); 
const exphbs = require('express-handlebars'); // Motor de plantillas Handlebars 
const path = require('path'); 
const flash = require('connect-flash'); // Nos permite manejar mensajes en la sesion los cuales se guardan en memoria // y se borran luego de ser mostrados  
const session = require('express-session'); // Permite manejar sesiones, por ejemplo, para almacenar datos en la 
// memoria del servidor, tambien se puede almacenar en la base de datos. 
const MySQLStore = require('express-mysql-session')(session); 

// Inicializaciones 
const app = express(); 

require('dotenv').config();  // Cargar variables de entorno

const { database } = require('./config/keys'); 

// Ajustes del servidor 
app.set('port', process.env.PORT || 4500); 
app.set('views', path.join(__dirname, 'views')); // Configuración de la ruta donde se encuentran las vistas 

// Configuración de Handlebars como motor de plantillas
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',  // Layout principal
    layoutsDir: path.join(app.get('views'), 'layouts'), // Ruta para los layouts
    partialsDir: path.join(app.get('views'), 'partials'), // Ruta para los parciales
    extname: '.hbs',  // Extensión de los archivos de plantillas
    helpers: require('./lib/handlebars')  // Cargar los helpers personalizados
}));

app.set('view engine', '.hbs'); // Configura la extensión para usar Handlebars

// ===== MIDDLEWARES === 
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(flash());
app.use(morgan('dev')); // Configurando el middleware morgan para visualizar qué está llegando al servidor 
app.use(express.urlencoded({extended: false })); // Sirve para poder aceptar datos desde formularios 

// ==== VARIABLES GLOBALES ===== 
app.use((request, response, next) => {
    app.locals.success = request.flash('success');
    app.locals.error = request.flash('error');
    next();
});

// Configuración de rutas 
app.use(require('./routes')); // Node automáticamente busca el index.js del módulo 
app.use('/estudiantes',require('./routes/estudiantes')); // Configuración de ruta para estudiantes 
app.use('/carreras', require('./routes/carreras')); // Configuración de ruta para carreras 
app.use('/materias', require('./routes/materias')); // Configuración de ruta para materias 
app.use('/profesores', require('./routes/profesores')); // Configuración de ruta para profesores 
app.use('/grupos', require('./routes/grupos')); // Configuración de ruta para grupos 

// Archivos públicos (aquí se coloca todo el código al cual el navegador puede acceder) 
app.use(express.static(path.join(__dirname, 'public'))); 

// Iniciar el servidor  
app.listen(app.get('port'), () => { 
    console.log('Servidor iniciado en el puerto: ', app.get('port')); 
});
