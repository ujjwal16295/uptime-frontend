import { createSlice } from "@reduxjs/toolkit";

const planSlice = createSlice({
  name: 'plan',
  initialState: {
    value: 'free', // default value
  },
  reducers: {
    setPlan: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setPlan } = planSlice.actions;
export default planSlice.reducer;