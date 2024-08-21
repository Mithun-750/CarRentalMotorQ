const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {  // Initialize Socket.IO with CORS options
    cors: {
        origin: 'http://localhost:5173',  // Frontend origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

// Socket.IO Events
io.on('connection', (socket) => {
    console.log('A user connected');

    // Example event: Listen for car updates
    socket.on('updateCar', (car) => {
        io.emit('car-updated', car);  // Broadcast car updates to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));
