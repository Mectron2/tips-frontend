import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import BillsCardsContainer from "./components/bills/BillsCardsContainer.tsx";
import { BillPageContainer } from "./components/bills/BillPageContainer.tsx";
import {Provider} from "react-redux";
import store from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BillsCardsContainer />} />

                    <Route path="/bills/:id" element={<BillPageContainer />} />
                </Routes>
            </BrowserRouter>
        </StrictMode>
    </Provider>
);
