const { Router } = require('express');
const router = Router();

const connection = require('../controllers/connection-to-db.js');
const getAllAirplanes = require('../controllers/autocheckin.js');
/**
 * Ruta default '/', establecerá la conexión a la base de datos y retornará sus respectivos mensajes en caso de conexión exitosa o error al conectarse
 */
router.get('/', (req, res) => connection(req, res));

router.get('/flights/:id/passengers', (req, res) => {getAllAirplanes(req, res)});



module.exports = router;