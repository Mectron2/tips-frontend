import React from 'react';
import { ParticipantCard } from './ParticipantCard';
import type { ParticipantCalculation } from './types';

type CurrencyDto = {
    id: number;
    symbol: string;
    name: string;
    exchangeRate: number | string;
};

interface ParticipantCardsProps {
    participants: (ParticipantCalculation & { currencyId: number })[];
    billCurrency: CurrencyDto;
    onChange: (
        participantId: number,
        data: {
            name?: string;
            customPercent?: number | null;
            customAmount?: number | null;
            currencyId?: number;
        }
    ) => void;
    onRemove?: (participantId: number) => void;
}

export const ParticipantCards: React.FC<ParticipantCardsProps> = ({
    participants,
    billCurrency,
    onChange,
    onRemove,
}) => {
    const sortedParticipants = [...participants].sort((a, b) => b.id - a.id);

    return (
        <div className="space-y-4">
            {sortedParticipants.map((participant) => (
                <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    billCurrency={billCurrency}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};
