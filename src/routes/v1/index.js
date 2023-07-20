const express = require('express');
const router = express.Router();
const { BookingController } = require('../../controllers/index');

router.get('/bookTicket' , BookingController.bookFlight);

module.exports = router;