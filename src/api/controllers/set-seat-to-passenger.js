/**
 * 
 * @param {Array} emptySeats Lista de todos los asientos vacios
 * @returns {Array} Array con los asientos vacios ordenados por sus columnas y filas
 */
const orderSeats = (emptySeats) => {

    /**  Ordena los asientos vacíos por fila y columna
     * */
    emptySeats.sort((a, b) => {
        /**  Primero, compara las filas*/
        if (a.seat_row < b.seat_row) {
            return -1;
        } else if (a.seat_row > b.seat_row) {
            return 1;
        }

        /** Si las filas son iguales, compara las columnas personalizadas para la lógica de compañeros */
        const columnOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        const columnAIndex = columnOrder.indexOf(a.seat_column);
        const columnBIndex = columnOrder.indexOf(b.seat_column);

        if (columnAIndex < columnBIndex) {
            return -1;
        } else if (columnAIndex > columnBIndex) {
            return 1;
        }

        return 0;

    });


    return emptySeats;
}

/**
 * Funcion recursiva que asigna asientos a pasajeros que no tengan uno asignado.
 * @param {Array<obj>} passengers Lista de pasajeros a la que se le quiere asignar asientos
 * @param {Array<obj>} emptySeats Lista de asientos disponibles
 * @returns {Array} Lista con todos los pasajeros del vuelo, cada uno con su respectivo asiento respetando sus compañeros
 */
const setSeatToPassenger = (passengers, emptySeats) => {
  
    if (passengers.length === 0) {
        return [];
    }

    let updatedPassengers = [];

    /**
     * @type {Integer} Edad minima de un adulto
     */
    const adult = 18;

    /**@type {obj} Objeto que contiene las columnas que esta al lado de la otra */
    const seatsTogether = {
        'A': 'B',
        'B': 'C',
        'C': 'B',
        'D': 'E',
        'E': 'F',
        'F': 'E',
        'G': 'F',
        'H': 'I',
        'I': 'H'
    };

    
    emptySeats = orderSeats(emptySeats);

    /**
     * @type {obj} Busco al primer pasajero menor de edad que se encuentre en el array de pasajeros
     */
    const underagePassenger = passengers.find(passenger => (passenger.age < adult));

    let passengersGroup = [];

    /**
     * Si existe un pasajero menor de edad entonces agrupo todos los compañeros de esa persona segun el id de venta, si no existe, agrupo por id de venta del primer pasajero disponible
     */
    if (underagePassenger) {
        passengersGroup = passengers.filter((partner) => partner.purchaseId === underagePassenger.purchaseId);
    } else {
        passengersGroup = passengers.filter((partner) => partner.purchaseId === passengers[0].purchaseId);
    }

    let underage = passengersGroup.find(passenger => passenger.age < adult);

    if (underage) {

        let adultPartner = passengersGroup.find(passenger => passenger.age >= adult);

        for (let i = 0; i < emptySeats.length; i++) {
            if (emptySeats[i + 1]) {
                /**Utilizando la constante 'seatsTogether' compruebo que dos columnas sean compañeras y a su vez compruebo que estan paradas sobre la misma fila  */
                if ((seatsTogether[emptySeats[i]['seat_column']] === emptySeats[i + 1]['seat_column']) && (emptySeats[i]['seat_row'] === emptySeats[i + 1]['seat_row'])) {
                    /**
                     * Compruebo que el tipo de asiento sea el que solicitó el cliente en su compra
                     */
                    if (emptySeats[i]['seat_type_id'] === underage.seatTypeId && emptySeats[i+1]['seat_type_id'] === adultPartner.seatTypeId){
                        underage.seatId = emptySeats[i]['seat_id'];
                        adultPartner.seatId = emptySeats[i + 1]['seat_id'];
                        updatedPassengers.push(...[underage, adultPartner]);
                        emptySeats.splice(i, 2);
                        break;
                    } else{
                        continue;
                    }
                }
            }
        }
    } else if (passengersGroup) {

        if (passengersGroup.length > 0) {
        
            let assignedPassenger = passengersGroup.shift();
            
            if (assignedPassenger.seatId !== null){
                updatedPassengers.push(assignedPassenger);
            } else{

                while (assignedPassenger.seatId === null){
                    let emptySeat = emptySeats.shift();

                    if (assignedPassenger.seatTypeId === emptySeat['seat_type_id']){
                        assignedPassenger.seatId = emptySeat['seat_id'];
                        updatedPassengers.push(assignedPassenger)
                    } else{
                        emptySeats.push(emptySeat);
                    }
                }
                
            }    
        }
    }

    passengers = passengers.filter((passenger) => { return !updatedPassengers.some((updatedPassenger) => passenger.passengerId === updatedPassenger.passengerId) });

    return updatedPassengers.concat(setSeatToPassenger([...passengers], [...emptySeats]));
}

module.exports = { setSeatToPassenger };