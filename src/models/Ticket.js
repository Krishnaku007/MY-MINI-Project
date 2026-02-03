// Ticket model definition
const mongoose = require('mongoose');
const crypto = require('crypto');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true,
    default: () => `TICKET-${crypto.randomUUID().split('-')[0].toUpperCase()}`
  },
  visitorName: {
    type: String,
    required: true,
    trim: true
  },
  visitDate: {
    type: String,
    required: true
  },
  numberOfVisitors: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  ticketStatus: {
    type: String,
    default: 'CONFIRMED'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
