import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Bill } from "../../../components/bills/types";

export const loadBills = createAsyncThunk<Bill[]>(
    "bills/load",
    async () => {
        const res = await fetch("http://localhost:3000/bills");
        if (!res.ok) throw new Error("Failed to fetch bills");
        return (await res.json()) as Bill[];
    }
);

export const deleteBill = createAsyncThunk<number, number>(
    "bills/delete",
    async (id: number) => {
        const res = await fetch(`http://localhost:3000/bills/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete bill");
        return id;
    }
);

export const createBill = createAsyncThunk<Bill, { amount: string, tipPercent: string }>(
    "bills/create",
    async (bill: { amount: string, tipPercent: string }) => {
        const res = await fetch("http://localhost:3000/bills", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: parseFloat(bill.amount),
                tipPercent: parseFloat(bill.tipPercent) / 100,
            }),
        });
        if (!res.ok) throw new Error("Failed to create bill");
        return (await res.json() as Bill);
    }
);

interface BillsState {
    items: Bill[];
    loading: boolean;
    error: string | null;
}

const initialState: BillsState = {
    items: [],
    loading: false,
    error: null,
};

export const billsSlice = createSlice({
    name: "bills",
    initialState,
    reducers: {
        addBill: (state, action) => {
            state.items.push(action.payload);
        },
        removeBill: (state, action) => {
            state.items = state.items.filter((bill) => bill.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadBills.pending, (state: BillsState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadBills.fulfilled, (state: BillsState, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(loadBills.rejected, (state: BillsState, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Error loading bills";
            })
            .addCase(deleteBill.pending, (state: BillsState) => {
                state.loading = true;
            })
            .addCase(deleteBill.fulfilled, (state: BillsState, action) => {
                state.loading = false;
                state.items = state.items.filter((bill) => bill.id !== action.payload);
            })
            .addCase(deleteBill.rejected, (state: BillsState, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Error deleting bill";
            })
            .addCase(createBill.pending, (state: BillsState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBill.fulfilled, (state: BillsState, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createBill.rejected, (state: BillsState, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Error creating bill";
            });
    },
});

export const { addBill, removeBill } = billsSlice.actions;
export default billsSlice.reducer;
