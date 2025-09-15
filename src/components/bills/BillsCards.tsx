import React, {useEffect} from "react";
import BillCard from "./BillCard";
import type { Bill } from "./types";
import {useDispatch, useSelector} from "react-redux";
import {loadBills} from "../../redux/bills/slices/billsSlice.ts";
import type {AppDispatch} from "../../redux/store.ts";

type BillsCardsProps = {
    bills?: Bill[];
    currency: string;
    onOpen?: (bill: Bill) => void;
    onEdit?: (bill: Bill) => void;
};

export const BillsCards: React.FC<BillsCardsProps> = ({ currency }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: bills } = useSelector(
        (state) => state.bills
    );

    useEffect(() => {
        dispatch(loadBills());
        console.log("Invoked");
    }, [dispatch]);

    return (
        <>
            <div className="flex flex-col gap-4 w-full items-center">
                {bills.map((bill) => (
                    <BillCard key={bill.id} bill={bill} currency={currency} />
                ))}
            </div>
        </>
    );
};

export default BillsCards;
