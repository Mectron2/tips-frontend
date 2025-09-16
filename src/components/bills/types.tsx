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
    currency: {
        id: number;
        symbol: string;
        name: string;
        exchangeRate: string;
    }
    customPercent?: number;
    customAmount?: number;
    totalAmount?: number;
    effectivePercent?: number;
}

export type BillDto = {
    id: number;
    amount: number;
    amountInSpecifiedCurrency: number;
    currency: {
        id: number;
        symbol: string;
        name: string;
        exchangeRate: string;
    }
    tipPercent: number | null;
    createdAt: string;
    updatedAt: string;
    totalAmount?: number;
    participants?: ParticipantDto[];
}

export type Bill = {
    id: number;
    amount: string;
    amountInSpecifiedCurrency: string;
    tipPercent: string;
    currency: {
        id: number;
        symbol: string;
        name: string;
        exchangeRate: string;
    }
    createdAt: string;
    updatedAt: string;
    participants: Participant[];
};