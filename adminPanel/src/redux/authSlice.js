import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Register user
export const signupuser = createAsyncThunk(
  "auth/signupuser",
  async (user, thunkAPI) => {
    try {
      return await authService.signupuser(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    signinStart: (state) => {
      state.isLoading = true;
    },
    signinSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isError = false;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    signinFailure: (state, action) => {
      state.message = action.payload;
      state.isLoading = false;
      state.isError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupuser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signupuser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(signupuser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;

        localStorage.removeItem("user");
      });
  },
});

export const { reset, signinStart, signinSuccess, signinFailure } =
  authSlice.actions;
export default authSlice.reducer;
