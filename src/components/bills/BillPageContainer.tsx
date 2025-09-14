import { useEffect, useState } from "react";
import { BillPage } from "./BillPage";
import type { BillDto } from "./types";
import {useParams} from "react-router-dom";

export const BillPageContainer = () => {
    const { id } = useParams();
    const [bill, setBill] = useState<BillDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3000/bills/${id}`)
            .then((res) => res.json())
            .then((data) => setBill(data))
            .catch((err) => console.error("Error loading bill:", err))
            .finally(() => setLoading(false));
    }, [id]);

    const reloadBill = () => {
        fetch(`http://localhost:3000/bills/${id}`)
            .then((res) => res.json())
            .then((data) => setBill(data))
            .catch((err) => console.error("Error loading bill:", err))
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (!bill) return <p>Bill not found</p>;

    return <BillPage bill={bill} onReload={reloadBill} />;
};
