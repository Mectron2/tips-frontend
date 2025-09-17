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

export class ParticipantDto {
    name: string | null;
    customPercent?: number | null;
    customAmount?: number | null;
    totalAmountInSpecifiedCurrency?: number | null;

    constructor(name: string | null, customPercent?: number | null, customAmount?: number | null) {
        this.name = name;
        this.customPercent = customPercent;
        this.customAmount = customAmount;
    }
}
