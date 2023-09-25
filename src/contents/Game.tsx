import { css } from '@linaria/core';
import Button from '@mui/material/Button';
import { createContext, useContext, useState } from 'react';

import { StoneType } from '../types/StoneType';
import Board from './Reversi/Board';

// Defining Context Types
type ContextTurn = {
    isBlackTurn: boolean;
};

type ContextGameBoard = {
    gameBoard: StoneType[][];
    tryPlace: (stone: StoneType, row: number, column: number) => void;
    getReversible: (friendlyStone: StoneType, row: number, column: number) => number[][];
};

// Create Contexts
const Turn = createContext<ContextTurn>({
    isBlackTurn: true,
});

const GameBoard = createContext<ContextGameBoard>({
    gameBoard: [],
    tryPlace: () => {},
    getReversible: () => [],
});

// Use Contexts
export const useTurn = (): ContextTurn => {
    return useContext(Turn);
};

export const useGameBoard = (): ContextGameBoard => {
    return useContext(GameBoard);
};

// Styles
const mainStyles = css`
    padding-top: 150px;

    z-index: 1;
`;

const gameInfoAreaStyles = css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin: 0 auto;
    margin-top: 30px;

    width: 350px;
    height: 50px;
`;

const gameInfoStyles = css`
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 8px 22px;

    font-size: 20px;
    background-color: gray;
    border-radius: 4px;
`;

const Game = (): JSX.Element => {
    const [isBlackTurn, setIsBlackTurn] = useState(true);
    const [gameBoard, setGameBoard] = useState<StoneType[][]>([
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'WHITE', 'BLACK', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'BLACK', 'WHITE', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
    ]);

    const getReversible = (friendlyStone: StoneType, row: number, column: number): number[][] => {
        if (gameBoard[row][column] !== 'EMPTY') {
            return [];
        }

        const reversible: number[][] = [];
        const enemyStone: StoneType = friendlyStone === 'BLACK' ? 'WHITE' : 'BLACK';

        const direction = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

        for (const [x, y] of direction) {
            let fixedX = row + x;
            let fixedY = column + y;

            if (0 <= fixedX && fixedX <= 7 && 0 <= fixedY && fixedY <= 7) {
                if (gameBoard[fixedX][fixedY] === enemyStone) {
                    const tempReversible: number[][] = [[fixedX, fixedY]];

                    while (0 <= fixedX + x && fixedX + x <= 7 && 0 <= fixedY + y && fixedY + y <= 7) {
                        fixedX += x;
                        fixedY += y;

                        if (gameBoard[fixedX][fixedY] === 'EMPTY') {
                            break;
                        } else if (gameBoard[fixedX][fixedY] === enemyStone) {
                            tempReversible.push([fixedX, fixedY]);
                        } else if (gameBoard[fixedX][fixedY] === friendlyStone) {
                            reversible.push(...tempReversible);
                            break;
                        }
                    }
                }
            }
        }

        return reversible;
    };

    const tryPlace = (stone: StoneType, row: number, column: number): void => {
        const reversible = getReversible(stone, row, column);

        if (1 <= reversible.length) {
            setGameBoard((prev) => {
                // 選択された座標に石を置く
                prev[row][column] = stone;

                // 反転可能な座標の石を上書きする
                for (const [x, y] of reversible) {
                    prev[x][y] = stone;
                }

                return prev;
            });

            setIsBlackTurn((prev) => !prev);
        }
    };

    const turnValue: ContextTurn = { isBlackTurn };
    const gameBoardValue: ContextGameBoard = { gameBoard, tryPlace, getReversible };

    let isGameEnd = false;
    let shouldSkip = false;
    let shouldBlackTurnSkip = true;
    let shouldWhiteTurnSkip = true;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const reversible = getReversible('BLACK', i, j);
            if (1 <= reversible.length) {
                shouldBlackTurnSkip = false;
                break;
            }
        }

        if (!shouldBlackTurnSkip) {
            break;
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const reversible = getReversible('WHITE', i, j);
            if (1 <= reversible.length) {
                shouldWhiteTurnSkip = false;
                break;
            }
        }

        if (!shouldWhiteTurnSkip) {
            break;
        }
    }

    let winnerInfo: JSX.Element = <span>引き分け！</span>;

    if (shouldBlackTurnSkip && shouldWhiteTurnSkip) {
        isGameEnd = true;

        let blackStones = 0;
        let whiteStones = 0;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (gameBoard[i][j] === 'BLACK') {
                    blackStones++;
                }
                if (gameBoard[i][j] === 'WHITE') {
                    whiteStones++;
                }
            }
        }

        if (whiteStones < blackStones) {
            winnerInfo = <span style={{ color: 'black' }}>黒の勝ち ({blackStones}-{whiteStones})</span>;
        } else if (blackStones < whiteStones) {
            winnerInfo = <span style={{ color: 'white' }}>白の勝ち ({whiteStones}-{blackStones})</span>;
        }
    }

    if ((isBlackTurn && shouldBlackTurnSkip) || (!isBlackTurn && shouldWhiteTurnSkip)) {
        shouldSkip = true;
    }

    const confirmSkip = (): void => {
        setIsBlackTurn((prev) => !prev);
    };

    const confirmRestart = (): void => {
        setIsBlackTurn(true);
        setGameBoard([
            ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
            ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
            ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
            ['EMPTY', 'EMPTY', 'EMPTY', 'WHITE', 'BLACK', 'EMPTY', 'EMPTY', 'EMPTY'],
            ['EMPTY', 'EMPTY', 'EMPTY', 'BLACK', 'WHITE', 'EMPTY', 'EMPTY', 'EMPTY'],
            ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
            ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
            ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
        ]);
    };

    return (
        <main className={mainStyles}>
            <Turn.Provider value={turnValue}>
                <GameBoard.Provider value={gameBoardValue}>
                    <Board size='390px' />
                </GameBoard.Provider>
            </Turn.Provider>
            <div className={gameInfoAreaStyles}>
                <div className={gameInfoStyles}>
                    {isGameEnd
                        ? winnerInfo
                        : isBlackTurn
                        ? <span style={{ color: 'black' }}>黒の手番です</span>
                        : <span style={{ color: 'white' }}>白の手番です</span>}
                </div>
                {isGameEnd
                    ? <Button variant='contained' color='success' size='large' onClick={confirmRestart}>もう一度遊ぶ</Button>
                    : shouldSkip
                    ? <Button variant='contained' size='large' onClick={confirmSkip}>スキップ</Button>
                    : <Button variant='contained' size='large' style={{ color: '#ffffff30' }} disabled>スキップ</Button>}
            </div>
        </main>
    );
};

export default Game;
