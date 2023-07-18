class AppError extends  Error{
    constructor(
        name,message,explanation,statuscode
    ){
        super();
        this.name = name;
        this.explanation = explanation;
        this.message = message;
        this.statuscode = statuscode;
    }
}

module.exports = AppError;


