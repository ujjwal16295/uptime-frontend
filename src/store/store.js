import { configureStore } from "@reduxjs/toolkit";
import PlanSlice from "./PlanSlice";

const store = configureStore({
  reducer: {
    plan: PlanSlice,
  }
});

export default store;