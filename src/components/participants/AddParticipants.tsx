import React, {useState, useMemo, useEffect} from "react";
import { ParticipantCards } from "./ParticipantCards";
import type {Participant, ParticipantCalculation} from "./types";

interface AddParticipantsProps {
    tipsPercent: number | null;
    billAmount: number;
    initialParticipants?: Participant[];
}

export const AddParticipants: React.FC<AddParticipantsProps> = ({
                                                                    tipsPercent,
                                                                    billAmount,
                                                                    initialParticipants,
                                                                }) => {
    const [participants, setParticipants] = useState<Participant[]>(
        initialParticipants ?
        initialParticipants : [
        {
            id: 1,
            name: "",
            customPercent: null,
            customAmount: null,
        },
    ]);

    useEffect(() => {
        console.log(participants);
    }, [participants]);

    const totalTips = tipsPercent ? billAmount * tipsPercent : 0;

    const participantCalculations = useMemo((): ParticipantCalculation[] => {
        if (totalTips === 0) {
            return participants.map(p => ({
                ...p,
                effectivePercent: 0,
                totalAmount: 0,
            }));
        }

        let remainingTips = totalTips;
        const results: ParticipantCalculation[] = [];
        const participantsWithoutCustom: Participant[] = [];
        let customAmountTotal = 0;

        participants.forEach(participant => {
            if (participant.customAmount && participant.customAmount > 0) {
                customAmountTotal += participant.customAmount;
                const amount = participant.customAmount;
                results.push({
                    ...participant,
                    totalAmount: amount,
                    effectivePercent: totalTips > 0 ? amount / totalTips : 0,
                });
                remainingTips -= amount;
            }
        });

        const tipsWithoutCustom = totalTips - customAmountTotal;

        participants.forEach(participant => {
            if (participant.customPercent && participant.customPercent > 0) {
            const amount = tipsWithoutCustom * participant.customPercent;

            results.push({
                ...participant,
                totalAmount: amount,
                effectivePercent: amount / totalTips,
            });
            remainingTips -= amount;
        } else if ((!participant.customAmount && !participant.customPercent)) {
            participantsWithoutCustom.push(participant);
        }});

        if (participantsWithoutCustom.length > 0 && remainingTips > 0) {
            const amountPerParticipant = remainingTips / participantsWithoutCustom.length;
            const effectivePercent = totalTips > 0 ? amountPerParticipant / totalTips : 0;

            participantsWithoutCustom.forEach(participant => {
                results.push({
                    ...participant,
                    totalAmount: amountPerParticipant,
                    effectivePercent,
                });
            });
        } else if (participantsWithoutCustom.length > 0) {
            participantsWithoutCustom.forEach(participant => {
                results.push({
                    ...participant,
                    totalAmount: 0,
                    effectivePercent: 0,
                });
            });
        }

        return results;
    }, [participants, totalTips]);

    const handleParticipantChange = (
        participantId: number,
        data: {
            name: string;
            customPercent?: number | null;
            customAmount?: number | null;
        }
    ) => {
        setParticipants(prev =>
            prev.map(p =>
                p.id === participantId
                    ? { ...p, ...data,
                        customPercent: (data.customPercent && data.customPercent > 0) ? data.customPercent : null,
                        customAmount: (data.customAmount && data.customAmount > 0) ? data.customAmount : null
                      }
                    : p
            )
        );
    };

    const addParticipant = () => {
        const newId = parseInt(Date.now().toString(), 10);
        setParticipants(prev => [
            ...prev,
            {
                id: newId,
                name: "",
                customPercent: null,
                customAmount: null,
            },
        ]);
    };

    const removeParticipant = (participantId: number) => {
        setParticipants(prev => prev.filter(p => p.id !== participantId));
    };

    const totalAllocated = participantCalculations.reduce((sum, p) => sum + p.totalAmount, 0);
    const remainingTips = totalTips - totalAllocated;

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Tips Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-slate-600 dark:text-slate-400">Total tip amount:</span>
                        <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
              ${totalTips.toFixed(2)}
            </span>
                    </div>
                    <div>
                        <span className="text-slate-600 dark:text-slate-400">Distributed:</span>
                        <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
              ${totalAllocated.toFixed(2)}
            </span>
                    </div>
                    <div>
                        <span className="text-slate-600 dark:text-slate-400">Remaining:</span>
                        <span className={`ml-2 font-medium ${remainingTips < 0 ? 'text-red-600' : 'text-slate-900 dark:text-slate-100'}`}>
              ${remainingTips.toFixed(2)}
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
                        ⚠️ The tip amount was exceeded by ${Math.abs(remainingTips).toFixed(2)}
                    </div>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <button
                    onClick={addParticipant}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                    + Add Participant
                </button>
            </div>

            <ParticipantCards
                participants={participantCalculations}
                onChange={handleParticipantChange}
                onRemove={removeParticipant}
            />
        </div>
    );
};