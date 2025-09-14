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
            .catch((err) => console.error("Ошибка загрузки:", err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (!bill) return <p>Счёт не найден</p>;

    return <BillPage bill={bill} />;
};
