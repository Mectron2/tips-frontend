import React from 'react';
import type { BillDto } from './types.tsx';
import { AddParticipants } from '../participants/AddParticipants.tsx';
import { formatCurrency } from '../../utils/currencyFuncs.ts';

interface BillPageProps {
    bill: BillDto;
    onReload: () => void;
}

export const BillPage: React.FC<BillPageProps> = ({ bill, onReload }) => {
    const [isInEditMode, setIsInEditMode] = React.useState(false);

    const [editedAmount, setEditedAmount] = React.useState<number>(bill.amountInSpecifiedCurrency);
    const [editedTipPercent, setEditedTipPercent] = React.useState<number | null>(bill.tipPercent);

    const handleSave = async () => {
        await fetch(`http://localhost:3000/bills/${bill.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: editedAmount,
                tipPercent: editedTipPercent ? editedTipPercent / 100 : 0,
                currencyId: bill.currency.id,
            }),
        });
        onReload();
        setIsInEditMode(false);
    };

    const totalInSpecifiedCurrency =
        bill.tipPercent !== null
            ? bill.amountInSpecifiedCurrency * (1 + bill.tipPercent)
            : bill.amountInSpecifiedCurrency;

    return (
        <div className="max-w-4xl mx-auto p-6 relative">
            <button
                onClick={() => setIsInEditMode(!isInEditMode)}
                className="absolute right-8 top-8"
            >
                {isInEditMode ? 'Cancel' : 'Edit'}
            </button>

            <div className="bg-gray-800 shadow rounded-2xl p-6 mb-8">
                <h1 className="text-2xl font-bold mb-1">
                    Bill <span className="text-blue-600">#{bill.id}</span>
                </h1>
                <p className="text-xs text-slate-400 mb-4">
                    Currency: <span className="font-medium">{bill.currency.symbol}</span>
                    {' · '}
                    {bill.currency.name}
                </p>

                <div className="space-y-2 mb-6">
                    <p className="text-sm text-slate-100">
                        {isInEditMode ? (
                            <input
                                type="number"
                                step="0.01"
                                defaultValue={bill.amountInSpecifiedCurrency.toFixed(2)}
                                className="bg-gray-700 text-white rounded px-2 py-1 w-40 text-right"
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setEditedAmount(Number.isNaN(v) ? 0 : v);
                                }}
                            />
                        ) : (
                            <span className="font-medium">
                                Amount:{' '}
                                {formatCurrency(
                                    bill.amountInSpecifiedCurrency,
                                    bill.currency.symbol
                                )}
                            </span>
                        )}
                    </p>

                    <p className="text-sm text-slate-100">
                        {bill.dish ? (
                            <span className="font-medium">Dish: {bill.dish.name}</span>
                        ) : (
                            <span className="italic text-slate-400">No dish specified</span>
                        )}
                    </p>

                    {bill.tipPercent !== null && (
                        <p className="text-sm text-slate-100">
                            {isInEditMode ? (
                                <input
                                    type="number"
                                    step="0.01"
                                    defaultValue={(bill.tipPercent * 100).toString()}
                                    className="bg-gray-700 text-white rounded px-2 py-1 w-28 text-right"
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        setEditedTipPercent(Number.isNaN(v) ? 0 : v);
                                    }}
                                />
                            ) : (
                                <span className="font-medium">
                                    Tip Percent: {(bill.tipPercent * 100).toFixed(2)}%
                                </span>
                            )}
                        </p>
                    )}

                    {isInEditMode && (
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Save
                        </button>
                    )}

                    <p className="text-sm text-slate-100">
                        <span className="font-medium">Total Amount:</span>{' '}
                        {formatCurrency(totalInSpecifiedCurrency, bill.currency.symbol)}
                    </p>

                    <p className="text-xs text-slate-400">
                        Created: {new Date(bill.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">
                        Updated: {new Date(bill.updatedAt).toLocaleString()}
                    </p>
                </div>

                <h2 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-4">
                    Participants
                </h2>

                {bill.participants && bill.participants.length > 0 ? (
                    <ul className="divide-y divide-slate-700">
                        {bill.participants.map((participant) => (
                            <li
                                key={participant.id}
                                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            >
                                <span className="font-medium text-slate-100">
                                    {participant.name}
                                </span>

                                <div className="text-sm text-slate-400 flex flex-wrap gap-x-4 gap-y-1 mt-1 sm:mt-0">
                                    {participant.customPercent !== undefined && (
                                        <span>
                                            Declared: {(participant.customPercent * 100).toFixed(2)}
                                            %
                                        </span>
                                    )}

                                    {participant.customAmount !== undefined && (
                                        <span>
                                            Declared:{' '}
                                            {formatCurrency(
                                                participant.customAmount,
                                                participant.currency.symbol
                                            )}
                                        </span>
                                    )}

                                    {participant.totalAmount !== undefined && (
                                        <span>
                                            Total:{' '}
                                            {formatCurrency(
                                                participant.totalAmountInSpecifiedCurrency || participant.totalAmount,
                                                participant.currency.symbol || bill.currency.symbol
                                            )}
                                        </span>
                                    )}

                                    {participant.effectivePercent !== undefined && (
                                        <span>
                                            Effective:{' '}
                                            {(participant.effectivePercent * 100).toFixed(2)}%
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 italic">No participants found.</p>
                )}
            </div>

            <AddParticipants
                tipsPercent={bill.tipPercent}
                billAmount={bill.amountInSpecifiedCurrency}
                billCurrency={bill.currency}
                initialParticipants={bill.participants?.map((p) => ({
                    id: p.id,
                    billId: bill.id,
                    name: p.name,
                    customPercent: p.customPercent ?? null,
                    customAmount: p.customAmount ?? null,
                    currencyId: p.currency.id,
                }))}
                billId={bill.id}
                onReload={onReload}
            />
        </div>
    );
};
