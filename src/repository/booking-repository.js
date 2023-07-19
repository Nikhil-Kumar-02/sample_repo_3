const { Booking } = require('../models/index');
const { ValidationError , AppError } = require('../utils/errror/index');
const { StatusCodes } = require('http-status-codes');
class BookingRepository{

    async create (data){
        try {
            const ticket = await Booking.create(data);
            return ticket;
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }//if during creation some error has occured then this must be due to server
            throw new AppError(
                'repository error',
                'cannot create  booking',
                'there was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

}

module.exports = BookingRepository;