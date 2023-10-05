import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ReversiClass, SearchBestMoveFunction } from '../types/Wasm';
import createModule, { MainModule } from '../wasm/reversi';

type Props = {
    children: ReactNode;
};

type ContextWasm = {
    isLoaded: boolean;
    Reversi: ReversiClass | undefined;
    searchBestMove: SearchBestMoveFunction | undefined;
};

const Wasm = createContext<ContextWasm>({
    isLoaded: false,
    Reversi: undefined,
    searchBestMove: undefined,
});

export const useWasm = (): ContextWasm => {
    return useContext(Wasm);
};

const WasmProvider = ({ children }: Props): JSX.Element => {
    const [module, setModule] = useState<MainModule | undefined>();

    const value: ContextWasm = {
        isLoaded: module ? true : false,
        Reversi: module?.Reversi,
        searchBestMove: module?.searchBestMove,
    };

    useEffect(() => {
        createModule().then((module) => {
            setModule(module);
        });
    }, []);

    return (
        <Wasm.Provider value={value}>
            {children}
        </Wasm.Provider>
    );
};

export default WasmProvider;
