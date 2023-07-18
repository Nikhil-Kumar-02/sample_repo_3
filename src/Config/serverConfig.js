const dotENV = require('dotenv');
dotENV.config();

module.exports = {
    PORT : process.env.PORT,
    DB_SYNC : process.env.DB_SYNC
}