import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import categorySlice from './slices/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categorySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
