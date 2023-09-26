export type GameInfo = {
    isGameEnd: true;
    blackStones: number;
    whiteStones: number;
} | {
    isGameEnd: false;
    shouldSkip: boolean;
};
