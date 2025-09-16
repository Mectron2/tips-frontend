import React from "react";
import type { ParticipantCalculation } from "./types";
import { formatCurrency } from "../../utils/currencyFuncs";
import { useSelector } from "react-redux";
import { selectAllCurrencies } from "../../redux/currrencies/slices/currencySlice.ts";

type CurrencyDto = {
    id: number;
    symbol: string;
    name: string;
    exchangeRate: number | string;
};

interface ParticipantCardProps {
    participant: ParticipantCalculation & { currencyId: number };
    billCurrency: CurrencyDto;
    onChange: (
        participantId: number,
        data: {
            name?: string;
            customPercent?: number | null;
            customAmount?: number | null;
            currencyId?: number;
        }
    ) => void;
    onRemove?: (participantId: number) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
                                                                    participant,
                                                                    billCurrency,
                                                                    onChange,
                                                                    onRemove,
                                                                }) => {
    const currencies = useSelector(selectAllCurrencies) ?? [];

    const rate = (id: number) =>
        Number(currencies.find((c) => c.id === id)?.exchangeRate ?? 1);
    const toBase = (amount: number, currencyId: number) => amount / rate(currencyId);
    const baseTo = (amountBase: number, currencyId: number) => amountBase * rate(currencyId);
    const convert = (amount: number, fromId: number, toId: number) =>
        baseTo(toBase(amount, fromId), toId);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(participant.id, { name: e.target.value });
    };

    const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.trim();
        const num = raw === "" ? null : Number(raw);
        const percentValue = num === null || Number.isNaN(num) ? null : num / 100;
        onChange(participant.id, {
            customPercent: percentValue,
            customAmount: raw !== "" ? null : participant.customAmount ?? null,
        });
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.trim();
        const amountValue = raw === "" ? null : Number(raw);
        onChange(participant.id, {
            customAmount: amountValue,
            customPercent: raw !== "" ? null : participant.customPercent ?? null,
        });
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(participant.id, { currencyId: Number(e.target.value) });
    };

    const percentInput =
        participant.customPercent !== null && participant.customPercent !== undefined
            ? String(participant.customPercent * 100)
            : "";

    const amountInput =
        participant.customAmount !== null && participant.customAmount !== undefined
            ? String(participant.customAmount)
            : "";

    const amountInParticipantCurrency = convert(
        participant.totalAmount,
        billCurrency.id,
        participant.currencyId
    );

    const participantCurrency =
        currencies.find((c) => c.id === participant.currencyId) ?? billCurrency;

    return (
        <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-4 space-y-3 relative">
            <button
                onClick={() => onRemove?.(participant.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                aria-label="Remove participant"
            >
                ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Name
                    </label>
                    <input
                        type="text"
                        value={participant.name ?? ""}
                        required
                        onChange={handleNameChange}
                        className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                        placeholder="Participant Name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Currency
                    </label>
                    <select
                        value={participant.currencyId}
                        onChange={handleCurrencyChange}
                        className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                    >
                        {currencies.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.symbol} · {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Custom %
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={percentInput}
                        onChange={handlePercentChange}
                        className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Fixed Amount ({participantCurrency.symbol})
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amountInput}
                        onChange={handleAmountChange}
                        className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional"
                    />
                </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-sm text-slate-600 dark:text-slate-400 flex justify-between">
                    <span>Payment due:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
            {formatCurrency(
                amountInParticipantCurrency,
                participantCurrency.symbol
            )}
          </span>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400 flex justify-between">
                    <span>Effective %:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
            {(participant.effectivePercent * 100).toFixed(2)}%
          </span>
                </div>
            </div>
        </div>
    );
};
