import { configureStore } from "@reduxjs/toolkit";
import CreditSlice from "./CreditSlice";
import PlanSlice from "./PlanSlice";

const store = configureStore({
  reducer: {
    credit: CreditSlice,
    plan: PlanSlice,
  }
});

export default store;