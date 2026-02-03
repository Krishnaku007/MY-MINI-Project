// Ticket booking routes
const express = require('express');
const QRCode = require('qrcode');
const Ticket = require('../models/Ticket');

const router = express.Router();
const TICKET_PRICE = 150;

// Book a ticket
router.post('/', async (req, res) => {
  try {
    const { visitorName, visitDate, numberOfVisitors } = req.body;

    if (!visitorName || !visitDate || !numberOfVisitors) {
      return res.status(400).json({
        success: false,
        message: 'Visitor name, visit date, and number of visitors are required.'
      });
    }

    const totalAmount = Number(numberOfVisitors) * TICKET_PRICE;

    const ticket = await Ticket.create({
      visitorName,
      visitDate,
      numberOfVisitors: Number(numberOfVisitors),
      totalAmount
    });

    // Generate QR code using ticketId
    const qrCode = await QRCode.toDataURL(ticket.ticketId);

    return res.status(201).json({
      success: true,
      message: 'Ticket booked successfully',
      data: {
        ticketId: ticket.ticketId,
        visitorName: ticket.visitorName,
        visitDate: ticket.visitDate,
        numberOfVisitors: ticket.numberOfVisitors,
        totalAmount: ticket.totalAmount,
        ticketStatus: ticket.ticketStatus,
        qrCode
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to book ticket. Please try again.'
    });
  }
});

// Fetch ticket details by ID
router.get('/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.'
      });
    }

    return res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Fetch ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket.'
    });
  }
});

module.exports = router;
