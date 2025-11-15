const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // parse JSON

// Sample products API
app.get("/products", (req, res) => {
  const products = [
    { id: 1, name: "T-Shirt", price: 500, img: "box1.png" },
    { id: 2, name: "Jeans", price: 700, img: "box2.png" }
  ];
  res.json(products);
});

// Sample cart API
app.post("/cart", (req, res) => {
  const { productId } = req.body;
  res.json({ message: `Product ${productId} added to cart!` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
