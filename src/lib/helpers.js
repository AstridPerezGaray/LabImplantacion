const bcrypt = require('bcryptjs');

const helpers = {};

// Función para cifrar contraseñas
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // El número 10 representa la complejidad del hash
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Función para comparar la contraseña ingresada con la almacenada
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (error) {
    console.log(error);
  }
};

module.exports = helpers;
