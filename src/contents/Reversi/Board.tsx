import { css } from '@emotion/react';

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
    const { board } = useReversi();

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

export default Board;
