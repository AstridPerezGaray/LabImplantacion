const handlebars = require('handlebars');
const moment = require('moment');  // Necesitamos moment.js para manejar fechas

// Helper para formatear las fechas
handlebars.registerHelper('formatDateEdit', function(date) {
    // Verificamos si la fecha existe y la formateamos
    return moment(date).format('YYYY-MM-DD');  // Formato esperado en el campo 'date' de HTML
});

// Helper para comparar dos valores
handlebars.registerHelper('eq', function (a, b, options) {
    if (a === b) {
        return options.fn(this);  // Ejecuta el bloque 'if'
    } else {
        return options.inverse(this);  // Ejecuta el bloque 'else'
    }
});

module.exports = handlebars;
