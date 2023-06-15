const server = require('./src/api/app.js');
const { conn } = require('./src/api/database/db.js');

/**
 * Función que se encargará de iniciar el servidor en el puerto 3000
 */
function startServer() {

  server.listen('3000', () => {
      console.log('Escuchando en el puerto 3000');
    });
 
}

startServer();