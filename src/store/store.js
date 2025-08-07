import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Use sessionStorage
import CreditSlice from "./CreditSlice";

// Persist configuration
const persistConfig = {
    key: 'root',
    storage, // This uses sessionStorage
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