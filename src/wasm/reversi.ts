import { ReversiClass, SearchBestMoveFunction } from '../types/Wasm';
import createWasmModule from './reversi.mjs';

export interface MainModule extends EmscriptenModule {
    Reversi: ReversiClass;
    searchBestMove: SearchBestMoveFunction;
}

const createModule = (): Promise<MainModule> => createWasmModule();

export default createModule;
