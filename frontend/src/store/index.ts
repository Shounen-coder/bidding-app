import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import categorySlice from './slices/categorySlice';
import auctionSlice from './slices/auctionSlice';
import profileSlice from './slices/profileSlice';
import sellerSlice from './slices/sellerSlice';
import orderSlice from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categorySlice,
    seller: sellerSlice,
    profile: profileSlice,
    auctions: auctionSlice,
    orders: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST','persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
