/**
 * Recibe un string para transformar de snakeCase a camelCase
 * @param {string} snakeCase cadena en snakeCase que será convertido a camelCase
 * @returns {string} resultado en camelCase
 */

function snakeToCamelCase(snakeCase) {

  /**El metodo replace buscara todas las ocurrencias que contengan el patrón del regex (_ seguido de una letra) 
   * Ademas el metodo recibirá una funcion que tiene como parametro match y letter: match será la coincidencia encontrada (por ejemplo _a) y letter
   * contendrá la letra seguida del _. Esta función retornará la letra pasada a mayuscula usando el metodo toUpperCase()
  */
  return snakeCase.replace(/_([a-zA-Z])/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

/**
 * 
 * @param {json} obj 
 * @returns {json} el nuevo JSON con sus nuevas propiedades en formato camelCase
 */

function renameKeys(obj, visited = new Set()) {

  if (visited.has(obj)) {
    /**
      * Si el objeto ya fue visitado, entonces retorno el objeto sin mas
    */
    return obj;
  }

  visited.add(obj);

  if (Array.isArray(obj)) {
    /** Si el valor que estoy manipulando es un array, entonces llamo de forma recursiva a la funcion
     * Para aplicarle el camelCase a las propiedades de los posibles objetos que pueda tener el array,
     * de esta forma obtengo un nuevo array con los obtengos con sus keys en camelCase
     * @type {Array}
     */
    const newArray = obj.map(item => renameKeys(item, visited));
    visited.delete(obj);
    return newArray;

  } else if (typeof obj === 'object' && obj !== null) {

    const newObj = {};
    
    for (const key in obj) {
      const value = obj[key];
      newObj[snakeToCamelCase(key)] = renameKeys(value, visited);
    }

    visited.delete(obj);
    return newObj;

  } else {
    visited.delete(obj);
    return obj;
  }
}


module.exports = { snakeToCamelCase, renameKeys }