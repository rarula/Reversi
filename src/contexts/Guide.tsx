import { createContext, ReactNode, useContext, useState } from 'react';

type Props = {
    children: ReactNode;
};

type ContextGuide = {
    guide: boolean;
    toggleGuide: () => void;
};

const Guide = createContext<ContextGuide>({
    guide: true,
    toggleGuide: () => {},
});

export const useGuide = (): ContextGuide => {
    return useContext(Guide);
};

const GuideProvider = ({ children }: Props): JSX.Element => {
    const [guide, setGuide] = useState(true);

    const toggleGuide = (): void => {
        setGuide((prev) => !prev);
    };

    const value: ContextGuide = {
        guide,
        toggleGuide,
    };

    return (
        <Guide.Provider value={value}>
            {children}
        </Guide.Provider>
    );
};

export default GuideProvider;
