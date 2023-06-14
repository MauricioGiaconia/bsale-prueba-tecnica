const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const airplane = (sequelize) => {
  // defino el modelo
  sequelize.define('airplane', {
    airplane_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
}, {
  timestamps: false, /**Deshabilito los campos por defecto que define sequelize: createdAt y updatedAt */
})};

module.exports = airplane;
