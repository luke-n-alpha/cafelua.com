'use client';

import { useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../services/ContentLoader';
import type { ContentItem } from '../services/ContentLoader';
import { Book } from 'lucide-react';
import './Bookshelf.css';

const Bookshelf = () => {
    const [novels, setNovels] = useState<ContentItem[]>([]);

    useEffect(() => {
        const data = ContentLoader.getNovels();
        setNovels(data);
    }, []);

    const handleOpen = (novelId: string) => {
        // TODO: route to reader when available
        const target = `/library?id=${encodeURIComponent(novelId)}`;
        window.location.href = target;
    };

    const novelsBySeries = useMemo(() => {
        const grouped: Record<string, ContentItem[]> = {};
        novels.forEach(novel => {
            const key = novel.series || 'others';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(novel);
        });
        return grouped;
    }, [novels]);

    return (
        <div className="bookshelf-container ui-card">
            <h2 className="bookshelf-title"><Book size={24} /> Library (서재)</h2>
            {Object.entries(novelsBySeries).map(([series, list]) => (
                <section key={series} className="bookshelf-section">
                    <div className="bookshelf-section-header">
                        <span className="bookshelf-section-title">
                            {series === 'others' ? '단편/기타' : series}
                        </span>
                        <span className="bookshelf-count ui-chip">{list.length}권</span>
                    </div>
                    <div className="bookshelf-grid ui-glass">
                        {list.map((novel) => (
                            <button
                                type="button"
                                key={novel.id}
                                className="book-item ui-button ui-button-ghost"
                                onClick={() => handleOpen(novel.id)}
                                title={novel.title}
                            >
                                <div className="book-spine">
                                    <span className="book-title">{novel.title}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Bookshelf;
