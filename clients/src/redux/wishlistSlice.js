import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE}/wishlist`;

// ====================
// HELPERS
// ====================
const normalizeProduct = (item) => item?.productId || item;

const normalizeItems = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload.map((i) => i.productId || i).filter(Boolean);
  }

  if (Array.isArray(payload.items)) {
    return payload.items.map((i) => i.productId || i).filter(Boolean);
  }

  return [];
};

// ====================
// FETCH WISHLIST
// ====================
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;

      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch wishlist",
        );
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ====================
// ADD TO WISHLIST
// ====================
export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlistAsync",
  async (productId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to add");
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);
// ====================
// REMOVE FROM WISHLIST
// ====================
export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlistAsync",
  async (productId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;

      const res = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to remove");
      }

      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ====================
// INITIAL STATE
// ====================
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// ====================
// SLICE
// ====================
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // LOCAL ADD
    addToWishlist(state, action) {
      const product = action.payload;

      // 🔒 GUARANTEE items is always an array
      if (!Array.isArray(state.items)) {
        state.items = [];
      }

      const id = product?._id || product?.id;
      if (!id) return;

      const exists = state.items.some((item) => (item?._id || item?.id) === id);

      if (!exists) {
        state.items.push({
          ...product,
          _id: id,
          id: id,
        });
      }
    },

    // LOCAL REMOVE
    removeFromWishlist(state, action) {
      const id = action.payload;

      state.items = state.items.filter(
        (item) => (item?._id || item?.id) !== id,
      );
    },

    clearWishlist(state) {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeItems(action.payload);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })

      // ADD
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items = normalizeItems(action.payload);
      })

      // REMOVE
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        const id = action.payload;

        state.items = state.items.filter(
          (item) => (item?._id || item?.id) !== id,
        );
      });
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
