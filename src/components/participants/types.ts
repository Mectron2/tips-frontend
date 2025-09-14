export interface Participant {
    id: number;
    name: string;
    billId: number;
    customPercent?: number | null;
    customAmount?: number | null;
}

export interface ParticipantCalculation extends Participant {
    effectivePercent: number;
    totalAmount: number;
}