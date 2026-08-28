import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Library from './page';
import '../../../i18n';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    useSearchParams: () => ({
        get: () => null,
        toString: () => ''
    }),
    usePathname: () => '/ko/atelier/',
    useParams: () => ({ locale: 'ko' }),
}));

describe('AtelierPage', () => {
    it('boots the old PC and opens the 1997 IE window', async () => {
        jest.useFakeTimers();
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        await act(async () => {
            render(<Library />);
        });

        await user.click(screen.getByRole('button', { name: /둘러보기|Explore|확인|OK/i }));
        await user.click(screen.getByRole('button', { name: /낡은 PC|Old PC/i }));

        expect(screen.getByText(/낡은 PC 시작|Starting the Old PC/i)).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(900);
        });

        await user.click(screen.getByRole('button', { name: /1997년 홈페이지|1997 Homepage/i }));

        expect(screen.getByText(/Internet Explorer - 1997/)).toBeInTheDocument();
        expect(screen.getByDisplayValue('/1997-homepage/index.html')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /^확인$|^OK$/i }));
        expect(screen.queryByText(/Internet Explorer - 1997/)).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /시작|Start/i }));
        await user.click(screen.getByRole('button', { name: /컴퓨터 끄기|Shut Down/i }));

        expect(screen.getByText(/낡은 PC 종료|Shutting Down the Old PC/i)).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(900);
        });

        expect(screen.getByRole('button', { name: /낡은 PC|Old PC/i })).toBeInTheDocument();
        jest.useRealTimers();
    });
});
