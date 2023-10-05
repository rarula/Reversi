import { css } from '@emotion/react';

import { StoneType } from '../../types/Reversi';

type Props = {
    type: StoneType;
};

const stoneStyles = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    border-radius: 50%;
    box-shadow: 0 0 4px -1px #000000;
`;

const Stone = ({ type }: Props): JSX.Element => {
    return <div css={stoneStyles} style={{ backgroundColor: type }} />;
};

export default Stone;
