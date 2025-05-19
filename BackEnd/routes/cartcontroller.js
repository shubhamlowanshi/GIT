const Cart = require('../model/Cartitem');

exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { name, price, imageUrl } = req.body;

  try {
    const item = await Cart.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.name = name;
    item.price = price;
    item.imageUrl = imageUrl;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
