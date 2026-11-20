# E-Commerce Web Application (Node.js, Express, Supabase & React)

A modular, scalable full-stack e-commerce web application built using **Node.js**, **Express.js**, **Supabase (PostgreSQL)**, and a beginner-friendly **React** storefront.

---

## Storefront & API Routes
- **`GET /shop`**: Serves the beginner-friendly React storefront (`public/shop.html` & `public/js/shop.js`). Works independently without database dependencies.
- **`GET /api/products`**: REST API endpoint returning mock men's apparel catalog (Shirts and Pants) as JSON.
- **`GET /`**: Serves the login page (`public/index.html`).
- **`GET /signup`**: Serves the user registration page (`public/signup.html`).
- **`POST /signup`**: Registers a new user into Supabase.
- **`POST /login`**: Authenticates user credentials with Supabase.

---

## Project Architecture (Modular MVC)
- **`server.js`**: Clean, lightweight router hub (~25 lines).
- **`config/`**: Database client configuration (`supabase.js`).
- **`controllers/`**:
  - `authController.js`: Handles user login and signup logic.
  - `productController.js`: Serves mock product catalog and shop storefront.
- **`routes/`**:
  - `authRoutes.js`: Maps auth endpoints (`/login`, `/signup`).
  - `productRoutes.js`: Maps storefront endpoints (`/shop`, `/api/products`).
- **`public/`**:
  - `shop.html`: React storefront container loading React 18, ReactDOM, and Babel via CDN.
  - `js/shop.js`: Clean React JSX component demonstrating `useState`, `useEffect`, `.filter()`, and `.map()`.
  - `images/`: High quality e-commerce product photos for shirts and pants.
  - `index.html` & `signup.html`: Vanilla authentication pages.

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (optional for `/shop`, required for `/signup` & `/login`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
PORT=3000
```

### 3. Run the Server
```bash
node server.js
```
- Open Storefront: `http://localhost:3000/shop`
- Open Login: `http://localhost:3000/`
- Open Signup: `http://localhost:3000/signup`
