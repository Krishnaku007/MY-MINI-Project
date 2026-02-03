// Admin verification routes
const express = require('express');
const Ticket = require('../models/Ticket');

const router = express.Router();

// Verify ticket by ID
router.get('/verify/:ticketId', async (req, res) => {
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
      message: 'Ticket verified successfully.',
      data: {
        ticketId: ticket.ticketId,
        visitorName: ticket.visitorName,
        visitDate: ticket.visitDate,
        numberOfVisitors: ticket.numberOfVisitors,
        totalAmount: ticket.totalAmount,
        ticketStatus: ticket.ticketStatus,
        createdAt: ticket.createdAt
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify ticket.'
    });
  }
});

module.exports = router;
