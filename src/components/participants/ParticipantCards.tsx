import React from "react";
import { ParticipantCard } from "./ParticipantCard";
import type {ParticipantCalculation} from "./types";

interface ParticipantCardsProps {
    participants: ParticipantCalculation[];
    onChange: (participantId: number, data: {
        name: string;
        customPercent?: number | null;
        customAmount?: number | null;
    }) => void;
    onRemove?: (participantId: number) => void;
}

export const ParticipantCards: React.FC<ParticipantCardsProps> = ({
                                                                      participants,
                                                                      onChange,
                                                                      onRemove,
                                                                  }) => {
    const sortedParticipants = [...participants]
        .sort((a, b) => b.id - a.id);

    return (
        <div className="space-y-4">
            {sortedParticipants.map((participant) => (
                <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};