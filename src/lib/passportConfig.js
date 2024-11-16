const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../config/databaseController');
const helpers = require('./helpers');

// Estrategia para el login (iniciar sesión)
passport.use('local.signin', new LocalStrategy({
    usernameField: 'user_name', 
    passwordField: 'user_password', 
    passReqToCallback: true
}, async (req, user_name, user_password, done) => {
    try {
        const rows = await pool.query('SELECT * FROM user_login WHERE user_name = ?', [user_name]);

        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await helpers.matchPassword(user_password, user.user_password);
            
            if (validPassword) {
                return done(null, user, req.flash('success', 'Bienvenido ' + user.user_name));
            } else {
                return done(null, false, req.flash('error', 'Contraseña incorrecta'));
            }
        } else {
            return done(null, false, req.flash('error', 'El nombre de usuario no existe'));
        }
    } catch (error) {
        console.error('Error al verificar las credenciales del usuario:', error);
        return done(error);
    }
}));

// Estrategia para el registro (signup)
passport.use('local.signup', new LocalStrategy({
    usernameField: 'user_name', 
    passwordField: 'user_password', 
    passReqToCallback: true
}, async (req, user_name, user_password, done) => {
    const { user_email } = req.body;

    try {
        const newUser = {
            user_name,
            user_email,
            user_password
        };

        newUser.user_password = await helpers.encryptPassword(user_password);

        // Guardamos el nuevo usuario en la base de datos
        const result = await pool.query('INSERT INTO user_login SET ?', [newUser]);

        newUser.id = result.insertId; // Guardamos el ID del nuevo usuario

        return done(null, newUser); // Continuamos con la serialización del usuario

    } catch (error) {
        console.error('Error al crear un nuevo usuario:', error);
        return done(error);
    }
}));

// Serialización del usuario: guardamos el ID del usuario en la sesión
passport.serializeUser((usr, done) => {
    done(null, usr.id); // Guardamos solo el ID del usuario
});

// Deserialización del usuario: recuperamos al usuario completo de la base de datos
passport.deserializeUser(async (id, done) => {
    try {
        const filas = await pool.query('SELECT * FROM user_login WHERE id = ?', [id]);
        done(null, filas[0]); // Retornamos el usuario completo de la base de datos
    } catch (error) {
        console.error('Error al deserializar el usuario:', error);
        done(error);
    }
});
