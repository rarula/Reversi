import { css } from '@emotion/react';

import { CellState } from '../../types/Reversi';
import { ReversiEngine } from '../../types/Wasm';
import { useReversi } from './Reversi';
import Square from './Square';

const boardStyles = css`
    padding: 5px;
    width: 410px;
    height: 410px;
    border-radius: 10px;
    background-color: var(--board);
    box-shadow: 0px 0px 4px 1px #000000;

    @media screen and (max-width: 580px) {
        width: 360px;
        height: 360px;
    }
`;

const Board = (): JSX.Element => {
    const { engine } = useReversi();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const board = getCellStates(engine!);

    return (
        <table css={boardStyles}>
            <tbody>
                {board.map((cellStates, rowIndex) => (
                    <tr key={rowIndex}>
                        {cellStates.map((cellState, columnIndex) => <Square key={columnIndex} move={{ row: rowIndex, col: columnIndex }} cellState={cellState} />)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const getCellStates = (engine: ReversiEngine): CellState[][] => {
    const cellStatesList: CellState[][] = [];

    for (let i = 0; i < 8; i++) {
        const cellStates: CellState[] = [];

        for (let j = 0; j < 8; j++) {
            cellStates.push(getCellState(engine, i, j));
        }

        cellStatesList.push(cellStates);
    }

    return cellStatesList;
};

const getCellState = (engine: ReversiEngine, row: number, col: number): CellState => {
    const pos = 63 - (row * 8 + col);
    const mask = 1n << BigInt(pos);

    const blackBoard = BigInt(engine.getBlackBoard());
    const whiteBoard = BigInt(engine.getWhiteBoard());

    if ((blackBoard & mask) !== 0n) {
        return 'BLACK';
    } else if ((whiteBoard & mask) !== 0n) {
        return 'WHITE';
    }

    return 'EMPTY';
};

export default Board;
