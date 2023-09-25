import { css } from '@linaria/core';

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

const githubLinkStyles = css`
    display: flex;
    align-items: center;

    margin: 10px;

    fill: #747474;

    &:hover {
        fill: #8b8b8b
    }
`;

const Header = (): JSX.Element => {
    return (
        <header className={headerStyles}>
            <h1 className={titleStyles}>
                Reversi
            </h1>
            <a className={githubLinkStyles} href='https://github.com/rarula/Reversi' target='_blank' rel='noreferrer'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='26' height='26'>
                    <path d='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'>
                    </path>
                </svg>
            </a>
        </header>
    );
};

export default Header;
