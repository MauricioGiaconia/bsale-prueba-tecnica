const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const boarding_pass = (sequelize) => {
  // defino el modelo
  sequelize.define('boarding_pass', {
    boarding_pass_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    purchase_id: {
      type: DataTypes.INTEGER,
     
      references: {
        model: 'purchase',
        key: 'purchase_id'
    },
    field: 'purchase_id'
    },
    passenger_id: {
        type: DataTypes.INTEGER,
        
        references: {
            model: 'passenger',
            key: 'passenger_id'
        },
        field: 'passenger_id'
    },
    seat_type_id: {
        type: DataTypes.INTEGER,
       
        references: {
            model: 'seat_type',
            key: 'seat_type_id'
        },
        field: 'seat_type_id'
    },
    seat_id: {
        type: DataTypes.INTEGER,
     
        references: {
            model: 'seat',
            key: 'seat_id'
        },
        field: 'seat_id'
    },
    flight_id: {
        type: DataTypes.INTEGER,
        
        references: {
            model: 'flight',
            key: 'flight_id'
        },
        field: 'flight_id'
    }
}, {
  timestamps: false
})};

module.exports = boarding_pass;
