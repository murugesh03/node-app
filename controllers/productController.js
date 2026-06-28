const productMock = require("../mock/data.json");
const productModel = require("../models/products");
const { uploadFile, getSignedFileUrl } = require("../services/s3Service");

//Loggers

exports.getAllProducts = async (req, res) => {
  // res.json({ products: productMock.products });
  try {
    const products = await productModel.find();
    res.json({ products });
  } catch (error) {
    console.log(error, "Error fetching products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.renderProductsList = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.render("products-list", { products });
  } catch (error) {
    console.log(error, "Error fetching products");
    return res.render("products-list", { products: [] });
  }
};

// userInfo={
//   name:'sam',
//   last:'raj',
//   profilePicture:{}
// }

// const formData = new FormData();

// for (const [key, value] of Object.entries(userInfo)) {
//   formData.append("profilePicture", value);
// }

exports.getProductId = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
    const product = await productModel.findOne({ id });
    console.log(product);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ product });
  } catch (error) {
    console.log(error, "Error fetching product");
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

exports.updateProduct = async (req, res) => {
  // Implementation for updating a product
  // res.json({ message: "Product updated successfully" });

  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const updates = req.body;
    const product = await productModel.findOneAndUpdate({ id }, updates, {
      returnDocument: "after",
      runValidators: true //optional
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.log(error, "Error updating product");
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  // res.json({ message: "Product deleted successfully" });
  const { id } = req.params;
  try {
    const deleteProduct = await productModel.findOneAndDelete({ id });
    const updatedProducts = await productModel.find();
    return res.status(200).json({
      message: "Product deleted successfully",
      products: updatedProducts
    });
  } catch (error) {
    console.log(error, "Error deleting product");
    res.status(500).json({ error: "Failed to delete product" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.file) {
      const key = `${Date.now()}-${req.file.originalname}`;
      await uploadFile(req.file, key);
      productData.imageUrl = await getSignedFileUrl(key);
    }

    const product = new productModel(productData);
    const addResponse = await product.save();
    console.log(addResponse);

    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.render("product-form", {
        message: "Product added successfully",
        success: true
      });
    }

    return res
      .status(201)
      .json({ message: "Product added successfully", product: addResponse });
  } catch (error) {
    console.log(error, "Error adding product");

    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.status(500).render("product-form", {
        message: "Failed to add product",
        success: false,
        error: true
      });
    }

    return res.status(500).json({ error: "Failed to add product" });
  }
};
