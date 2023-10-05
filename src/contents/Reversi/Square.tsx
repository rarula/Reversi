import { css } from '@emotion/react';

import { useGuide } from '../../contexts/Guide';
import { CellState } from '../../types/Reversi';
import { Move } from '../../types/Wasm';
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
    const { engine, isPlayerTurn, isBlackTurn, toggleTurn, setBlackBoard, setWhiteBoard, lastMove, setLastMove } = useReversi();
    const { guide } = useGuide();

    const legal = engine?.legal(move.row, move.col);

    const handleClick = (): void => {
        if (isPlayerTurn) {
            if (legal && engine) {
                const movedReversi = engine.move(move.row, move.col);

                setBlackBoard(BigInt(movedReversi.getBlackBoard()));
                setWhiteBoard(BigInt(movedReversi.getWhiteBoard()));
                setLastMove(move);
                toggleTurn();
            }
        }
    };

    return (
        <td css={squareStyles} onClick={handleClick}>
            {(guide && lastMove?.row === move.row && lastMove.col === move.col) && <div css={lastPlacedOverlayStyles} />}
            {cellState === 'EMPTY'
                ? (guide && legal) && (
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
