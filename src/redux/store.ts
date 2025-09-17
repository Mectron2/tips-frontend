import { configureStore } from '@reduxjs/toolkit';
import { billsSlice } from './bills/slices/billsSlice.ts';
import currenciesSlice from './currrencies/slices/currencySlice.ts';
import dishesSlice from "./dishes/slices/DishSlice.ts";

const store = configureStore({
    reducer: {
        bills: billsSlice.reducer,
        currencies: currenciesSlice.reducer,
        dishes: dishesSlice.reducer,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
