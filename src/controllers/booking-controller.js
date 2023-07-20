
const { BookingService } = require('../services/index');
const { StatusCodes } = require('http-status-codes');
const bookingService = new BookingService();


const bookFlight = async (req,res) => {
    try {
        const ticket = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            sucess : true,
            message : 'sucessfully booked your ticket',
            data : ticket,
            error : {}
        })
    } catch (error) {
        return res.json(error.statusCode).json({
            sucess : false,
            message : error.message,
            data : {},
            error : error.explanation
        })   
    }
}

const cancelFlight = async (req,res) => {
    try {
        const response = await bookingService.cancelBooking(req.params.id);
        return res.status(StatusCodes.OK).json({
            sucess : true,
            message : 'sucessfully cancelled your ticket',
            data : response,
            error : {}
        })
    } catch (error) {
        return res.json(error.statusCode).json({
            sucess : false,
            message : error.message,
            data : {},
            error : error.explanation
        })   
    }
}

module.exports = {
    bookFlight,
    cancelFlight
}