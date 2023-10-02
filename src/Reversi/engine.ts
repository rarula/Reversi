import { CellState } from '../types/CellState';
import { Move } from '../types/Move';
import { StoneType } from '../types/StoneType';

type StoneCount = {
    blackStones: number;
    whiteStones: number;
};

/**
 * この関数はboardを破壊しません (structuredCloneが不要)
 */
export function getStoneCount(board: CellState[][]): StoneCount {
    let blackStones = 0;
    let whiteStones = 0;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 'BLACK') {
                blackStones++;
            }
            if (board[i][j] === 'WHITE') {
                whiteStones++;
            }
        }
    }

    return {
        blackStones,
        whiteStones,
    };
}

/**
 * この関数はboardを破壊しません (structuredCloneが不要)
 */
export function isGameEnd(board: CellState[][]): boolean {
    const shouldSkipBlackTurn = shouldSkip(board, 'BLACK');
    if (!shouldSkipBlackTurn) return false;

    const shouldSkipWhiteTurn = shouldSkip(board, 'WHITE');
    if (!shouldSkipWhiteTurn) return false;

    return true;
}

/**
 * この関数はboardを破壊しません (structuredCloneが不要)
 */
export function shouldSkip(board: CellState[][], friendlyStone: StoneType): boolean {
    let shouldSkipBlackTurn = true;
    let shouldSkipWhiteTurn = true;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const move: Move = { row: i, col: j };

            if (friendlyStone === 'BLACK') {
                const blackReversible = getReversibleCoords(board, 'BLACK', move);

                if (1 <= blackReversible.length) {
                    shouldSkipBlackTurn = false;
                }
            } else {
                const whiteReversible = getReversibleCoords(board, 'WHITE', move);

                if (1 <= whiteReversible.length) {
                    shouldSkipWhiteTurn = false;
                }
            }
        }
    }

    return ((friendlyStone === 'BLACK' && shouldSkipBlackTurn) || (friendlyStone === 'WHITE' && shouldSkipWhiteTurn));
}

/**
 * この関数はboardを破壊しません (structuredCloneが不要)
 */
export function makeMove(board: CellState[][], stone: StoneType, move: Move): CellState[][] {
    const newBoard = structuredClone(board);

    const reversible = getReversibleCoords(newBoard, stone, move);

    if (1 <= reversible.length) {
        for (const { row: x, col: y } of reversible) {
            newBoard[x][y] = stone;
        }
        newBoard[move.row][move.col] = stone;
    }

    return newBoard;
}

/**
 * この関数はboardを破壊しません (structuredCloneが不要)
 */
export function getLegalMoves(board: CellState[][], friendlyStone: StoneType): Move[] {
    const legalMoves: Move[] = [];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const move: Move = { row: i, col: j };
            const reversible = getReversibleCoords(board, friendlyStone, move);

            if (1 <= reversible.length) {
                legalMoves.push(move);
            }
        }
    }

    return legalMoves;
}

/**
 * この関数はboardを破壊しません (structuredCloneが不要)
 */
export function getReversibleCoords(board: CellState[][], friendlyStone: StoneType, move: Move): Move[] {
    const { row, col } = move;

    if (board[row][col] !== 'EMPTY') {
        return [];
    }

    const reversible: Move[] = [];
    const enemyStone = opponent(friendlyStone);
    const direction = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

    for (const [x, y] of direction) {
        let fixedX = row + x;
        let fixedY = col + y;

        if (0 <= fixedX && fixedX <= 7 && 0 <= fixedY && fixedY <= 7) {
            if (board[fixedX][fixedY] === enemyStone) {
                const tempReversible: Move[] = [{ row: fixedX, col: fixedY }];

                while (0 <= fixedX + x && fixedX + x <= 7 && 0 <= fixedY + y && fixedY + y <= 7) {
                    fixedX += x;
                    fixedY += y;

                    if (board[fixedX][fixedY] === 'EMPTY') {
                        break;
                    }
                    if (board[fixedX][fixedY] === enemyStone) {
                        tempReversible.push({ row: fixedX, col: fixedY });
                    }
                    if (board[fixedX][fixedY] === friendlyStone) {
                        reversible.push(...tempReversible);
                        break;
                    }
                }
            }
        }
    }

    return reversible;
}

export function opponent(friendlyStone: StoneType): StoneType {
    return friendlyStone === 'BLACK' ? 'WHITE' : 'BLACK';
}

export class Board {
    private _lastMove: Move | null;
    private _board: CellState[][];

    constructor(board: CellState[][]) {
        this._lastMove = null;
        this._board = structuredClone(board);
    }

    public get lastMove(): Move | null {
        return this._lastMove;
    }

    public get board(): CellState[][] {
        return this._board;
    }

    public move(stone: StoneType, move: Move): Board {
        const board = new Board(this._board);
        const reversible = getReversibleCoords(this._board, stone, move);

        if (1 <= reversible.length) {
            for (const { row, col } of reversible) {
                board._board[row][col] = stone;
            }
            board._board[move.row][move.col] = stone;
            board._lastMove = move;
        }

        return board;
    }
}
