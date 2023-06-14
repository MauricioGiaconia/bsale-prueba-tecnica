const {Airplane, Flight, Seat, Seat_type, Purchase, Passenger, Boarding_pass} = require('../database/db.js');

const {renameKeys} = require('../scripts/functions.js');
const getEmptySeats = require('./getEmptySeats.js');

const getAllAirplanes = async (req, res) => {

    try{
        /** Este arreglo será el retornado y en el se almacenará cada dato con sus keys en camelCase 
         * @type {Array}
         */
        let response = {passenger : []};
        let occupiedSeats = [];

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
       
                for (const data of dbResponse['boarding_passes']){
                 
                  response['passenger'].push({
                    ...data.passenger['dataValues'], 
                    boarding_pass_id: data['boarding_pass_id'],
                    purchase_id: data.purchase['purchase_id'],
                    seat_type_id: data['seat_type_id'],
                    seat_id: data['seat_id']

                  });

                  if (data['seat_id'] !== null){
                    occupiedSeats.push(data['seat_id']);
                  } 
                }
                
                response = {...dbResponse ,...response};
                console.log(await getEmptySeats(1, occupiedSeats), occupiedSeats)
               
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