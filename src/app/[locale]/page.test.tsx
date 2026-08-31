import { render, screen, act } from '@testing-library/react';
import HomePage from './page';
import '../../i18n';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => '/ko/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({ locale: 'ko' }),
}));

describe('HomePage', () => {
    it('renders the intro enter button', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ count: 0 }),
        });
        await act(async () => {
            render(<HomePage />);
        });
        expect(screen.getByRole('button', { name: /입장하기|Click to Enter/i })).toBeInTheDocument();
    });
});
