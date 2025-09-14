import React from "react";
import BillCard from "./BillCard";
import type { Bill } from "./types";

type BillsCardsProps = {
    bills?: Bill[];
    currency: string;
    onOpen?: (bill: Bill) => void;
    onEdit?: (bill: Bill) => void;
    onDelete: (id: number) => void;
};

export const BillsCards: React.FC<BillsCardsProps> = ({ bills = [], currency, onDelete }) => {
    return (
        <>
            <div className="flex flex-col gap-4 w-full items-center">
                {bills.map((bill) => (
                    <BillCard key={bill.id} bill={bill} currency={currency} onDelete={onDelete} />
                ))}
            </div>
        </>
    );
};

export default BillsCards;
