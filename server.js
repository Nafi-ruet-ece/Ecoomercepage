require('dotenv').config();
const express = require('express');
const path = require('path');

// Import modular routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: Parse incoming URL-encoded form submissions and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes: Authentication and E-Commerce storefront
app.use('/', authRoutes);
app.use('/', productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
