const Product = require("../../models/Product");
const Cart = require("../../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log("addToCart called with:", { userId, productId, quantity });
    // Validate input
    if (!userId || !productId || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID or quantity" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Product added to cart successfully", data: cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding to cart",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "image title price salePrice"
    });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    const validCartItems = cart.items.filter(item => item.productId !== null);
    if (validCartItems.length < cart.items.length) {
        cart.items = validCartItems;
        await cart.save();
    }

    const populateCartItems = cart.items.map(item => ({
        productId: item.productId._id,
        title: item.productId.title,
        image: item.productId.image,
        price: item.productId.price,
        salePrice: item.productId.salePrice,
        quantity: item.quantity
    }));


    res.status(200).json({ success: true, data: {
        ...cart._doc,
        items: populateCartItems
    } });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching cart items",
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    console.log("req",req.body)
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID or quantity" });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice"
    });
    const populateCartItems = cart.items.map(item => ({
      productId: item.productId ? item.productId._id : null,
      title: item.productId ? item.productId.title : 'Product Not Found',
      image: item.productId ? item.productId.image : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity
    }));


    res.status(200).json({ success: true, message: "Cart item updated successfully", data: {
        ...cart._doc,
        items: populateCartItems
    } });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating cart item",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and Product ID are required" });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice"
    });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => {
        return item.productId._id.toString() == productId},
    );
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice"
    });
    const populateCartItems = cart.items.map(item => ({
      productId: item.productId ? item.productId._id : null,
      title: item.productId ? item.productId.title : 'Product Not Found',
      image: item.productId ? item.productId.image : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity
    }));

    res.status(200).json({ success: true, message: "Product removed from cart successfully", data: {
        ...cart._doc,
        items: populateCartItems
    } });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing from cart",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItem,
  deleteCartItem
};

