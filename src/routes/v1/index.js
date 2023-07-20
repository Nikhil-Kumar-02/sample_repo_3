const express = require('express');
const router = express.Router();
const { BookingController } = require('../../controllers/index');

router.get('/bookTicket' , BookingController.bookFlight);
router.delete('/cancel/:id', BookingController.cancelFlight);

module.exports = router;