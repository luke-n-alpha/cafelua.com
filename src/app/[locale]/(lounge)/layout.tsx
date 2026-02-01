import LoungeBgm from './LoungeBgm';

export default function LoungeGroupLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LoungeBgm />
            {children}
        </>
    );
}

