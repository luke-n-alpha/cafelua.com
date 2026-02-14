'use client';

import { useState, useEffect } from 'react';
import './VisitorCounter.css';

function formatCount(n: number): string {
    const padded = String(n).padStart(6, '0');
    return padded.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function VisitorCounter() {
    const [count, setCount] = useState<number | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/api/visitors/count/')
            .then((res) => {
                if (!res.ok) throw new Error('fetch failed');
                return res.json();
            })
            .then((data) => setCount(data.count))
            .catch(() => setError(true));
    }, []);

    if (error) return null;

    return (
        <span className="visitor-counter">
            <span className="visitor-counter-label">You are visitor No.</span>
            <span className="visitor-counter-digits">
                {count !== null ? formatCount(count) : '---,---'}
            </span>
        </span>
    );
}
