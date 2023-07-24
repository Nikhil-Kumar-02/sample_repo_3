const express = require('express');
const router = express.Router();
const { BookingController } = require('../../controllers/index');

router.get('/bookTicket' , BookingController.bookFlight);
router.delete('/cancel/:id', BookingController.cancelFlight);
router.get('/hitbooking' , (req,res) => {
    res.json({
        message : "hitting the router of the booking service"
    })
})
module.exports = router;