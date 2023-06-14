const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const seatType = (sequelize) => {
  // defino el modelo
  sequelize.define('seat_type', {
    seat_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
}, {
  timestamps: false
})};

module.exports = seatType;
