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
 * Funcion que comprueba si un asiento, según el indice, tiene un asiento adyacente disponible o no 
 * @param {Array} emptySeats Lista de asientos disponibles
 * @param {Integer} index indice donde comprobaré si tiene un asiento adyacente o no
 * @returns {boolean} En caso de que el indice enviado tenga compañero retorna true, caso contrario retorna false
 */

const areSeatsTogether = (emptySeats, index) => {
    
    /**Objeto que contiene las columnas que esta al lado de la otra
     * @type {obj} 
     */
    
    const seatsTogether = {
        'A': 'B',
        'B': 'C',
        'D': 'E',
        'E': 'F',
        'F': 'G',
        'H': 'I'
    };

    /**Utilizando la constante 'seatsTogether' compruebo que dos columnas sean compañeras y a su vez compruebo que estan paradas sobre la misma fila  */
    return (seatsTogether[emptySeats[index]['seat_column']] === emptySeats[index + 1]['seat_column'] && emptySeats[index]['seat_row'] === emptySeats[index + 1]['seat_row']);
}

/**
 * Funcion para obtener los pasajeros agrupados por su purchaseId
 * @param {Array} passengers Lista de pasajeros
 * @param {Integer} purchaseId ID de la venta a buscar
 * @returns {Array} Arreglo con todos los pasajeros con el mismo ID de venta
 */
const getPassengersByPurchaseId = (passengers, purchaseId) => {
    return passengers.filter((passenger) => passenger.purchaseId === purchaseId);
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

    //Obtengo los asientos vacios
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
        passengersGroup = getPassengersByPurchaseId(passengers, underagePassenger.purchaseId);
    } else {
        passengersGroup = getPassengersByPurchaseId(passengers, passengers[0].purchaseId);
    }

    /**Obtengo el pasajero menor de edad de la lista de pasajeros agrupados por su purchaseId */
    let underagesGroup = passengersGroup.filter(passenger => passenger.age < adult);

    if (underagesGroup.length > 0) {


        /** Obtengo el primer adulto que acompañará al menor de edad */
        let adultsGroup = passengersGroup.filter(passenger => passenger.age >= adult && underagesGroup[0].seatTypeId === passenger.seatTypeId);

        let adultPartner = {};

        for (let i = 0; i < emptySeats.length; i++) {

            if (underagesGroup.length > adultsGroup.length){
                
                let firstUnderage = underagesGroup.shift();
                let lastUnderage = underagesGroup.pop();
                adultPartner = adultsGroup.shift();
                
                if (adultPartner){
                    if (emptySeats[i + 1] && emptySeats[i + 2]) {
                        
                    
                        if (areSeatsTogether(emptySeats, i) && areSeatsTogether(emptySeats, i+1)) {
                            /**
                             * Compruebo que el tipo de asiento sea el que solicitó el cliente en su compra
                             */
                        
                            if (emptySeats[i]['seat_type_id'] === firstUnderage.seatTypeId && emptySeats[i+1]['seat_type_id'] === adultPartner.seatTypeId && emptySeats[i+2]['seat_type_id'] === lastUnderage.seatTypeId){
                                firstUnderage.seatId = emptySeats[i]['seat_id'];
                                adultPartner.seatId = emptySeats[i + 1]['seat_id'];
                                lastUnderage.seatId = emptySeats[i + 2]['seat_id'];
                                updatedPassengers.push(...[firstUnderage, adultPartner, lastUnderage]);

                                /**
                                 * Elimino los dos asientos asignados de la lista de asientos vacios
                                 */
                                emptySeats.splice(i, 3);
                                break;
                            } else{
                            
                                underagesGroup.push(firstUnderage);
                                underagesGroup.push(lastUnderage);
                                adultsGroup.push(adultPartner);
                                continue;
                            }
                        } else{
                            
                            underagesGroup.push(firstUnderage);
                            underagesGroup.push(lastUnderage);
                            adultsGroup.push(adultPartner);
                            continue;
                        }
                    } else{
                        
                        underagesGroup.push(underage);
                        adultsGroup.push(adultPartner);
                        continue;
                    } 
                }
            } else if (emptySeats[i + 1]) {

                let underage = underagesGroup.shift();
                adultPartner = adultsGroup.shift();
            
                /**Utilizando la constante 'seatsTogether' compruebo que dos columnas sean compañeras y a su vez compruebo que estan paradas sobre la misma fila  */
                if (areSeatsTogether(emptySeats, i)) {
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
                  
                        underagesGroup.push(underage);
                        adultsGroup.push(adultPartner);
                        continue;
                    }
                } else{
                  
                    underagesGroup.push(underage);
                    adultsGroup.push(adultPartner);
                    continue;
                }
            }
            
        }
    }
    
    /** Verifico que en el grupo actual que se le hayan asignado asientos a todos los pasajeros del array */
    passengersGroup = passengersGroup.filter((passenger) => { return !updatedPassengers.some((updatedPassenger) => passenger.passengerId === updatedPassenger.passengerId) });

    if (passengersGroup) {

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