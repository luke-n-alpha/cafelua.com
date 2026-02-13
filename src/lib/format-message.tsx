import React from 'react';

export function renderMessage(text: string): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
        if (boldMatch) {
            return <strong key={i}>{boldMatch[1]}</strong>;
        }
        return part;
    });
}
