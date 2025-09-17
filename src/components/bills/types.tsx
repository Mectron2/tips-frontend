import type {Dish} from "../../redux/dishes/slices/DishSlice.ts";
import type {CurrencyDto} from "../../redux/currrencies/slices/currencySlice.ts";

export type Participant = {
    id: number;
    billId: number;
    name: string;
    customPercent?: string | null;
    customAmount?: string | null;
};

export type ParticipantDto = {
    id: number;
    billId: number;
    name: string;
    currency: CurrencyDto;
    customPercent?: number;
    customAmount?: number;
    totalAmount?: number;
    totalAmountInSpecifiedCurrency?: number;
    effectivePercent?: number;
};

export type BillDto = {
    id: number;
    amount: number;
    amountInSpecifiedCurrency: number;
    currency: CurrencyDto;
    tipPercent: number | null;
    createdAt: string;
    updatedAt: string;
    totalAmount?: number;
    dish?: Dish;
    participants?: ParticipantDto[];
};

export type Bill = {
    id: number;
    amount: string;
    amountInSpecifiedCurrency: string;
    tipPercent: string;
    currency: CurrencyDto;
    createdAt: string;
    updatedAt: string;
    participants: Participant[];
};
