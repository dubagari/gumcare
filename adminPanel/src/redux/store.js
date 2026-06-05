import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';

import cartReducer from './cartSlice';
import productReducer from './productSlice';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import orderReducer from './orderSlice';

// Custom storage for Vite
const customStorage = {
  getItem: (key) => {
    return Promise.resolve(window.localStorage.getItem(key));
  },

  setItem: (key, value) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve(value);
  },

  removeItem: (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: customStorage,
  whitelist: ['cart', 'auth'],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productReducer,
  auth: authReducer,
  admin: adminReducer,
  orders: orderReducer,
});

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);