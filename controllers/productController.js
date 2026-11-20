const path = require('path');

// In-memory mock product catalog (no database required)
// 6 total items: 3 Shirts and 3 Pants
const products = [
  {
    id: 1,
    name: "Classic White Oxford Shirt",
    category: "Shirts",
    price: 39.99,
    size: "M",
    imageUrl: "/images/shirt-1.png"
  },
  {
    id: 2,
    name: "Casual Navy Linen Shirt",
    category: "Shirts",
    price: 44.99,
    size: "L",
    imageUrl: "/images/shirt-2.png"
  },
  {
    id: 3,
    name: "Olive Green Flannel Shirt",
    category: "Shirts",
    price: 49.99,
    size: "M",
    imageUrl: "/images/shirt-3.png"
  },
  {
    id: 4,
    name: "Slim-Fit Khaki Chinos",
    category: "Pants",
    price: 54.99,
    size: "32x32",
    imageUrl: "/images/pant-1.png"
  },
  {
    id: 5,
    name: "Charcoal Tailored Trousers",
    category: "Pants",
    price: 59.99,
    size: "34x32",
    imageUrl: "/images/pant-2.png"
  },
  {
    id: 6,
    name: "Dark Wash Slim Denim Jeans",
    category: "Pants",
    price: 64.99,
    size: "32x32",
    imageUrl: "/images/pant-3.png"
  }
];

// GET /api/products - Returns the product list as JSON
exports.getProducts = (req, res) => {
  res.json(products);
};

// GET /shop - Serves the React storefront HTML page
exports.renderShopPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'shop.html'));
};

