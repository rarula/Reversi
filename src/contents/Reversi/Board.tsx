import { css } from '@linaria/core';

import Square from './Square';

type Props = {
    size: string;
};

const boardStyles = css`
    margin: 0 auto;
    background-color: #3c3c3c;
`;

const Board = ({ size }: Props): JSX.Element => {
    const squares: JSX.Element[] = [];

    for (let i = 0; i < 8; i++) {
        const rows: JSX.Element[] = [];

        for (let j = 0; j < 8; j++) {
            rows.push(
                <Square row={i} column={j} />,
            );
        }
        squares.push(
            <tr>
                {...rows}
            </tr>,
        );
    }

    return (
        <table className={boardStyles} style={{ padding: `calc(${size} * 0.01)`, width: size, height: size }}>
            <tbody>
                {...squares}
            </tbody>
        </table>
    );
};

export default Board;
