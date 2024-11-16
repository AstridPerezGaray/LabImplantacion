const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');

// Ruta para el formulario de inicio de sesión (signin)
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

// Ruta para procesar el inicio de sesión (signin)
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

// Ruta para el formulario de registro (signup)
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

// Ruta para procesar el registro (signup)
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Ruta para cerrar sesión
router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/signin');
    });
});

module.exports = router;
