import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentLoader, type ContentItem } from '../services/ContentLoader';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import './BookViewer.css';

const BookViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<string>('');
    const [meta, setMeta] = useState<ContentItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        if (id) {
            const novels = ContentLoader.getNovels();
            const found = novels.find(n => n.id === decodeURIComponent(id));

            if (found) {
                setMeta(found);
                setLoading(true);
                // Extract relative path from absolute path
                const relativePath = found.path.split('/data/')[1];
                const url = `/data/${relativePath}`;

                fetch(url)
                    .then(res => res.text())
                    .then(text => {
                        setContent(text);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error("Failed to load novel:", err);
                        setContent("Failed to load content.");
                        setLoading(false);
                    });
            }
        }
    }, [id]);

    if (!meta) return <div className="book-loading">Loading...</div>;

    const mapImages = meta.images?.filter(img => img.includes('map')) || [];
    const illustImages = meta.images?.filter(img => !img.includes('map')) || [];

    return (
        <div className="book-viewer-overlay">
            <div className="book-viewer-container">
                <button className="close-btn" onClick={() => navigate('/library')}>
                    <ArrowLeft size={24} /> Back to Shelf
                </button>

                <div className="book-page">
                    <div className="book-header">
                        <h1>{meta.title}</h1>
                        <span className="book-date">{new Date(meta.date).toLocaleDateString()}</span>
                        {mapImages.length > 0 && (
                            <button className="view-map-btn" onClick={() => setShowMap(!showMap)}>
                                {showMap ? 'Hide Map' : 'View Map 🗺️'}
                            </button>
                        )}
                    </div>

                    {showMap && mapImages.length > 0 && (
                        <div className="map-overlay">
                            {mapImages.map((img, idx) => (
                                <div key={idx} className="map-container">
                                    <img src={`/data/${img}`} alt={`Map for ${meta.title}`} />
                                    <p className="map-caption">Map: {meta.title}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="book-content">
                        {loading ? (
                            <div className="loading-spinner">Loading content...</div>
                        ) : (
                            <div className="markdown-body">
                                {illustImages.length > 0 && (
                                    <div className="illustration-section top">
                                        {illustImages.map((img, idx) => (
                                            <img key={idx} src={`/data/${img}`} alt="Illustration" className="story-illustration" />
                                        ))}
                                    </div>
                                )}
                                {content.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="book-footer">
                        <span className="page-number">- {meta.id} -</span>
                    </div>
                </div>

                <div className="book-controls">
                    <button className="nav-btn prev"><ChevronLeft /></button>
                    <button className="nav-btn next"><ChevronRight /></button>
                </div>
            </div>
        </div>
    );
};

export default BookViewer;
