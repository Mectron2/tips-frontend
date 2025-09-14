import React from "react";
import type {ParticipantCalculation} from "./types.ts";

interface ParticipantCardProps {
    participant: ParticipantCalculation;
    onChange: (participantId: number, data: {
        name: string;
        customPercent?: number | null;
        customAmount?: number | null;
    }) => void;
    onRemove?: (participantId: number) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
                                                                    participant,
                                                                    onChange,
                                                                    onRemove,
                                                                }) => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(participant.id, {
            name: e.target.value,
            customPercent: participant.customPercent,
            customAmount: participant.customAmount,
        });
    };

    const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const percentValue = value ? parseFloat(value) / 100 : null;

        onChange(participant.id, {
            name: participant.name,
            customPercent: percentValue,
            customAmount: value ? null : participant.customAmount,
        });
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const amountValue = value ? parseFloat(value) : null;

        onChange(participant.id, {
            name: participant.name,
            customPercent: value ? null : participant.customPercent,
            customAmount: amountValue,
        });
    };

    const displayPercent = participant.customPercent ? (participant.customPercent * 100).toString() : "";
    const displayAmount = participant.customAmount ? participant.customAmount.toString() : "";

    return (
        <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-4 space-y-3 relative">
            <button
                onClick={() => onRemove?.(participant.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                aria-label="Remove participant"
            >
                ×
            </button>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                </label>
                <input
                    type="text"
                    value={participant.name}
                    required={true}
                    onChange={handleNameChange}
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Participant Name"
                />
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
                        value={displayPercent}
                        onChange={handlePercentChange}
                        className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Fixed Amount
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={displayAmount}
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
                        ${participant.totalAmount.toFixed(2)}
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