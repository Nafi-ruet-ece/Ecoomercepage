/**
 * ==============================================================================
 * AURA Men's Apparel Storefront (React Component)
 * ==============================================================================
 * 
 * Key React Concepts Explained in this file:
 * 1. useState:  Stores state variables (products, cart, filters) that trigger 
 *               automatic UI re-renders whenever they change.
 * 2. useEffect: Runs side-effects (like fetching /api/products from our Express 
 *               backend when the page first loads).
 * 3. .filter(): Standard JavaScript array method used to filter products based 
 *               on the selected category ("All", "Shirts", or "Pants").
 * 4. .map():    Iterates through the product array to turn each product data 
 *               object into a visual React JSX card element.
 * ==============================================================================
 */

const { useState, useEffect } = React;

function App() {
  // ----------------------------------------------------------------------------
  // 1. STATE MANAGEMENT (useState)
  // ----------------------------------------------------------------------------
  // products: Array of items fetched from GET /api/products
  const [products, setProducts] = useState([]);
  
  // activeCategory: Controls the active category tab ("All", "Shirts", "Pants")
  const [activeCategory, setActiveCategory] = useState("All");
  
  // cart: Array of items added to the cart, with their quantities
  const [cart, setCart] = useState([]);
  
  // isCartOpen: Boolean controlling whether the collapsible cart drawer is visible
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // loading: Indicates whether we are waiting for products to load from backend
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------------
  // 2. FETCHING DATA FROM BACKEND (useEffect)
  // ----------------------------------------------------------------------------
  // The empty dependency array [] tells React to run this function ONLY ONCE,
  // right after the component mounts on the screen.
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products from Express API:", err);
        setLoading(false);
      });
  }, []);

  // ----------------------------------------------------------------------------
  // 3. CART HELPER FUNCTIONS
  // ----------------------------------------------------------------------------
  // Adds a product to the cart or increments quantity if it already exists
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Automatically open the cart drawer so the user sees the update
  };

  // Decrement quantity or remove item if quantity drops to zero
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Completely removes an item from the cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Calculate total number of items in the cart
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price in the cart
  const totalPrice = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  // ----------------------------------------------------------------------------
  // 4. CATEGORY FILTERING (.filter)
  // ----------------------------------------------------------------------------
  // If activeCategory is "All", show all products.
  // Otherwise, filter items where item.category matches activeCategory.
  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* ==================== NAVBAR ==================== */}
      <nav className="navbar">
        <a href="/shop" className="brand">AURA MEN</a>
        
        <div className="nav-actions">
          <a href="/" className="nav-link">Login</a>
          <a href="/signup" className="nav-link">Sign Up</a>
          
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <span>Cart</span>
            <span className="cart-badge">{totalItemCount}</span>
          </button>
        </div>
      </nav>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="container">
        {/* Header Hero */}
        <section className="hero">
          <h1>Men's Apparel Storefront</h1>
          <p>Explore our premium collection of shirts and pants</p>
        </section>

        {/* Category Filter Tabs */}
        <div className="filters">
          {["All", "Shirts", "Pants"].map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <p style={{ textAlign: "center", color: "#6b7280", marginTop: "40px" }}>
            Loading products...
          </p>
        )}

        {/* ==================== 3-COLUMN PRODUCT GRID (.map) ==================== */}
        {/* We use .map() to loop through filteredProducts and render a card for each */}
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    // Fallback visual placeholder if image file is still generating
                    e.target.src = `https://placehold.co/400x350/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`;
                  }}
                />
              </div>

              <div className="product-details">
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                  <span className="product-size">Size: {product.size}</span>
                </div>

                <h3 className="product-name">{product.name}</h3>

                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button
                    className="btn-add-cart"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ==================== COLLAPSIBLE CART DRAWER ==================== */}
      {isCartOpen && (
        <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Shopping Cart ({totalItemCount})</h2>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                &times;
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart-message">Your cart is currently empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/100x100/e2e8f0/1e293b?text=${item.category}`;
                      }}
                    />
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <div className="cart-item-price">
                        ${item.price.toFixed(2)} &times; {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span className="qty-display">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span>Total:</span>
                  <span>${totalPrice}</span>
                </div>
                <button
                  className="btn-checkout"
                  onClick={() => alert(`Checkout demonstration! Total: $${totalPrice}`)}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Render the App component into the #root DOM node
ReactDOM.createRoot(document.getElementById('root')).render(<App />);

