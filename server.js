require('dotenv').config();
const express = require('express');
const path = require('path');

// Import modular routes
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 1: Parse incoming URL-encoded form submissions (HTML form posts)
app.use(express.urlencoded({ extended: true }));

// Middleware 2: Parse incoming JSON payloads (AJAX/Fetch requests)
app.use(express.json());

// Middleware 3: Serve static assets (HTML, CSS, images, client-side JS) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes: All authentication and initial page routes
app.use('/', authRoutes);

// Start listening for incoming network requests
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
