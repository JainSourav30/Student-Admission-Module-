const details = require('./sql_files/Souravdb')
const Pool = require("pg").Pool;
console.log(details.password)

const pool = new Pool(
    {
        user: details.user,
        password: details.password,
        host: details.host,
        port: details.port,
        database : details.database
    }
)

module.exports = pool