import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IntroPage from './components/IntroPage';
import './styles/variables.css';

const MainPlaceholder = () => (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.75rem',
        textAlign: 'center',
        padding: '2rem'
    }}>
        <h2>Café Luα</h2>
        <p>Full site lives in the private repository. This public build shows the intro only.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/main" element={<MainPlaceholder />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
