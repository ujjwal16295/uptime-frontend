import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import CreditSlice from "./CreditSlice";

// Create a custom storage that checks for browser environment
const createNoopStorage = () => {
    return {
        getItem(_key) {
            return Promise.resolve(null);
        },
        setItem(_key, value) {
            return Promise.resolve(value);
        },
        removeItem(_key) {
            return Promise.resolve();
        },
    };
};

// Use sessionStorage only on client side
const storage = typeof window !== "undefined" 
    ? require('redux-persist/lib/storage/session').default 
    : createNoopStorage();

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['credit'] // Only persist the credit slice
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, {
    credit: CreditSlice,
});

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };
export default store;