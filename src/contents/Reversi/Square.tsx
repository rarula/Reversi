import { css } from '@emotion/react';

import { useGuide } from '../../contexts/Guide';
import { getReversibleCoords, makeMove } from '../../Reversi/engine';
import { CellState } from '../../types/CellState';
import { Move } from '../../types/Move';
import { StoneType } from '../../types/StoneType';
import { useReversi } from './Reversi';
import Stone from './Stone';

type Props = {
    move: Move;
    cellState: CellState;
};

const squareStyles = css`
    position: relative;
    user-select: none;
    border-radius: 2px;
    background-color: var(--square);
`;

const blackOverlayStyles = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 101%;
    height: 101%;
    background-color: var(--black-overlay);
`;

const whiteOverlayStyles = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 101%;
    height: 101%;
    background-color: var(--white-overlay);
`;

const lastPlacedOverlayStyles = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 101%;
    height: 101%;
    background-color: var(--last-placed-overlay);
`;

const Square = ({ move, cellState }: Props): JSX.Element => {
    const { isPlayerTurn, isBlackTurn, toggleTurn, board, setBoard, lastMove, setLastMove } = useReversi();
    const { guide } = useGuide();

    const friendlyStone: StoneType = isBlackTurn ? 'BLACK' : 'WHITE';

    const handleClick = (): void => {
        if (isPlayerTurn) {
            const reversible = getReversibleCoords(board, friendlyStone, move);

            if (reversible.length) {
                toggleTurn();
                setBoard(makeMove(board, friendlyStone, move));
                setLastMove(move);
            }
        }
    };

    const reversible = getReversibleCoords(board, friendlyStone, move);

    return (
        <td css={squareStyles} onClick={handleClick}>
            {(guide && lastMove?.row === move.row && lastMove.col === move.col) && <div css={lastPlacedOverlayStyles} />}
            {cellState === 'EMPTY'
                ? (guide && 1 <= reversible.length) && (
                    isBlackTurn
                        ? <div css={blackOverlayStyles} />
                        : <div css={whiteOverlayStyles} />
                )
                : cellState === 'BLACK'
                ? <Stone type='BLACK' />
                : <Stone type='WHITE' />}
        </td>
    );
};

export default Square;
