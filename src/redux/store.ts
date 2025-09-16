import { configureStore } from "@reduxjs/toolkit";
import {billsSlice} from "./bills/slices/billsSlice.ts";
import currenciesSlice from "./currrencies/slices/currencySlice.ts";

const store = configureStore({
    reducer: {
        bills: billsSlice.reducer,
        currencies: currenciesSlice.reducer,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;