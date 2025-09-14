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
    declaredPercent?: number;
    declaredAmount?: number;
    totalAmount?: number;
    effectivePercent?: number;
}

export type BillDto = {
    id: number;
    amount: number;
    tipPercent: number | null;
    createdAt: string;
    updatedAt: string;
    totalAmount?: number;
    participants?: ParticipantDto[];
}

export type Bill = {
    id: number;
    amount: string;
    tipPercent: string;
    createdAt: string;
    updatedAt: string;
    participants: Participant[];
};