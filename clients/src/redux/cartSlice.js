import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE}/api/cart`;

// Helper to get headers with token from state
const getHeaders = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Helper to safely parse JSON from response
const safeParseJSON = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    return { message: text || "Server returned an invalid response" };
  }
};

const calculateTotals = (cartItems) => {
  const { total, quantity } = (cartItems || []).reduce(
    (cartTotal, cartItem) => {
      const product = cartItem?.productId;
      if (!product) return cartTotal;

      const price =
        typeof product.price === "string"
          ? parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
          : product.price;
      const itemTotal = (price || 0) * (cartItem.quantity || 1);
      cartTotal.total += itemTotal;
      cartTotal.quantity += cartItem.quantity || 1;
      return cartTotal;
    },
    { total: 0, quantity: 0 },
  );

  return {
    total: parseFloat(total.toFixed(2)),
    quantity,
  };
};

// Async Thunks using fetch
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(API_URL, {
        headers: getHeaders(thunkAPI),
      });
      const data = await safeParseJSON(response);
      if (!response.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch cart");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (itemData, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: getHeaders(thunkAPI),
        body: JSON.stringify(itemData),
      });
      const data = await safeParseJSON(response);
      if (!response.ok)
        return thunkAPI.rejectWithValue(
          data.message || "Failed to add to cart",
        );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/remove/${productId}`, {
        method: "DELETE",
        headers: getHeaders(thunkAPI),
      });
      const data = await safeParseJSON(response);
      if (!response.ok)
        return thunkAPI.rejectWithValue(
          data.message || "Failed to remove from cart",
        );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getTotals(state) {
      const totals = calculateTotals(state.cartItems);
      state.cartTotalQuantity = totals.quantity;
      state.cartTotalAmount = totals.total;
    },
    addToCartLocal(state, action) {
      const { product, quantity } = action.payload;
      const items = state.cartItems || [];
      const index = items.findIndex(
        (item) =>
          item.productId?._id === product?._id ||
          item.productId === product?._id,
      );

      if (index > -1) {
        items[index].quantity += quantity;
        if (items[index].quantity <= 0) {
          items.splice(index, 1);
        }
      } else if (quantity > 0) {
        items.push({ productId: product, quantity });
      }

      state.cartItems = items;
      const totals = calculateTotals(state.cartItems);
      state.cartTotalQuantity = totals.quantity;
      state.cartTotalAmount = totals.total;
    },
    updateCartQuantityLocal(state, action) {
      const { productId, change } = action.payload;
      const items = state.cartItems || [];
      const index = items.findIndex(
        (item) =>
          item.productId?._id === productId || item.productId === productId,
      );

      if (index > -1) {
        items[index].quantity += change;
        if (items[index].quantity <= 0) {
          items.splice(index, 1);
        }
      }

      state.cartItems = items;
      const totals = calculateTotals(state.cartItems);
      state.cartTotalQuantity = totals.quantity;
      state.cartTotalAmount = totals.total;
    },
    removeFromCartLocal(state, action) {
      const productId = action.payload;
      const items = (state.cartItems || []).filter(
        (item) =>
          item.productId?._id !== productId && item.productId !== productId,
      );
      state.cartItems = items;
      const totals = calculateTotals(state.cartItems);
      state.cartTotalQuantity = totals.quantity;
      state.cartTotalAmount = totals.total;
    },
    clearCartLocal(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const items = action.payload?.items || [];
        state.cartItems = items;
        state.cartTotalAmount = action.payload?.totalPrice || 0;
        state.cartTotalQuantity = items.reduce(
          (acc, item) => acc + (item.quantity || 0),
          0,
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add / Update
      .addCase(addToCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const items = action.payload?.items || [];
        state.cartItems = items;
        state.cartTotalAmount = action.payload?.totalPrice || 0;
        state.cartTotalQuantity = items.reduce(
          (acc, item) => acc + (item.quantity || 0),
          0,
        );
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove
      .addCase(removeFromCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        const items = action.payload?.items || [];
        state.cartItems = items;
        state.cartTotalAmount = action.payload?.totalPrice || 0;
        state.cartTotalQuantity = items.reduce(
          (acc, item) => acc + (item.quantity || 0),
          0,
        );
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  getTotals,
  addToCartLocal,
  updateCartQuantityLocal,
  removeFromCartLocal,
  clearCartLocal,
} = cartSlice.actions;
export default cartSlice.reducer;
