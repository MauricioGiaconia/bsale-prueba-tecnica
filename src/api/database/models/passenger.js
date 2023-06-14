const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const passenger = (sequelize) => {
  // defino el modelo
  sequelize.define('passenger', {
    passenger_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    country: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
  timestamps: false
})};

module.exports = passenger;
