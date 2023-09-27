import { css } from '@linaria/core';

import { useGuide } from '../../contexts/Guide';
import { Reversi } from '../../Reversi/Reversi';
import { BoardInfo } from '../../types/BoardInfo';
import { StoneType } from '../../types/StoneType';
import Stone from './Stone';

type Props = {
    row: number;
    column: number;
    canClick: boolean;

    reversi: Reversi;
    reversiBoard: BoardInfo[][];
    setReversiBoard: React.Dispatch<React.SetStateAction<BoardInfo[][]>>;
};

const squareStyles = css`
    position: relative;

    background-color: #32a852;
    user-select: none;
`;

const blackOverlayStyles = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 101%;
    height: 101%;
    background-color: #0000006d;
`;

const whiteOverlayStyles = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 101%;
    height: 101%;
    background-color: #ffffff6d;
`;

const Square = ({ row, column, canClick, reversi, reversiBoard, setReversiBoard }: Props): JSX.Element => {
    const { guide } = useGuide();

    const handleClick = (): void => {
        if (canClick) {
            reversi.tryPlace(row, column);

            // structuredClone()で配列のディープコピーを作成する
            setReversiBoard(structuredClone(reversiBoard));
        }
    };

    const stone: StoneType = reversi.isBlackTurn ? 'BLACK' : 'WHITE';
    const reversible = reversi.getReversibleCoords(stone, row, column);

    return (
        <td className={squareStyles} onClick={handleClick}>
            {reversi.board[row][column] === 'EMPTY'
                ? (guide && 1 <= reversible.length) && (
                    reversi.isBlackTurn
                        ? <div className={blackOverlayStyles} />
                        : <div className={whiteOverlayStyles} />
                )
                : reversi.board[row][column] === 'BLACK'
                ? <Stone type='BLACK' />
                : <Stone type='WHITE' />}
        </td>
    );
};

export default Square;
