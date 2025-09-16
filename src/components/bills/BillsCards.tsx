import React, {useEffect} from "react";
import BillCard from "./BillCard";
import {useDispatch, useSelector} from "react-redux";
import {loadBills} from "../../redux/bills/slices/billsSlice.ts";
import type {AppDispatch} from "../../redux/store.ts";
import type {RootState} from "../../redux/store.ts";

export const BillsCards: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: bills } = useSelector(
        (state: RootState) => state.bills
    );

    useEffect(() => {
        dispatch(loadBills());
    }, [dispatch]);

    return (
        <>
            <div className="flex flex-col gap-4 w-full items-center">
                {bills.map((bill) => (
                    <BillCard key={bill.id} bill={bill} currency={bill.currency.symbol} />
                ))}
            </div>
        </>
    );
};

export default BillsCards;
