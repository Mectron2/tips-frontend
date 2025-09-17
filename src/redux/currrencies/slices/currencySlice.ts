import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
    createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '../../store';

type ApiCurrency = {
    id: number;
    name: string;
    symbol: string;
    exchangeRate: string;
    createdAt: string;
    updatedAt: string;
};

export type Currency = {
    id: number;
    name: string;
    symbol: string;
    exchangeRate: number;
    createdAt: string;
    updatedAt: string;
};

type CurrenciesState = {
    byId: Record<number, Currency>;
    allIds: number[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    lastFetched: number | null;
};

const initialState: CurrenciesState = {
    byId: {},
    allIds: [],
    status: 'idle',
    error: null,
    lastFetched: null,
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const CACHE_TTL_MS = 5 * 60 * 1000;

const mapApiToCurrency = (c: ApiCurrency): Currency => ({
    ...c,
    exchangeRate: Number(c.exchangeRate),
});

export const fetchCurrencies = createAsyncThunk<
    Currency[],
    void,
    { state: RootState; rejectValue: string }
>(
    'currencies/fetchAll',
    async (_, { signal, rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}/currency`, { signal });
            if (!res.ok) {
                return rejectWithValue(`HTTP ${res.status}`);
            }
            const data = (await res.json()) as ApiCurrency[];
            return data.map(mapApiToCurrency);
        } catch (e) {
            // @ts-expect-error e is unknown
            return rejectWithValue(e.message ?? 'Network error');
        }
    },
    {
        condition: (_, { getState }) => {
            const { status, lastFetched } = (getState() as RootState).currencies;
            if (status === 'loading') return false;
            return !(lastFetched && Date.now() - lastFetched < CACHE_TTL_MS);
        },
    }
);

const currenciesSlice = createSlice({
    name: 'currencies',
    initialState,
    reducers: {
        invalidate(state) {
            state.lastFetched = null;
            if (state.status === 'succeeded') {
                state.status = 'idle';
            }
        },
        upsertMany(state, action: PayloadAction<Currency[]>) {
            action.payload.forEach((c) => {
                state.byId[c.id] = c;
                if (!state.allIds.includes(c.id)) state.allIds.push(c.id);
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrencies.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCurrencies.fulfilled, (state, action: PayloadAction<Currency[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.lastFetched = Date.now();

                state.byId = {};
                state.allIds = [];
                for (const c of action.payload) {
                    state.byId[c.id] = c;
                    state.allIds.push(c.id);
                }
            })
            .addCase(fetchCurrencies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Unknown error';
            });
    },
});

export const { invalidate, upsertMany } = currenciesSlice.actions;
export default currenciesSlice;

export const selectCurrenciesState = (state: RootState) => state.currencies;

export const selectAllCurrencies = createSelector([selectCurrenciesState], (s) =>
    s.allIds.map((id) => s.byId[id])
);
