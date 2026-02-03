const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

const PRICE_PER_TICKET = 150;
const state = {
  step: 0,
  visitorName: '',
  visitDate: '',
  numberOfVisitors: 0
};

const steps = [
  {
    question: 'Hello! I\'m MuseBot. May I know your name?'
  },
  {
    question: 'Great! Please share your visit date (YYYY-MM-DD).'
  },
  {
    question: 'How many visitors are coming?'
  }
];

const addMessage = (text, type = 'bot') => {
  const message = document.createElement('div');
  message.className = `message ${type}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = text;

  message.appendChild(bubble);
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const addTicketSummary = (ticket) => {
  const summary = document.createElement('div');
  summary.className = 'ticket-summary';
  summary.innerHTML = `
    <h3>Booking Confirmed 🎉</h3>
    <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
    <p><strong>Visitor:</strong> ${ticket.visitorName}</p>
    <p><strong>Visit Date:</strong> ${ticket.visitDate}</p>
    <p><strong>Visitors:</strong> ${ticket.numberOfVisitors}</p>
    <p><strong>Total Amount:</strong> ₹${ticket.totalAmount}</p>
    <p><strong>Status:</strong> <span class="status">${ticket.ticketStatus}</span></p>
    <div class="qr-code">
      <img src="${ticket.qrCode}" alt="QR Code" width="160" />
    </div>
    <div class="quick-actions">
      <button type="button" id="newBookingBtn">Book Another Ticket</button>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.className = 'message bot';
  wrapper.appendChild(summary);
  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  document.getElementById('newBookingBtn').addEventListener('click', resetChat);
};

const showCurrentQuestion = () => {
  if (state.step < steps.length) {
    addMessage(steps[state.step].question, 'bot');
  }
};

const validateInput = (input) => {
  if (state.step === 0) {
    return input.trim().length >= 2;
  }

  if (state.step === 1) {
    return /^\d{4}-\d{2}-\d{2}$/.test(input.trim());
  }

  if (state.step === 2) {
    return Number(input) > 0;
  }

  return true;
};

const handleUserInput = async (input) => {
  if (!validateInput(input)) {
    addMessage('Please provide a valid response so I can continue.', 'bot');
    return;
  }

  if (state.step === 0) {
    state.visitorName = input.trim();
  }

  if (state.step === 1) {
    state.visitDate = input.trim();
  }

  if (state.step === 2) {
    state.numberOfVisitors = Number(input);
    const totalAmount = state.numberOfVisitors * PRICE_PER_TICKET;
    addMessage(`Perfect! Your total will be ₹${totalAmount}. Booking your ticket now...`, 'bot');
    await submitBooking();
    return;
  }

  state.step += 1;
  showCurrentQuestion();
};

const submitBooking = async () => {
  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        visitorName: state.visitorName,
        visitDate: state.visitDate,
        numberOfVisitors: state.numberOfVisitors
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Booking failed');
    }

    addTicketSummary(result.data);
  } catch (error) {
    addMessage(`Oops! ${error.message}. Please try again.`, 'bot');
  }
};

const resetChat = () => {
  chatWindow.innerHTML = '';
  state.step = 0;
  state.visitorName = '';
  state.visitDate = '';
  state.numberOfVisitors = 0;
  addMessage('Sure! Let\'s book another ticket.', 'bot');
  showCurrentQuestion();
};

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = chatInput.value.trim();
  if (!input) {
    return;
  }

  addMessage(input, 'user');
  chatInput.value = '';
  handleUserInput(input);
});

// Initial greeting
addMessage('Welcome to the National Heritage Museum!', 'bot');
showCurrentQuestion();
