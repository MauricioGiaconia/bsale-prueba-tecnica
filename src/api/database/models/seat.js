const { DataTypes } = require('sequelize');
const airplane = require('./airplane');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const seat = (sequelize) => {
  // defino el modelo
  sequelize.define('seat', {
    seat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    seat_column: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seat_row: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    seat_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'seat_type',
            key: 'seat_type_id'
        },
        field: 'seat_type_id'
    },
    airplane_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model:'airplane',
            key: 'airplane_id'
        },
        field: 'airplane_id'
    }
}, {
  timestamps: false
})};

module.exports = seat;
