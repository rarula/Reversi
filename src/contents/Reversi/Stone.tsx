import { css } from '@linaria/core';

import { StoneType } from '../../types/StoneType';

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
`;

const Stone = ({ type }: Props): JSX.Element => {
    return <div className={stoneStyles} style={{ backgroundColor: type }} />;
};

export default Stone;
