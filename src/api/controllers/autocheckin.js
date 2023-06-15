const {Airplane, Flight, Seat, Seat_type, Purchase, Passenger, Boarding_pass} = require('../database/db.js');

const {renameKeys} = require('../scripts/functions.js');
const {setSeatToPassenger} = require('./set-seat-to-passenger.js');
const getEmptySeats = require('./get-empty-seats.js');

const getAllAirplanes = async (req, res) => {

    try{

      const {id} = req.params;

        /** Este arreglo será el retornado y en el se almacenará cada dato con sus keys en camelCase 
         * @type {Array}
         */
        let response = {passenger : []};
        let occupiedSeats = [];
        let passengerWithoutSeat = [];

        /**Arreglo con todos los campos que no quiero que tenga el json que se retornará 
         * @type {Array} */
        const fieldsToDelete = [
          'boarding_passes',
          '_previousDataValues',
          '_changed',
          'uniqno',
          '_options',
          'isNewRecord'
        ]

        const dbResponse = await Flight.findByPk(id, {include: [
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
                 * @type {Array} Almacenará todos los asientos que se encuentren vacios
                 */
            
                const emptySeats = await getEmptySeats(id, occupiedSeats);
               
                
                response = {...dbResponse ,...response};
                
               
                /**
                 * Elimino del objeto a retornar todas las keys innecesarias para la respuesta
                 */
                for (const field of fieldsToDelete){
                  delete response.dataValues[field];
                  delete response[field];
                }

                /**
                 * Los datos del vuelo estan en la key dataValues, por lo tanto, 
                 * unifico la información de dataValues y passengers en un unico objeto
                 */
                response = {...response.dataValues, passengers : response.passenger}
              
                response = renameKeys(response);
             
                response.passengers = setSeatToPassenger(response.passengers, emptySeats);
             
                response.passengers.sort((a, b) => a.seatId - b.seatId);
              
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