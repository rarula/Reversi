import { css } from '@linaria/core';

import { useGuide } from '../contexts/Guide';

const headerStyles = css`
    display: flex;
    position: fixed;
    justify-content: space-between;
    align-items: center;

    padding: 10px;

    width: 100vw;
    height: 56px;
    background-color: #353535;
    box-shadow: 0 0 9px -3px #000000;

    user-select: none;
    z-index: 2;
`;

const titleStyles = css`
    font-size: 25px;
`;

const itemStyles = css`
    display: flex;
    align-items: center;
`;

const guideItemStyles = css`
    display: flex;
    align-items: center;

    margin: 0 16px;
    fill: #747474;

    cursor: pointer;

    &:hover {
        fill: #8b8b8b
    }
`;

const githubItemStyles = css`
    display: flex;
    align-items: center;

    margin: 0 16px;
    fill: #747474;

    cursor: pointer;

    &:hover {
        fill: #8b8b8b
    }
`;

const Header = (): JSX.Element => {
    const { guide, toggleGuide } = useGuide();

    const clickGuide = (): void => {
        toggleGuide();
    };

    return (
        <header className={headerStyles}>
            <h1 className={titleStyles}>
                Reversi
            </h1>
            <div className={itemStyles}>
                {guide
                    ? (
                        <svg className={guideItemStyles} onClick={clickGuide} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='26' height='26'>
                            <path d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'>
                            </path>
                        </svg>
                    )
                    : (
                        <svg className={guideItemStyles} onClick={clickGuide} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='26' height='26'>
                            <path d='M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z'>
                            </path>
                        </svg>
                    )}
                <a className={githubItemStyles} href='https://github.com/rarula/Reversi' target='_blank' rel='noreferrer'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='26' height='26'>
                        <path d='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'>
                        </path>
                    </svg>
                </a>
            </div>
        </header>
    );
};

export default Header;
