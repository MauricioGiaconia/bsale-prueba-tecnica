const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const purchase = (sequelize) => {
  // defino el modelo
  sequelize.define('purchase', {
    purchase_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    purchase_date: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
}, {
  timestamps: false
})};

module.exports = purchase;
