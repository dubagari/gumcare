import Product from "../models/Product.js";

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, countInStock, brand, category } = req.body;
        let images = req.body.images || [];

        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path.replace(/\\/g, "/"));
        }

       const product = new Product({
  name,
  description,
  price,
  countInStock,
  brand,
  category,
  images,
});

const savedProduct = await product.save();
      res.status(201).json(savedProduct);
      
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => file.path.replace(/\\/g, "/"));
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all unique categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};