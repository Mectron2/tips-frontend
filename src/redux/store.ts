import { configureStore } from "@reduxjs/toolkit";
import {billsSlice} from "./bills/slices/billsSlice.ts";

const store = configureStore({
    reducer: {
        bills: billsSlice.reducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;