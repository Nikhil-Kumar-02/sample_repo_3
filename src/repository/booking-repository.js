const booking = require('../models/booking');
const { Booking } = require('../models/index');
const { ValidationError , AppError } = require('../utils/errror/index');
const { StatusCodes } = require('http-status-codes');
class BookingRepository{

    async create (data){
        try {
            const ticket = await Booking.create(data);
            // while booking we have to take care that left seats is more than the required seats 
            // and after booking the number of seats should reduce
            //and user has reached here then he must have been authenticated
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

    //we know if a customer with a booked ticket want to change the flight from a to  b due to 
    //time or some other reason then if possible with some money then their flight are changed 
    //only if seats are available
    async update(bookingId , data){
        try {
            const reqTicket = await Booking.findByPk(bookingId);
            if(data.status)
                reqTicket.status = data.status;

            await reqTicket.save();
            return reqTicket;
        } catch (error) {
            throw new AppError(
                'repository error',
                'cannot update  booking',
                'there was some issue updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    //for deleting a ticket we will need the ticket id 
    //from ticket id we will first need to fetch the ticket details like seats and flightid
    //then we will update the seats count and then delete the ticket entry from the database
    async getTicketDetails(ticketId){
        try {
            const ticketDetails = await Booking.findByPk(ticketId);
            return ticketDetails;
        } catch (error) {
            throw new AppError(
                'repository error',
                'cannot fetech the booking details',
                'there was some issue fetching the ticket details, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async cancelTicket(ticketId){
        try {
            await Booking.destroy({
                where : {
                    id : ticketId
                }
            });
            return true;
        } catch (error) {
            throw new AppError(
                'repository error',
                'cannot cancel the ticket',
                'there was some issue cancelling the ticket details, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

}

module.exports = BookingRepository;