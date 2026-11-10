const path = require('path');
const supabase = require('../config/supabase');

// Render the login page (index.html)
exports.renderLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
};

// Render the signup page (signup.html)
exports.renderSignupPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
};

// Handle user registration
exports.signupUser = async (req, res) => {
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
};

// Handle user authentication (login)
exports.loginUser = async (req, res) => {
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
};
