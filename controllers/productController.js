const productMock = require("../mock/data.json");

exports.getAllProducts = async (req, res) => {
  res.json({ products: productMock.products });
};

exports.getProductId = async (req, res) => {
  const { id } = req.params;
  const product = productMock.products.find((p) => p.id === parseInt(id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ product });
};

exports.updateProduct = async (req, res) => {
  // Implementation for updating a product
  res.json({ message: "Product updated successfully" });
};

exports.deleteProduct = async (req, res) => {
  res.json({ message: "Product deleted successfully" });
};

exports.addProduct = async (req, res) => {
  res.json({ message: "Product added successfully" });
};
