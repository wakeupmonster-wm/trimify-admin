// src/app/store/redux.store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { rootReducer } from "./rootReducers";

const persistConfig = {
  key: "root",
  storage,
  // You can add a whitelist/blacklist here if needed
  // blacklist: ['someHeavyDataSlice'] 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions for serializability check
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/REGISTER", "persist/FLUSH", "persist/PAUSE", "persist/PURGE"],
      },
    }),
});

export const persistor = persistStore(store);
