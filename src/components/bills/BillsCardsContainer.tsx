import { BillsCards } from "./BillsCards.tsx";
import React, { useEffect, useState } from "react";
import type { Bill } from "./types.tsx";

type HolderProps = {
    bills?: Bill[];
    title?: string;
    emptyMessage?: string;
    currency?: string;
    className?: string;
};

export const BillsCardsContainer: React.FC<HolderProps> = ({ title = "Bills", emptyMessage = "There are no bills", currency = "USD" }) => {
    const [billsArray, setBillsArray] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/bills")
            .then((response) => response.json())
            .then((json) => setBillsArray(json))
            .catch((err) => console.error("Error loading bills:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        loading ? <div className="text-center p-6">Loading...</div> :
        <section className={`max-w-3xl mx-auto p-6`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <div className="text-sm text-slate-500">Total: {Array.isArray(billsArray) ? billsArray.length : 0}</div>
            </div>

            {Array.isArray(billsArray) && billsArray.length > 0 ? (
                <BillsCards bills={billsArray} currency={currency} />
            ) : (
                <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-slate-500">{emptyMessage}</div>
            )}
        </section>
    );
};

export default BillsCardsContainer;