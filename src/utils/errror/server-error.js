const { StatusCodes } = require('http-status-codes');
const serverConfig = require('../../Config/serverConfig');

class ServiceError extends Error{
    //no need to pass the name as we know that it is the server error
    constructor(message = "something went wrong",
        explanation = "service layer error",
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        ){
            super();
            this.name = "ServiceError",
            this.message = message,
            this.explanation = explanation,
            this.statusCode = statusCode
        }
}

module.exports = ServiceError;