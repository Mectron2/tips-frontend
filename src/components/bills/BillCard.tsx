import React, { memo } from "react";
import type {Bill} from "./types";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteBill} from "../../redux/bills/slices/billsSlice.ts";
import type {AppDispatch} from "../../redux/store.ts";

type Props = {
    bill: Bill;
    currency: string;
};

function formatCurrency(value: number, currency = "EUR") {
    if (!isFinite(value)) return "—";
    return new Intl.NumberFormat("ua-UA", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(value);
}

function formatPercent(p: number) {
    if (!isFinite(p)) return "—";
    return `${(p * 100).toFixed(0)}%`;
}

function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

export const BillCard: React.FC<Props> = memo(({ bill, currency }) => {
    const amount = Number(bill.amount) * Number(bill.currency.exchangeRate);
    const tipPercent = parseFloat(bill.tipPercent ?? "0") || 0;
    const tipAmountComputed = amount * tipPercent;
    const participantsCount = Array.isArray(bill.participants) ? bill.participants.length : 0;
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    return (
        <article className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4 flex flex-col justify-between w-full relative"
                 onClick={() => navigate(`/bills/${bill.id}`)}>
            <button className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                    aria-label="Remove participant"
                onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteBill(bill.id))}
            }>×</button>
            <header className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-lg font-semibold">Bill #{bill.id}</h3>
                    <div className="text-xs text-slate-500">Created: {formatDate(bill.createdAt)}</div>
                    <div className="text-xs text-slate-400">Updated: {formatDate(bill.updatedAt)}</div>
                </div>
            </header>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">Amount</div>
                    <div className="font-medium">{formatCurrency(amount, currency)}</div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">Tips</div>
                    <div className="text-sm">
                        {formatPercent(tipPercent)} · {formatCurrency(tipAmountComputed, currency)}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">Participants</div>
                    <div className="font-medium">{participantsCount}</div>
                </div>
            </div>
        </article>
    );
});

export default BillCard;
