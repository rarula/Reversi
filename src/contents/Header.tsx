import { css } from '@emotion/react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FlagIcon from '@mui/icons-material/Flag';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { useGuide } from '../contexts/Guide';
import { useTheme } from '../contexts/Theme';

type Props = {
    clickHome: () => void;
};

const headerStyles = css`
    position: fixed;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    width: 100vw;
    height: 56px;
    z-index: 2;
    box-shadow: 0 0 9px -3px #000000;
    background-color: var(--background-1);
`;

const titleStyles = css`
    font-size: 25px;
    letter-spacing: 0.03em;
`;

const itemListStyles = css`
    display: flex;
    align-items: center;
`;

const itemSx: SxProps = {
    display: 'flex',
    alignItems: 'center',
    margin: '0 16px;',
    fontSize: '26px',
    cursor: 'pointer',
    color: 'var(--text-0)',

    '@media (hover: hover)': {
        '&:hover': {
            fill: 'var(--text-1)',
        },
    },
    '@media (hover: none)': {
        '&:active': {
            fill: 'var(--text-1)',
        },
    },
    '@media screen and (max-width: 580px)': {
        margin: '0 10px',
    },
};

const homeModalSx: SxProps = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '15px',
    width: '370px',
    backgroundColor: 'var(--background-0)',
    border: '2px solid var(--border-0)',
    borderRadius: '20px',
    boxShadow: 24,
    outline: 0,
};

const nestedHomeModalSx: SxProps = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    marginX: '30px',
};

const Header = ({ clickHome }: Props): JSX.Element => {
    const [homeModalOpen, setHomeModalOpen] = useState(false);

    const { guide, toggleGuide } = useGuide();
    const { theme, toggleTheme } = useTheme();

    const openHomeModal = (): void => {
        setHomeModalOpen(true);
    };

    const closeHomeModal = (): void => {
        setHomeModalOpen(false);
    };

    const _clickHome = (): void => {
        clickHome();
        closeHomeModal();
    };

    return (
        <>
            <Modal open={homeModalOpen} onClose={closeHomeModal}>
                <Fade in={homeModalOpen}>
                    <Box sx={homeModalSx}>
                        <Typography variant='body2' align='center'>
                            ホームに戻りますか？
                        </Typography>
                        <Typography variant='body2' align='center'>
                            （プレイ中のゲーム情報は失われます）
                        </Typography>
                        <Box sx={nestedHomeModalSx}>
                            <Button onClick={_clickHome}>
                                戻る
                            </Button>
                            <Button onClick={closeHomeModal}>
                                キャンセル
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <header css={headerStyles}>
                <div css={itemListStyles}>
                    <HomeIcon sx={itemSx} onClick={openHomeModal} />
                    <h1 css={titleStyles}>
                        Reversi
                    </h1>
                </div>
                <div css={itemListStyles}>
                    {guide
                        ? <FlagIcon sx={itemSx} onClick={toggleGuide} />
                        : <FlagOutlinedIcon sx={itemSx} onClick={toggleGuide} />}
                    {theme === 'light'
                        && <LightModeIcon sx={itemSx} onClick={toggleTheme} />}
                    {theme === 'dark'
                        && <DarkModeIcon sx={itemSx} onClick={toggleTheme} />}
                    <a href='https://github.com/rarula/Reversi' target='_blank' rel='noreferrer'>
                        <GitHubIcon sx={itemSx} />
                    </a>
                </div>
            </header>
        </>
    );
};

export default Header;
