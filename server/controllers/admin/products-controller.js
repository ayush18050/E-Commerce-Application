const { imageUploadUtil } = require("../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:"+req.file.mimetype+";base64,"+b64;
        const dataURI = url;
        const result = await imageUploadUtil(dataURI);
        res.json({ 
            success: true,
            message: 'Image uploaded successfully',
            result
         });
    } catch (err) {
        res.json({ 
            success: false,
            message: 'Image upload failed',
            error: err.message
         });
         ;
    }
};

const addProduct = async (req, res) => {
    try {
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
        const newProduct = new Product({
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock
        });
        await newProduct.save();
        res.status(201).json({ 
            success: true,
            message: 'Product added successfully',
            data: newProduct
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to add product',
            error: err.message
        });
    }
};

const fetchAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ 
            success: true,
            message: 'Products fetched successfully',
            data: products
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch products',
            error: err.message
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
        let updatedProduct = await Product.findById(id);
        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found'
            });
        }
        updatedProduct.image = image || updatedProduct.image;
        updatedProduct.title = title || updatedProduct.title;
        updatedProduct.description = description || updatedProduct.description;
        updatedProduct.category = category || updatedProduct.category;
        updatedProduct.brand = brand || updatedProduct.brand;
        updatedProduct.price = price == '' ? 0 : price || updatedProduct.price;
        updatedProduct.salePrice = salePrice == '' ? 0 : salePrice || updatedProduct.salePrice;
        updatedProduct.totalStock = totalStock || updatedProduct.totalStock;

        await updatedProduct.save();
        res.json({ 
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });

    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to update product',
            error: err.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found'
            });
        }

        res.json({ 
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete product',
            error: err.message
        });
    }
};


module.exports = {
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct
};