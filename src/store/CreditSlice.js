import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    creditDetails: 21600,
    success: false
}

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
        },
        ResetCreditState(state) {
            state.creditDetails = 21600;
            state.success = false;
        }
    }
})

export default CreditSlice.reducer;
export const { ChangeCredit, ResetCreditState } = CreditSlice.actions;