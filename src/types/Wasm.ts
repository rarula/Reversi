export type Result = {
    blackStones: number;
    whiteStones: number;
};

export type Move = {
    row: number;
    col: number;
};

export type ReversiEngine = {
    isBlackTurn(): boolean;
    isPass(): boolean;
    isFinished(): boolean;
    legal(row: number, col: number): boolean;
    move(row: number, col: number): ReversiEngine;
    getBlackBoard(): string;
    getWhiteBoard(): string;
    getResult(): Result;
};

export type ReversiClass = {
    new(isBlackTurn: boolean, blackBoard: string, whiteBoard: string): ReversiEngine;
};

export type SearchBestMoveFunction = (isBlackTurn: boolean, blackBoard: string, whiteBoard: string, depth: number) => Move;
