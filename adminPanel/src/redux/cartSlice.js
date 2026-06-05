import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/cart';

// Helper to get headers with token from state
const getHeaders = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Async Thunks using fetch
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const response = await fetch(API_URL, {
      headers: getHeaders(thunkAPI),
    });
    const data = await response.json();
    if (!response.ok) return thunkAPI.rejectWithValue(data.message);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const addToCartAsync = createAsyncThunk('cart/addToCart', async (itemData, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: getHeaders(thunkAPI),
      body: JSON.stringify(itemData),
    });
    const data = await response.json();
    if (!response.ok) return thunkAPI.rejectWithValue(data.message);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const removeFromCartAsync = createAsyncThunk('cart/removeFromCart', async (productId, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/remove/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(thunkAPI),
    });
    const data = await response.json();
    if (!response.ok) return thunkAPI.rejectWithValue(data.message);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Keep local actions for non-logged in users if needed, 
    // but we will prioritize backend state
    getTotals(state) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          // Check if cartItem.productId is populated or not
          const product = cartItem.productId;
          if (!product) return cartTotal;

          const price = typeof product.price === 'string' 
            ? parseFloat(product.price.replace(/[^0-9.-]+/g,"")) 
            : product.price;
            
          const itemTotal = price * cartItem.quantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartItem.quantity;

          return cartTotal;
        },
        { total: 0, quantity: 0 }
      );
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
    clearCartLocal(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items;
        state.cartTotalAmount = action.payload.totalPrice;
        state.cartTotalQuantity = action.payload.items.reduce((acc, item) => acc + item.quantity, 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add / Update
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.cartTotalAmount = action.payload.totalPrice;
        state.cartTotalQuantity = action.payload.items.reduce((acc, item) => acc + item.quantity, 0);
      })
      // Remove
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.cartTotalAmount = action.payload.totalPrice;
        state.cartTotalQuantity = action.payload.items.reduce((acc, item) => acc + item.quantity, 0);
      });
  },
});

export const { getTotals, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
