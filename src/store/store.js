import { configureStore } from "@reduxjs/toolkit";
import CreditSlice from "./CreditSlice";

const store=configureStore({
    reducer:({
        credit:CreditSlice,
    })
})

export default store