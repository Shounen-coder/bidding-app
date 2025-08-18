import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
// import categorySlice from './slices/categorySlice';
import auctionSlice from './slices/auctionSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    // categories: categorySlice,
    auctions: auctionSlice,
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
