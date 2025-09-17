import React, { useMemo, useState } from 'react';
import { ParticipantCards } from './ParticipantCards';
import { type Participant, type ParticipantCalculation } from './types';
import { formatCurrency } from '../../utils/currencyFuncs';
import { useSelector } from 'react-redux';
import { selectAllCurrencies } from '../../redux/currrencies/slices/currencySlice.ts';

export class CurrencyDto {
    id: number;
    symbol: string;
    name: string;
    exchangeRate: number | string;

    constructor(id: number, symbol: string, name: string, exchangeRate: number | string) {
        this.id = id;
        this.symbol = symbol;
        this.name = name;
        this.exchangeRate = exchangeRate;
    }
}

interface AddParticipantsProps {
    tipsPercent: number | null;
    billAmount: number;
    billCurrency: CurrencyDto;
    currencies: CurrencyDto[];
    initialParticipants?: (Participant & { currencyId?: number })[];
    billId: number;
    onReload: () => void;
}

export const AddParticipants: React.FC<AddParticipantsProps> = ({
    tipsPercent,
    billAmount,
    billCurrency,
    initialParticipants,
    billId,
    onReload,
}) => {
    const currencies = useSelector(selectAllCurrencies);

    const rate = (id: number) => Number(currencies.find((c) => c.id === id)?.exchangeRate ?? 1);

    const toBase = (amount: number, currencyId: number) => amount / rate(currencyId);
    const baseTo = (amountBase: number, currencyId: number) => amountBase * rate(currencyId);
    const convert = (amount: number, fromId: number, toId: number) =>
        baseTo(toBase(amount, fromId), toId);

    const [participants, setParticipants] = useState<(Participant & { currencyId: number })[]>(
        (
            initialParticipants ?? [
                {
                    id: parseInt(Date.now().toString(), 10),
                    billId,
                    name: '',
                    customPercent: null,
                    customAmount: null,
                    currencyId: billCurrency.id,
                },
            ]
        ).map((p) => ({ ...p, currencyId: p.currencyId ?? billCurrency.id }))
    );

    console.log(participants);

    const totalTips = tipsPercent ? billAmount * tipsPercent : 0;

    const participantCalculations = useMemo((): (ParticipantCalculation & {
        currencyId: number;
    })[] => {
        if (totalTips === 0) {
            return participants.map((p) => ({
                ...p,
                effectivePercent: 0,
                totalAmount: 0,
                currencyId: p.currencyId,
            }));
        }

        let remainingTips = totalTips;
        const results: (ParticipantCalculation & { currencyId: number })[] = [];
        const participantsWithoutCustom: (Participant & { currencyId: number })[] = [];
        let customAmountTotalInBillCurrency = 0;

        participants.forEach((p) => {
            if (p.customAmount && p.customAmount > 0) {
                const inBill = convert(p.customAmount, p.currencyId, billCurrency.id);
                customAmountTotalInBillCurrency += inBill;

                results.push({
                    ...p,
                    totalAmount: inBill,
                    effectivePercent: totalTips > 0 ? inBill / totalTips : 0,
                    currencyId: p.currencyId,
                });
                remainingTips -= inBill;
            }
        });

        const tipsWithoutCustom = totalTips - customAmountTotalInBillCurrency;

        participants.forEach((p) => {
            if (p.customPercent && p.customPercent > 0) {
                const amount = tipsWithoutCustom * p.customPercent;
                results.push({
                    ...p,
                    totalAmount: amount,
                    effectivePercent: amount / totalTips,
                    currencyId: p.currencyId,
                });
                remainingTips -= amount;
            } else if (!p.customAmount && !p.customPercent) {
                participantsWithoutCustom.push(p);
            }
        });

        if (participantsWithoutCustom.length > 0 && remainingTips > 0) {
            const amountPer = remainingTips / participantsWithoutCustom.length;
            const eff = totalTips > 0 ? amountPer / totalTips : 0;
            participantsWithoutCustom.forEach((p) =>
                results.push({
                    ...p,
                    totalAmount: amountPer,
                    effectivePercent: eff,
                    currencyId: p.currencyId,
                })
            );
        } else if (participantsWithoutCustom.length > 0) {
            participantsWithoutCustom.forEach((p) =>
                results.push({
                    ...p,
                    totalAmount: 0,
                    effectivePercent: 0,
                    currencyId: p.currencyId,
                })
            );
        }

        return results;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [participants, totalTips, billCurrency.id]);

    const handleParticipantChange = (
        participantId: number,
        data: {
            name?: string;
            customPercent?: number | null;
            customAmount?: number | null;
            currencyId?: number;
        }
    ) => {
        setParticipants((prev) =>
            prev.map((p) =>
                p.id === participantId
                    ? {
                          ...p,
                          ...data,
                          customPercent:
                              data.customPercent !== undefined
                                  ? data.customPercent && data.customPercent > 0
                                      ? data.customPercent
                                      : null
                                  : p.customPercent,
                          customAmount:
                              data.customAmount !== undefined
                                  ? data.customAmount && data.customAmount > 0
                                      ? data.customAmount
                                      : null
                                  : p.customAmount,
                      }
                    : p
            )
        );
    };

    const addParticipant = () => {
        const newId = parseInt(Date.now().toString(), 10);
        setParticipants((prev) => [
            ...prev,
            {
                id: newId,
                billId,
                name: '',
                customPercent: null,
                customAmount: null,
                currencyId: billCurrency.id,
            },
        ]);
    };

    const saveParticipants = async () => {
        const payload = participants.map((p) => ({
            name: p.name,
            customPercent: p.customPercent ?? null,
            customAmount: p.customAmount ?? null,
            currencyId: p.currencyId,
        }));

        await fetch(`http://localhost:3000/participant/bill/${billId}`, {
            method: 'DELETE',
        });

        await fetch('http://localhost:3000/participant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                billId,
                createParticipantDtos: payload,
            }),
        });
    };

    const calculateTotalAllocatedTips = (
        participants: (ParticipantCalculation & { currencyId: number })[]
    ) => participants.reduce((sum, p) => sum + p.totalAmount, 0);

    const totalAllocated = calculateTotalAllocatedTips(participantCalculations);
    const remainingTips = totalTips - totalAllocated;

    return (
        <form
            className="space-y-6"
            onSubmit={async (e) => {
                e.preventDefault();
                await saveParticipants();
                onReload();
            }}
        >
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Tips Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-slate-600 dark:text-slate-400">
                            Total tip amount:
                        </span>
                        <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(totalTips, billCurrency.symbol)}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-600 dark:text-slate-400">Distributed:</span>
                        <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(totalAllocated, billCurrency.symbol)}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-600 dark:text-slate-400">Remaining:</span>
                        <span
                            className={`ml-2 font-medium ${
                                remainingTips < 0
                                    ? 'text-red-600'
                                    : 'text-slate-900 dark:text-slate-100'
                            }`}
                        >
                            {formatCurrency(remainingTips, billCurrency.symbol)}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-600 dark:text-slate-400">Participants:</span>
                        <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
                            {participants.length}
                        </span>
                    </div>
                </div>

                {remainingTips < 0 && (
                    <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded">
                        ⚠️ The tip amount was exceeded by{' '}
                        {formatCurrency(Math.abs(remainingTips), billCurrency.symbol)}
                    </div>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <button
                    type="button"
                    onClick={addParticipant}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors w-full p-3"
                >
                    Add Participant
                </button>
            </div>

            <ParticipantCards
                participants={participantCalculations}
                billCurrency={billCurrency}
                onChange={handleParticipantChange}
                onRemove={(id) => setParticipants((prev) => prev.filter((p) => p.id !== id))}
            />

            <div className="flex gap-4 items-center">
                <button
                    disabled={remainingTips < 0}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white rounded-md text-sm font-medium
                    transition-colors w-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save
                </button>
            </div>

            <div className="flex gap-4 items-center">
                <button
                    type="button"
                    className="bg-red-600 hover:bg-red-800 text-white rounded-md text-sm font-medium
                    transition-colors w-full p-3"
                    onClick={() =>
                        setParticipants(
                            (
                                initialParticipants ?? [
                                    {
                                        id: parseInt(Date.now().toString(), 10),
                                        billId,
                                        name: '',
                                        customPercent: null,
                                        customAmount: null,
                                        currencyId: billCurrency.id,
                                    },
                                ]
                            ).map((p) => ({ ...p, currencyId: p.currencyId ?? billCurrency.id }))
                        )
                    }
                >
                    Reset
                </button>
            </div>
        </form>
    );
};
