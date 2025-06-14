require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.locals.io = io;
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://bulk-email-campaign-manager.vercel.app',
  'https://bulk-email-campaign-manager-git-main-dharmawarriors-projects.vercel.app',
  'https://bulk-email-campaign-manager-2q7kvj582-dharmawarriors-projects.vercel.app'
];

app.use(cors({
  origin: function(origin, callback){
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}));
app.use(express.json({ type: 'application/json' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Socket.IO client connected:', socket.id);
  // Join campaign room if requested
  socket.on('joinCampaign', (campaignId) => {
    socket.join(`campaign_${campaignId}`);
  });
});

// Routes
app.use('/api', require('./routes/api'));

// Root
app.get('/', (req, res) => {
  res.send('Bulk Email Campaign Manager API');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
