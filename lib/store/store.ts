import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';
import avatarReducer from './slices/avatarSlice';
import userReducer from './slices/userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      example: exampleReducer,
      avatar: avatarReducer,
      user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: [],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

