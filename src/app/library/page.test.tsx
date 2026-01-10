import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Library from './page';
import '../../i18n';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() })
}));

describe('LibraryPage', () => {
    it('boots Win98 and opens the 1997 IE window', async () => {
        jest.useFakeTimers();
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        await act(async () => {
            render(<Library />);
        });

        await user.click(screen.getByRole('button', { name: /확인|OK/i }));
        await user.click(screen.getByRole('button', { name: /구형 PC 켜기|Power On Old PC/i }));

        expect(screen.getByText(/Windows 98 시작|Starting Windows 98/i)).toBeInTheDocument();

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

        expect(screen.getByText(/Windows 98 종료|Shutting Down Windows 98/i)).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(900);
        });

        expect(screen.getByRole('button', { name: /구형 PC 켜기|Power On Old PC/i })).toBeInTheDocument();
        jest.useRealTimers();
    });
});
