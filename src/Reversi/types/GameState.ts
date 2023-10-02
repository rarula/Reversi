export type GameState = {
    isGameEnd: true;
    blackStones: number;
    whiteStones: number;
} | {
    isGameEnd: false;
    blackStones: number;
    whiteStones: number;
    shouldSkip: boolean;
};
