const express = require('express');
const cors = require('cors');

const app = express();

// Config Json response
app.use(express.json());

// Solve CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// Public folder
app.use(express.static('public'));

// Import routes
const UserRoute = require('./routes/UserRoute');

// Routes
app.use('/user', UserRoute);

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});