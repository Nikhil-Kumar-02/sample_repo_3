//here in the booking service we have to implement all the logic to book a ticket
//flightId , userId, noofseats will be sent form the frontend
//staus we have to change and cost we have to calculate from the backend as the price
//of a flight is dynamic in nature we can also calculate the price from the frontend
//if you will notice we have to fetch the flight details from the flightandsearch service 
//that database will will have all the details
//so require interservice communication

const { BookingRepository } = require('../repository/index')
const axios = require('axios');
const { FLIGHT_SERVICE } = require('../Config/serverConfig');
const { ServiceError } = require('../utils/errror');

class BookingService{

    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        try {
            const flightId = data.flightId;
            //based on this flight id we have to fetch the detail from the flight and search service
            //so to make http request we can use axios
            let GetFlightRequestURL = `${FLIGHT_SERVICE}/flight/${flightId}`;
            const response = await axios.get(GetFlightRequestURL);
            const flightData = response.data.data;
            console.log('the data of the flight the ticket has to be booked' , flightData);

            const flightPrice = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('something went wrong in the booking process',
                'Insufficient seats available');
            }
            //console.log('flight price' , flightPrice , typeof flightPrice);
            const TotalCost = flightPrice * data.noOfSeats;
            //console.log('total cost' , TotalCost , typeof TotalCost);
            const bookingObject = {...data,TotalCost};
            console.log('booking object' , bookingObject);
            const booking = await this.bookingRepository.create(bookingObject);
            //now my booking data is saved on the booking database but as i have booked n seats
            //so i have to reduce the count of available seats in the flight which is in flight service
            //so again we have to make http request using axios
            const UpdateSeatsURL = `${FLIGHT_SERVICE}/flight/${flightData.flightNumber}`;
            //now i will make request to update the seats explicitily
            const UpdatedFlightDetails = await axios.patch(UpdateSeatsURL ,
                {totalSeats : flightData.totalSeats - booking.noOfSeats});
            //above we have subtracted earlier - data.noOfSeats but think about it person requested
            //for 10 seats and we were able to only book 6 so in seats count we have to suntract the 
            //number of booked seats yeahhhh
            // console.log('updated flight details' , UpdatedFlightDetails);

            //again it is possible that this update request might fail so we have to handle that also
            
            //also we have to update the booking status of ticket
            const finalConformedTicket = await this.bookingRepository.update(booking.id ,
            { status: 'Booked' });
            return finalConformedTicket;
        } catch (error) {
            if(error.name == 'ValidationError' || error.name == 'repository error'){
                throw error;
            }
            //if the name was above two then this error occured in the repo and we will throw the incoming
            //error if not then error occured here in service layer so we will throw the service error
            throw new ServiceError();
        }
    }

    //similarly i can write the logic for updating the flight with boarding or destination
    //or a logic for cancelltion of the flight


    async cancelBooking(id){
        try {
            //step 1 -  gather all information about the ticket from the ticket_id
            const ticketDetails = await this.bookingRepository.getTicketDetails(id);
            console.log('ticket details ', ticketDetails);
            //step 2 -  now go to that flight and undo the number of seats resserved by this ticket
            let GetFlightRequestURL = `${FLIGHT_SERVICE}/flight/${ticketDetails.flightId}`;
            const response = await axios.get(GetFlightRequestURL);
            const flightData = response.data.data;
            console.log('the data of the flight, the ticket has to be cancelled' , flightData);

            
            const refund = ticketDetails.TotalCost/2;
            ticketDetails.dataValues.refund = refund;
            
            const UpdateSeatsURL = `${FLIGHT_SERVICE}/flight/${flightData.flightNumber}`;
            //now i will make request to update the seats explicitily
            const UpdatedFlightDetails = await axios.patch(UpdateSeatsURL ,
                {totalSeats : flightData.totalSeats + ticketDetails.noOfSeats});

            //now after we have updated the seat count from the flight we can delete the ticket from db
            //step 3 -  delete the ticket from the db
            const deletingProcess = await this.bookingRepository.cancelTicket(id);
            ticketDetails.dataValues.status = 'deleted';
            console.log('the reponse ' , ticketDetails);
            return ticketDetails;
        } catch (error) {
            if(error.name == 'repository error'){
                throw error;
            }
            throw new ServiceError();
        }
    }

}

module.exports = BookingService;