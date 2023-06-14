const {Airplane, Flight, Seat, Seat_type, Purchase, Passenger, Boarding_pass} = require('../database/db.js');

const {renameKeys} = require('../scripts/functions.js');
const getEmptySeats = require('./get-empty-seats.js');

const getAllAirplanes = async (req, res) => {

    try{
        /** Este arreglo será el retornado y en el se almacenará cada dato con sus keys en camelCase 
         * @type {Array}
         */
        let response = {passenger : []};
        let occupiedSeats = [];
        let passengerWithoutSeat = [];

        const dbResponse = await Flight.findByPk(1, {include: [
                                                            {
                                                                model: Boarding_pass,
                                                                as: 'boarding_passes',
                                                                include: [
                                                                  { model: Purchase, as: 'purchase' },
                                                                  { model: Passenger, as: 'passenger' },
                                                                  { model: Seat, as: 'seat' },
                                                                  { model: Seat_type, as: 'seat_type' }
                                                                ]
                                                            }
                                                        ]
                                                    });
    
            if (dbResponse) {
       
                for (const boardingPass of dbResponse['boarding_passes']){
                 
                  response['passenger'].push({
                    ...boardingPass.passenger.dataValues, 
                    boarding_pass_id: boardingPass['boarding_pass_id'],
                    purchase_id: boardingPass.purchase['purchase_id'],
                    seat_type_id: boardingPass['seat_type_id'],
                    seat_id: boardingPass['seat_id']

                  });

                  if (boardingPass['seat_id'] !== null){
                    occupiedSeats.push(boardingPass['seat_id']);
                  } else{
                    passengerWithoutSeat.push({
                                              ...boardingPass.passenger['dataValues'],  
                                              purchase_id: boardingPass.purchase['purchase_id']
                                            })
                  }
                }
                
                /**
                 * @type {Array} Almacenará todos los pasajeros sin asiento que sean menores de edad
                 */
                const underagePassengers = passengerWithoutSeat.filter((passenger) => passenger.age < 18);

                console.log(underagePassengers);
                
                response = {...dbResponse ,...response};
                
               
                /**
                 * Elimino del objeto a retornar, todas las keys innecesarias para la respuesta
                 */
                delete response.dataValues['boarding_passes'];
                delete response['boarding_passes'];
                delete response['_previousDataValues'];
                delete response['_changed'];
                delete response['uniqno'];
                delete response['_options'];
                delete response['isNewRecord'];

                /**
                 * Los datos del vuelo estan en la key dataValues, por lo tanto, 
                 * unifico la información de dataValues y passengers en un unico objeto
                 */
                response = {...response.dataValues, passengers : response.passenger}

                response = renameKeys(response);

                return res.status(200).json({
                  code: 200,
                  data: response
                });
              }

        return res.status(404).json({
            code: 404,
            data: {}
        });
       
    } catch (error){
        return res.status(400).json({error : error.message})
    }
   
}

module.exports = getAllAirplanes;