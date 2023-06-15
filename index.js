const server = require('./src/api/app.js');
const { conn } = require('./src/api/database/db.js');
require('dotenv').config();

/**
 * Función que se encargará de iniciar el servidor en el puerto 3000
 */
function startServer() {
  const {PORT} = process.env;
  server.listen(PORT, () => {
      console.log(`Escuchando en el puerto ${PORT}`);
    });
 
}

startServer();