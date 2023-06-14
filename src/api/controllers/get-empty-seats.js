const {Seat} = require('../database/db');
const { Op } = require('sequelize');

/**
 * Función que retorna los asientos de un avion que se encuentran vacios (sin pasajero asignado)
 * @param {Integer} airplaneId Id del avión donde se buscarán los asientos que estan vacios.
 * @param {Array} occupiedSeats Array que contendrá los ids de todos los asientos que estan ocupados
 * @returns {Array} Array de objeto con la data de los asientos vacios ordenados de forma ASC
 */
const getEmptySeats = async (airplaneId, occupiedSeats) =>{
    try{
        const emptySeats = await Seat.findAll({
            where:{
                seat_id: {[Op.notIn] : occupiedSeats},
                airplane_id: airplaneId
            },
            order: [
                ['seat_row', 'ASC'],
                ['seat_column', 'ASC']
            ],
            raw: true
        });

        return emptySeats;
    } catch (error){
        throw new Error(error.message);
    }
}

module.exports = getEmptySeats;