import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
    createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '../../store';

type ApiDish = {
    id: number;
    name: string;
    price: string;
    createdAt: string;
    updatedAt: string;
};

export type Dish = {
    id: number;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
};

type DishesState = {
    byId: Record<number, Dish>;
    allIds: number[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    lastFetched: number | null;
};

const initialState: DishesState = {
    byId: {},
    allIds: [],
    status: 'idle',
    error: null,
    lastFetched: null,
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const CACHE_TTL_MS = 5 * 60 * 1000;

const mapApiToDish = (d: ApiDish): Dish => ({
    ...d,
    price: Number(d.price),
});

export const fetchDishes = createAsyncThunk<
    Dish[],
    void,
    { state: RootState; rejectValue: string }
>(
    'dishes/fetchAll',
    async (_, { signal, rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}/dishes`, { signal });
            if (!res.ok) {
                return rejectWithValue(`HTTP ${res.status}`);
            }
            const data = (await res.json()) as ApiDish[];
            return data.map(mapApiToDish);
        } catch (e) {
            // @ts-expect-error e is unknown
            return rejectWithValue(e.message ?? 'Network error');
        }
    },
    {
        condition: (_, { getState }) => {
            const { status, lastFetched } = (getState() as RootState).dishes;
            if (status === 'loading') return false;
            return !(lastFetched && Date.now() - lastFetched < CACHE_TTL_MS);
        },
    }
);

const dishesSlice = createSlice({
    name: 'dishes',
    initialState,
    reducers: {
        invalidate(state) {
            state.lastFetched = null;
            if (state.status === 'succeeded') {
                state.status = 'idle';
            }
        },
        upsertMany(state, action: PayloadAction<Dish[]>) {
            action.payload.forEach((d) => {
                state.byId[d.id] = d;
                if (!state.allIds.includes(d.id)) state.allIds.push(d.id);
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDishes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDishes.fulfilled, (state, action: PayloadAction<Dish[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.lastFetched = Date.now();

                state.byId = {};
                state.allIds = [];
                for (const d of action.payload) {
                    state.byId[d.id] = d;
                    state.allIds.push(d.id);
                }
            })
            .addCase(fetchDishes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Unknown error';
            });
    },
});

export const { invalidate, upsertMany } = dishesSlice.actions;
export default dishesSlice;

export const selectDishesState = (state: RootState) => state.dishes;

export const selectAllDishes = createSelector([selectDishesState], (s) =>
    s.allIds.map((id) => s.byId[id])
);
