import React from "react";
import type { BillDto } from "./types.tsx";
import {AddParticipants} from "../participants/AddParticipants.tsx";

interface BillPageProps {
    bill: BillDto;
}

export const BillPage: React.FC<BillPageProps> = ({ bill }) => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-gray-800 shadow rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Bill <span className="text-blue-600">#{bill.id}</span>
                </h1>

                <div className="space-y-2 mb-6">
                    <p className="text-sm text-slate-100">
                        <span className="font-medium">Amount:</span>{" "}
                        ${bill.amount.toFixed(2)}
                    </p>

                    {bill.tipPercent !== null && (
                        <p className="text-sm text-slate-100">
                            <span className="font-medium">Tip Percent:</span> {bill.tipPercent}%
                        </p>
                    )}

                    {bill.tipAmount !== null && (
                        <p className="text-sm text-slate-100">
                            <span className="font-medium">Tip Amount:</span>{" "}
                            ${bill.tipAmount.toFixed(2)}
                        </p>
                    )}

                    {bill.totalAmount !== undefined && (
                        <p className="text-sm text-slate-100">
                            <span className="font-medium">Total Amount:</span>{" "}
                            ${bill.totalAmount.toFixed(2)}
                        </p>
                    )}

                    <p className="text-xs text-slate-400">
                        Created: {new Date(bill.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">
                        Updated: {new Date(bill.updatedAt).toLocaleString()}
                    </p>
                </div>

                <h2 className="text-lg font-semibold border-b border-slate-200 pb-2 mb-4">
                    Participants
                </h2>

                {bill.participants && bill.participants.length > 0 ? (
                    <ul className="divide-y divide-slate-200">
                        {bill.participants.map((participant) => (
                            <li
                                key={participant.id}
                                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            >
                <span className="font-medium text-slate-100">
                  {participant.name}
                </span>
                                <div className="text-sm text-slate-500 space-x-3 mt-1 sm:mt-0">
                                    {participant.declaredPercent !== undefined && (
                                        <span>
                      Declared: {(participant.declaredPercent * 100).toFixed(2)}%
                    </span>
                                    )}
                                    {participant.declaredAmount !== undefined && (
                                        <span>
                      Declared: ${participant.declaredAmount.toFixed(2)}
                    </span>
                                    )}
                                    {participant.totalAmount !== undefined && (
                                        <span>
                      Total: ${participant.totalAmount.toFixed(2)}
                    </span>
                                    )}
                                    {participant.effectivePercent !== undefined && (
                                        <span>
                      Effective: {(participant.effectivePercent * 100).toFixed(2)}%
                    </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 italic">
                        No participants found.
                    </p>
                )}
            </div>
            <AddParticipants tipsPercent={bill.tipPercent} billAmount={bill.amount} initialParticipants={bill.participants} />
        </div>
    );
};
