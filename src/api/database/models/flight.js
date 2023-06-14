const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const flight = (sequelize) => {
  // defino el modelo
  sequelize.define('flight', {
    flight_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    takeoff_date_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    takeoff_airport: {
        type: DataTypes.STRING,
        allowNull: false
    },
    landing_date_time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    landing_airport: {
        type: DataTypes.STRING,
        allowNull: false
    },
    airplane_id: {
        type: DataTypes.INTEGER,
        allowNull : false,
        references : {
            model :'airplane',
            key: 'airplane_id'
        },
        field: 'airplane_id'
    }
}, {
  timestamps: false
})};

module.exports = flight;
