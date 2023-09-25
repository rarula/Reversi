import { css } from '@linaria/core';

import Game from './contents/Game';
import Header from './contents/Header';

const globalStyles = css`
    :global() {
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Roboto, Helvetica, Arial, sans-serif;
            color: #dcdcdc;
            background-color: #2b2b2b;
        }
    }
`;

const Main = (): JSX.Element => {
    return (
        <div className={globalStyles}>
            <Header />
            <Game />
        </div>
    );
};

export default Main;
