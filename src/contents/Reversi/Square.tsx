import { css } from '@linaria/core';

import { StoneType } from '../../types/StoneType';
import { useGameBoard, useTurn } from '../Game';
import Stone from './Stone';

type Props = {
    row: number;
    column: number;
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

const Square = ({ row, column }: Props): JSX.Element => {
    const { isBlackTurn } = useTurn();
    const { gameBoard, tryPlace, getReversible } = useGameBoard();

    const handleClick = (): void => {
        const stone: StoneType = isBlackTurn ? 'BLACK' : 'WHITE';
        tryPlace(stone, row, column);
    };

    const friendlyStone: StoneType = isBlackTurn ? 'BLACK' : 'WHITE';
    const reversible = getReversible(friendlyStone, row, column);

    return (
        <>
            <td className={squareStyles} onClick={handleClick}>
                {gameBoard[row][column] === 'EMPTY'
                    ? 1 <= reversible.length && (
                        isBlackTurn
                            ? <div className={blackOverlayStyles} />
                            : <div className={whiteOverlayStyles} />
                    )
                    : gameBoard[row][column] === 'BLACK'
                    ? <Stone type='black' />
                    : <Stone type='white' />}
            </td>
        </>
    );
};

export default Square;
