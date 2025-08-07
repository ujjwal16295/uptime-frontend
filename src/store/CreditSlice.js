import { createSlice } from "@reduxjs/toolkit"

// Helper functions for session storage
const saveToSessionStorage = (state) => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
        return;
    }
    
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem('creditState', serializedState);
    } catch (error) {
        console.warn('Could not save credit state to session storage:', error);
    }
};

const loadFromSessionStorage = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
        return {
            creditDetails: 21600,
            success: false
        };
    }
    
    try {
        const serializedState = sessionStorage.getItem('creditState');
        if (serializedState === null) {
            return {
                creditDetails: 21600,
                success: false
            };
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.warn('Could not load credit state from session storage:', error);
        return {
            creditDetails: 21600,
            success: false
        };
    }
};

// Load initial state from session storage
const initialState = loadFromSessionStorage();

const CreditSlice = createSlice({
    name: "credit",
    initialState,
    reducers: {
        ChangeCredit(state, action) {
            // Expect payload to be an object with creditDetails and success
            if (typeof action.payload === 'object' && action.payload !== null) {
                state.creditDetails = action.payload.creditDetails;
                state.success = action.payload.success;
            } else {
                // Backward compatibility: if just a number is passed
                state.creditDetails = action.payload;
            }
            
            // Save to session storage after each update
            saveToSessionStorage({
                creditDetails: state.creditDetails,
                success: state.success
            });
        },
        ResetCreditState(state) {
            state.creditDetails = 21600;
            state.success = false;
            
            // Save to session storage after reset
            saveToSessionStorage({
                creditDetails: state.creditDetails,
                success: state.success
            });
        }
    }
})

export default CreditSlice.reducer;
export const { ChangeCredit, ResetCreditState } = CreditSlice.actions;