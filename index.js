const server = require('./src/api/app.js');
const { conn } = require('./src/api/database/db.js');

function startServer() {

  server.listen('3001', () => {
      console.log('Escuchando en el puerto 3001');
    });
 
}

startServer();