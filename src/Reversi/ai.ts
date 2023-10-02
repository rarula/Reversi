import { CellState } from '../types/CellState';
import { Move } from '../types/Move';
import { StoneType } from '../types/StoneType';
import { Board, getLegalMoves, opponent } from './engine';

type ChildNode = {
    board: Board;
    score: number;
};

let transposeMap: Map<string, number> = new Map();
let formerTransposeMap: Map<string, number> = new Map();

const weightedBoard = [
    [30, -12, 0, -1, -1, 0, -12, 30],
    [-12, -15, -3, -3, -3, -3, -15, -12],
    [0, -3, 0, -1, -1, 0, -3, 0],
    [-1, -3, -1, -1, -1, -1, -3, -1],
    [-1, -3, -1, -1, -1, -1, -3, -1],
    [0, -3, 0, -1, -1, 0, -3, 0],
    [-12, -15, -3, -3, -3, -3, -15, -12],
    [30, -12, 0, -1, -1, 0, -12, 30],
];

export function searchBestMove(board: CellState[][], depth: number, friendlyStone: StoneType): Move | null {
    transposeMap.clear();
    formerTransposeMap.clear();

    const fixedBoard = new Board(board);

    const childNodes: ChildNode[] = [];
    const legalMoves = getLegalMoves(fixedBoard.board, friendlyStone);

    for (const move of legalMoves) {
        const childBoard = fixedBoard.move(friendlyStone, move);

        childNodes.push({
            board: childBoard,
            score: -Infinity,
        });
    }

    let lastMove: Move | null = null;
    let searchDepth;
    const startDepth = Math.max(1, depth - 3);
    for (searchDepth = startDepth; searchDepth <= depth; searchDepth++) {
        let alpha = -Infinity;
        const beta = Infinity;

        if (2 <= legalMoves.length) {
            for (const childNode of childNodes) {
                childNode.score = getMoveOrderingScore(childNode.board.board, opponent(friendlyStone), JSON.stringify(childNode.board.board));
            }
            childNodes.sort((a, b) => {
                return b.score - a.score;
            });
        }

        for (const childNode of childNodes) {
            const score = -fastNegativeAlpha(childNode.board.board, searchDepth - 1, false, -beta, -alpha, opponent(friendlyStone));

            if (alpha < score) {
                alpha = score;
                lastMove = childNode.board.lastMove;
            }
        }

        [transposeMap, formerTransposeMap] = [formerTransposeMap, transposeMap];
        transposeMap.clear();
    }

    return lastMove;
}

// export function searchBestMove(board: CellState[][], depth: number, friendlyStone: StoneType): Move | null {
//     const legalMoves = getLegalMoves(board, friendlyStone);
//     if (legalMoves.length === 0) {
//         return null;
//     }
//
//     let bestMove: Move | null = null;
//     let bestScore = -Infinity;
//
//     for (const move of legalMoves) {
//         const newBoard = makeMove(board, friendlyStone, move);
//         const score = -negativeAlpha(newBoard, depth, false, -Infinity, Infinity, opponent(friendlyStone));
//
//         if (bestScore < score) {
//             bestScore = score;
//             bestMove = move;
//         }
//     }
//
//     return bestMove;
// }

/**
 * NegaAlpha アルゴリズム
 */
// function negativeAlpha(board: CellState[][], depth: number, passed: boolean, alpha: number, beta: number, friendlyStone: StoneType): number {
//
//     if (depth === 0) {
//         return evaluate(board, friendlyStone);
//     }
//
//     const legalMoves = getLegalMoves(board, friendlyStone);
//     if (legalMoves.length === 0) {
//         if (passed) {
//             return evaluate(board, friendlyStone);
//         }
//
//         return -negativeAlpha(board, depth, true, -beta, -alpha, opponent(friendlyStone));
//     }
//
//     let score = -Infinity;
//     for (const move of legalMoves) {
//         const newBoard = makeMove(board, friendlyStone, move);
//         const value = -negativeAlpha(newBoard, depth - 1, false, -beta, -alpha, opponent(friendlyStone));
//
//         score = Math.max(score, value);
//         alpha = Math.max(alpha, value);
//
//         if (beta <= alpha) {
//             break;
//         }
//     }
//
//     return score;
// }

/**
 * NegaAlpha アルゴリズム (改良版)
 */
function fastNegativeAlpha(board: CellState[][], depth: number, passed: boolean, alpha: number, beta: number, friendlyStone: StoneType): number {
    const fixedBoard = new Board(structuredClone(board));

    if (depth === 0) {
        return evaluate(fixedBoard.board, friendlyStone);
    }

    const key = JSON.stringify(fixedBoard.board);
    const value = transposeMap.get(key);
    if (value) {
        return value;
    }

    const legalMoves = getLegalMoves(fixedBoard.board, friendlyStone);
    if (legalMoves.length === 0) {
        if (passed) {
            return evaluate(fixedBoard.board, friendlyStone);
        }

        return -fastNegativeAlpha(fixedBoard.board, depth, true, -beta, -alpha, opponent(friendlyStone));
    }

    const childNodes: ChildNode[] = [];
    for (const move of legalMoves) {
        const childBoard = fixedBoard.move(friendlyStone, move);

        childNodes.push({
            board: childBoard,
            score: getMoveOrderingScore(childBoard.board, opponent(friendlyStone), JSON.stringify(childBoard.board)),
        });
    }

    if (2 <= legalMoves.length) {
        childNodes.sort((a, b) => {
            return b.score - a.score;
        });
    }

    let score = -Infinity;
    for (const childNode of childNodes) {
        const value = -fastNegativeAlpha(childNode.board.board, depth - 1, false, -beta, -alpha, opponent(friendlyStone));

        if (beta <= value) {
            return value;
        }

        score = Math.max(score, value);
        alpha = Math.max(alpha, value);
    }

    transposeMap.set(key, score);
    return score;
}

function getMoveOrderingScore(board: CellState[][], friendlyStone: StoneType, key: string): number {
    let score = 0;
    const value = formerTransposeMap.get(key);

    if (value) {
        score = 1000 - value;
    } else {
        score = -evaluate(board, friendlyStone);
    }

    return score;
}

function evaluate(board: CellState[][], friendlyStone: StoneType): number {
    let friendlyWeightSum = 0;
    let enemyWeightSum = 0;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((friendlyStone === 'BLACK' && board[i][j] === 'BLACK') || (friendlyStone === 'WHITE' && board[i][j] === 'WHITE')) {
                friendlyWeightSum += weightedBoard[i][j];
            }
            if ((friendlyStone === 'BLACK' && board[i][j] === 'WHITE') || (friendlyStone === 'WHITE' && board[i][j] === 'BLACK')) {
                enemyWeightSum += weightedBoard[i][j];
            }
        }
    }

    return friendlyWeightSum - enemyWeightSum;
}
