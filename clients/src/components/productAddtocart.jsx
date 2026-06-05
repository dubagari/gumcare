import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, addToCartLocal } from "../redux/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAdd = () => {
    if (!user) {
      dispatch(addToCartLocal({ product, quantity: 1 }));
      return;
    }
    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>

      <button onClick={handleAdd}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
