const item = cart.items.find(
  (i) => i.productId.toString() === productId
);

if (item) {
  item.quantity += quantity;

  if (item.quantity <= 0) {
    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );
  }
} else {
  cart.items.push({ productId, quantity });
}


cart.totalPrice = 0;

for (const item of cart.items) {
  const product = await Product.findById(item.productId);
  cart.totalPrice += product.price * item.quantity;
}