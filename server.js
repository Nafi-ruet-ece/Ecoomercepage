require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse URL-encoded form data and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route: serves the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET route for the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// POST route for registering a new user
app.post('/signup', async (req, res) => {
  const { name, age, email, password } = req.body;

  if (!name || !age || !email || !password) {
    const errorMsg = 'All fields (Name, Age, Email, Password) are required.';
    if (req.is('json') || req.headers.accept?.includes('application/json')) {
      return res.status(400).json({ error: errorMsg });
    }
    return res.redirect('/signup?error=' + encodeURIComponent(errorMsg));
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: name.trim(),
          age: parseInt(age, 10),
          email: email.trim(),
          password: password
        }
      ]);

    if (error) {
      console.error('Supabase signup insert error:', error);
      let errorMsg = error.message || 'Failed to create user.';
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        errorMsg = 'Supabase Row-Level Security (RLS) is blocking inserts on table "users". Please run "ALTER TABLE users DISABLE ROW LEVEL SECURITY;" in your Supabase SQL editor.';
      }
      if (req.is('json') || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ error: errorMsg });
      }
      return res.redirect('/signup?error=' + encodeURIComponent(errorMsg));
    }

    // Redirect to login page on successful registration
    if (req.is('json') || req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, redirect: '/' });
    }
    return res.redirect('/?registered=true');
  } catch (err) {
    console.error('Signup server error:', err);
    if (req.is('json') || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ error: 'Server error during signup.' });
    }
    return res.redirect('/signup?error=' + encodeURIComponent('Server error during signup.'));
  }
});

// POST route for authenticating user login
app.post('/login', async (req, res) => {
  const email = (req.body.email || req.body.username || '').trim();
  const password = req.body.password || '';

  if (!email || !password) {
    const errorMsg = 'Please provide both email and password.';
    if (req.is('json') || req.headers.accept?.includes('application/json')) {
      return res.status(400).json({ error: errorMsg });
    }
    return res.redirect('/?error=' + encodeURIComponent(errorMsg));
  }

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password);

    if (error) {
      console.error('Supabase login error:', error);
      const errorMsg = error.message || 'Error querying database during login.';
      if (req.is('json') || req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ error: errorMsg });
      }
      return res.redirect('/?error=' + encodeURIComponent(errorMsg));
    }

    if (!users || users.length === 0) {
      const errorMsg = 'Invalid email or password.';
      if (req.is('json') || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ error: errorMsg });
      }
      return res.redirect('/?error=' + encodeURIComponent(errorMsg));
    }

    const user = users[0];
    if (req.is('json') || req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, message: 'Login successful', user });
    }
    return res.redirect(`/?login_success=1&user=${encodeURIComponent(user.name || user.email)}`);
  } catch (err) {
    console.error('Login server error:', err);
    if (req.is('json') || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ error: 'Server error during login.' });
    }
    return res.redirect('/?error=' + encodeURIComponent('Server error during login.'));
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
