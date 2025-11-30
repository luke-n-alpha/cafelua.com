import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CafeLayout from './components/CafeLayout';
import IntroPage from './components/IntroPage';
import LoungePage from './components/LoungePage';
import './styles/variables.css';

// Placeholder components for routes
const About = () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>About Café Luα</h2>
        <p>Welcome to the sanctuary of deferred dreams.</p>
        <img src="/src/assets/logo.png" alt="Cafe Lua Logo" style={{ maxWidth: '300px', marginTop: '2rem' }} />
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Intro Page at Root */}
                <Route path="/" element={<IntroPage />} />
                
                {/* Lounge Page */}
                <Route path="/lounge" element={<LoungePage />} />

                {/* Main App Layout (Only for About for now) */}
                <Route element={<CafeLayout />}>
                    <Route path="/about" element={<About />} />
                    {/* Library detail routes kept for future use if needed, or redirect */}
                    {/* <Route path="/library/book/:id" element={<BookViewer />} /> */}
                    {/* <Route path="/library/guide" element={<WorldGuide />} /> */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
