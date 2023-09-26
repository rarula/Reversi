import { BoardInfo } from './types/BoardInfo';
import { GameInfo } from './types/GameInfo';
import { StoneType } from './types/StoneType';

export class Reversi {
    private _isBlackTurn: boolean;
    private _board: BoardInfo[][];

    private initialBoard: BoardInfo[][];
    private weightedBoard: number[][] = [
        [30, -12, 0, -1, -1, 0, -12, 30],
        [-12, -15, -3, -3, -3, -3, -15, -12],
        [0, -3, 0, -1, -1, 0, -3, 0],
        [-1, -3, -1, -1, -1, -1, -3, -1],
        [-1, -3, -1, -1, -1, -1, -3, -1],
        [0, -3, 0, -1, -1, 0, -3, 0],
        [-12, -15, -3, -3, -3, -3, -15, -12],
        [30, -12, 0, -1, -1, 0, -12, 30],
    ];

    constructor(board: BoardInfo[][]) {
        this._isBlackTurn = true;
        this._board = board;

        this.initialBoard = structuredClone(board);
    }

    public get isBlackTurn(): boolean {
        return this._isBlackTurn;
    }

    public get board(): BoardInfo[][] {
        return this._board;
    }

    public tryPlace(row: number, column: number): void {
        const stone: StoneType = this._isBlackTurn ? 'BLACK' : 'WHITE';
        const reversible = this.getReversibleCoords(stone, row, column);

        if (1 <= reversible.length) {
            for (const [x, y] of reversible) {
                this._board[x][y] = stone;
            }
            this._board[row][column] = stone;

            this._isBlackTurn = !this._isBlackTurn;
        }
    }

    public getReversibleCoords(friendlyStone: StoneType, row: number, column: number): number[][] {
        if (this._board[row][column] !== 'EMPTY') {
            return [];
        }

        const reversible: number[][] = [];
        const direction = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

        const enemyStone: StoneType = friendlyStone === 'BLACK' ? 'WHITE' : 'BLACK';

        for (const [x, y] of direction) {
            let fixedX = row + x;
            let fixedY = column + y;

            if (0 <= fixedX && fixedX <= 7 && 0 <= fixedY && fixedY <= 7) {
                if (this._board[fixedX][fixedY] === enemyStone) {
                    const tempReversible: number[][] = [[fixedX, fixedY]];

                    while (0 <= fixedX + x && fixedX + x <= 7 && 0 <= fixedY + y && fixedY + y <= 7) {
                        fixedX += x;
                        fixedY += y;

                        if (this._board[fixedX][fixedY] === 'EMPTY') {
                            break;
                        }
                        if (this._board[fixedX][fixedY] === enemyStone) {
                            tempReversible.push([fixedX, fixedY]);
                        }
                        if (this._board[fixedX][fixedY] === friendlyStone) {
                            reversible.push(...tempReversible);
                            break;
                        }
                    }
                }
            }
        }

        return reversible;
    }

    public getGameInfo(): GameInfo {
        let shouldSkipBlackTurn = true;
        let shouldSkipWhiteTurn = true;
        let blackStones = 0;
        let whiteStones = 0;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this._board[i][j] === 'BLACK') {
                    blackStones++;
                }
                if (this._board[i][j] === 'WHITE') {
                    whiteStones++;
                }

                const blackReversible = this.getReversibleCoords('BLACK', i, j);
                const whiteReversible = this.getReversibleCoords('WHITE', i, j);

                if (1 <= blackReversible.length) {
                    shouldSkipBlackTurn = false;
                }
                if (1 <= whiteReversible.length) {
                    shouldSkipWhiteTurn = false;
                }

                if (!shouldSkipBlackTurn && !shouldSkipWhiteTurn) {
                    break;
                }
            }
            if (!shouldSkipBlackTurn && !shouldSkipWhiteTurn) {
                break;
            }
        }

        if (shouldSkipBlackTurn && shouldSkipWhiteTurn) {
            return {
                isGameEnd: true,
                blackStones,
                whiteStones,
            };
        } else {
            return {
                isGameEnd: false,
                shouldSkip: (this._isBlackTurn && shouldSkipBlackTurn) || (!this._isBlackTurn && shouldSkipWhiteTurn)
                    ? true
                    : false,
            };
        }
    }

    public skipTurn(): void {
        this._isBlackTurn = !this._isBlackTurn;
    }

    public restart(): void {
        this._isBlackTurn = true;

        // structuredClone()で配列のディープコピーを作成する
        this._board = structuredClone(this.initialBoard);
    }

    public searchBestCoords(): number[] {
        const friendlyStone: StoneType = this._isBlackTurn ? 'BLACK' : 'WHITE';
        const placeableCoordsList: number[][] = [];

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const reversible = this.getReversibleCoords(friendlyStone, i, j);

                if (1 <= reversible.length) {
                    placeableCoordsList.push([i, j]);
                }
            }
        }

        let score = -Infinity;
        let coords: number[] = [];

        for (const [row, column] of placeableCoordsList) {
            if (score < this.weightedBoard[row][column]) {
                score = this.weightedBoard[row][column];
                coords = [row, column];
            }
        }

        return coords;
    }
}
