const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize('airline', 'bsale_test', 'bsale_test', {
    host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    dialect: 'mysql',
    /**Reconexión a la base de datos, tendrá un máximo de 5 intentos de reconexión con un delay de 1000 milisegunds (1 segundo) entre cada intento
    */
    retry: {
        max: 5, 
        delay: 1000, 
      },
    /** Sequelize por defecto tiene como compartamiento pluralizar los nombres de las tablas, con este define desativo ese comportamiento */
    define: {
        freezeTableName: true
    },
    /** Desactivo la creación de tablas por defecto */
    sync: false
  });

const basename = path.basename(__filename);

sequelize
  .authenticate()   
  .then(() => console.log("Connection has been established successfully!!!"))   
  .catch((error) => console.log(error.message));

  
/**
 * Buscará todos los modelos en la carpeta /models para poder exportarlos todos juntos y utilizarlos en otras secciones de la aplicacion
 */
const modelDefiners = [];
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

/** Inyecto la conexion (sequelize) a todos los modelos */
modelDefiners.forEach(model => model(sequelize));
/** Capitalizamos los nombres de los modelos ej: airplane => Airplane */
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

/**
  * En sequelize.models están todos los modelos importados como propiedades
  * Para relacionarlos hacemos un destructuring
 */
const {Airplane, Flight, Seat, Seat_type, Passenger, Purchase, Boarding_pass} = sequelize.models;

Flight.belongsTo(Airplane, {foreignKey: 'airplane_id'});
Flight.hasMany(Boarding_pass, { foreignKey: 'flight_id' });

Seat.belongsTo(Seat_type, {foreignKey: 'seat_type_id'} );
Seat.belongsTo(Airplane, {foreignKey: 'airplane_id'});

Boarding_pass.belongsTo(Purchase, {foreignKey: 'purchase_id'});
Boarding_pass.belongsTo(Passenger, {foreignKey: 'passenger_id'});
Boarding_pass.belongsTo(Seat, {foreignKey: 'seat_id'});
Boarding_pass.belongsTo(Seat_type, {foreignKey: 'seat_type_id'});
Boarding_pass.belongsTo(Flight, {foreignKey: 'flight_id'});


module.exports = {
    ...sequelize.models, /** Para importar los modelos: {Airplane} = require(./database/db.js) */
    conn: sequelize,     /** Para importar la conexión { conn } = require('./database/db.js'); */
};