const {conn} = require('../database/db.js');

const connection = async (req, res) => {
    try {
        await conn.authenticate();

        return res.status(200).json({msg: 'Conexión exitosa a la base de datos!'});
        
      } catch (error) {
        return res.status(400).json({
            code: 400,
            errors: 'could not connect to db'
        })
      }
}

module.exports = connection