import { useEffect, useState } from 'react';
import { ContentLoader } from '../services/ContentLoader';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './WorldGuide.css';

const WorldGuide = () => {
    const navigate = useNavigate();
    const [guideContent, setGuideContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Find the setting file
        const novels = ContentLoader.getNovels();
        // Assuming the file is named "00.설정.md" or similar and title contains "설정"
        const settingFile = novels.find(n => n.path.includes('00.설정.md'));

        if (settingFile) {
            const relativePath = settingFile.path.split('/data/')[1];
            const url = `/data/${relativePath}`;

            fetch(url)
                .then(res => res.text())
                .then(text => {
                    setGuideContent(text);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load guide:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div className="world-guide-container">
            <button className="back-btn" onClick={() => navigate('/library')}>
                <ArrowLeft size={20} /> Back to Library
            </button>

            <div className="guide-content">
                {loading ? (
                    <div className="loading">Loading World Guide...</div>
                ) : guideContent ? (
                    <div className="markdown-body">
                        {/* Simple markdown rendering for now, replacing headers for styling */}
                        {guideContent.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
                            if (line.startsWith('|')) return <div key={i} className="table-row">{line}</div>; // Very basic table handling
                            return <p key={i}>{line}</p>;
                        })}
                    </div>
                ) : (
                    <div className="error">World Guide data not found.</div>
                )}
            </div>
        </div>
    );
};

export default WorldGuide;
