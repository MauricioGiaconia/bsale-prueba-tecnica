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

    /** Edad minima para que un pasajero sea considerado adulto
     * @type {Integer} 
     */
    const adult = 18;

    /**Objeto que contiene las columnas que esta al lado de la otra
     * @type {obj} 
     */

    //NOTA: Tecnica B y C son compañeros segun los dibujos en el pdf pero en las preguntas frecuentes se aclara de que NO lo son
    const seatsTogether = {
        'A': 'B',
        'D': 'E',
        'F': 'G',
        'H': 'I'
    };

    
    emptySeats = orderSeats(emptySeats);

    /** Busco al primer pasajero menor de edad que se encuentre en el array de pasajeros
     * @type {obj} 
     */
    const underagePassenger = passengers.find(passenger => passenger.age < adult);

    let passengersGroup = [];

    /**
     * Si existe un pasajero menor de edad entonces agrupo todos los compañeros de esa persona segun el id de venta, si no existe, agrupo por id de venta del primer pasajero disponible
     */
    if (underagePassenger) {
        passengersGroup = passengers.filter((partner) => partner.purchaseId === underagePassenger.purchaseId);
    } else {
        passengersGroup = passengers.filter((partner) => partner.purchaseId === passengers[0].purchaseId);
    }

    /**Obtengo el pasajero menor de edad de la lista de pasajeros agrupados por su purchaseId */
    let underage = passengersGroup.find(passenger => passenger.age < adult);

    if (underage) {


        /** Obtengo el primer adulto que acompañará al menor de edad */
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
                        /**
                         * Elimino los dos asientos asignados de la lista de asientos vacios
                         */
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
        
            /** Obtengo el primer pasajero de su grupo, si ya tiene un asiento asignado entonces lo empujo a la lista de pasajeros actualizados */
            let assignedPassenger = passengersGroup.shift();
            
            if (assignedPassenger.seatId !== null){
                updatedPassengers.push(assignedPassenger);
            } else{

                /** Contador para ver cada asiento en el array "emptySeats"
                 * @type {Integer} 
                 */
                let count = 0;
                /**En cambio, mientras no tenga un asiento asignado, le busco uno que coincida con el tipo de asiento que compró */
                while (assignedPassenger.seatId === null){
                    

                    /** Si coincido con el tipo de asiento que compró el cliente, entonces se lo asigno */
                    if (assignedPassenger.seatTypeId === emptySeats[count]['seat_type_id']){
                        assignedPassenger.seatId = emptySeats[count]['seat_id'];
                        updatedPassengers.push(assignedPassenger);
                        /**
                         * Elimino el asiento, que ahora está ocupado, de la lista de asientos vacios
                         */
                        emptySeats.splice(count, 1);
                    } else{
                        count++;
                    }
                }
                
            }    
        }
    }

    /**
     * Todos los pasajeros que hayan sido actualizados y ahora tengan un asiento asignado, serán eliminados de la lista de pasajeros para poder llamar a la funcion de manera recursiva
     */
    passengers = passengers.filter((passenger) => { return !updatedPassengers.some((updatedPassenger) => passenger.passengerId === updatedPassenger.passengerId) });

    return updatedPassengers.concat(setSeatToPassenger([...passengers], [...emptySeats]));
}

module.exports = { setSeatToPassenger };