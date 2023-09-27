import { css } from '@linaria/core';

import { Reversi } from '../../Reversi/Reversi';
import { BoardInfo } from '../../types/BoardInfo';
import Square from './Square';

type Props = {
    size: string;
    canClick: boolean;

    reversi: Reversi;
    reversiBoard: BoardInfo[][];
    setReversiBoard: React.Dispatch<React.SetStateAction<BoardInfo[][]>>;
};

const boardStyles = css`
    margin: 0 auto;
    background-color: #3c3c3c;
`;

const Board = ({ size, canClick, reversi, reversiBoard, setReversiBoard }: Props): JSX.Element => {
    const squaresList: JSX.Element[] = [];

    for (let i = 0; i < 8; i++) {
        const squares: JSX.Element[] = [];

        for (let j = 0; j < 8; j++) {
            squares.push(
                <Square
                    row={i}
                    column={j}
                    canClick={canClick}
                    reversi={reversi}
                    reversiBoard={reversiBoard}
                    setReversiBoard={setReversiBoard}
                />,
            );
        }

        squaresList.push(
            <tr>{...squares}</tr>,
        );
    }

    return (
        <table className={boardStyles} style={{ padding: `calc(${size} * 0.01)`, width: size, height: size }}>
            <tbody>
                {...squaresList}
            </tbody>
        </table>
    );
};

export default Board;
