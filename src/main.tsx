import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';

import './index.css';
import BillsCardsContainer from './components/bills/BillsCardsContainer';
import { BillPageContainer } from './components/bills/BillPageContainer';
import store, { type AppDispatch } from './redux/store';
import { fetchCurrencies } from './redux/currrencies/slices/currencySlice';

export const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchCurrencies());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BillsCardsContainer />} />
                <Route path="/bills/:id" element={<BillPageContainer />} />
            </Routes>
        </BrowserRouter>
    );
};

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <App />
        </StrictMode>
    </Provider>
);
