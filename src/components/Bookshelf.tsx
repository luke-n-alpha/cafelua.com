import { useEffect, useState } from 'react';
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

    return (
        <div className="bookshelf-container">
            <h2><Book size={24} /> Library (서재)</h2>
            <div className="bookshelf-grid">
                {novels.map((novel) => (
                    <div key={novel.id} className="book-item">
                        <div className="book-spine">
                            <span className="book-title">{novel.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookshelf;
