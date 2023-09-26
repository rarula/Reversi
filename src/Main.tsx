import { css } from '@linaria/core';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import Demo from './contents/Game/Demo';
import SinglePlay from './contents/Game/SinglePlay';
import VersusPlay from './contents/Game/VersusPlay';
import Header from './contents/Header';
import GuideProvider from './contexts/Guide';
import { PlayStyle } from './types/PlayStyle';
import { StoneType } from './types/StoneType';

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

const mainStyles = css`
    padding-top: 150px;

    z-index: 1;
`;

const boxStyles: SxProps = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    padding: '20px',
    width: '370px',

    color: 'black',
    backgroundColor: 'white',
    border: '2px solid #353535',
    boxShadow: 24,
    outline: 0,
};

const nestedBoxStyles: SxProps = {
    display: 'flex',
    justifyContent: 'space-between',

    marginTop: '10px',
    marginX: '30px',
};

const Main = (): JSX.Element => {
    const [open, setOpen] = useState(true);
    const [playStyle, setPlayStyle] = useState<PlayStyle>('DEMO');
    const [playerStone, setPlayerStone] = useState<StoneType>('BLACK');

    const chooseSinglePlay = (): void => {
        setOpen(false);
        setPlayStyle('SINGLE');
    };

    const chooseVersusPlay = (playerStone: StoneType): void => {
        setOpen(false);
        setPlayStyle('VERSUS');
        setPlayerStone(playerStone);
    };

    return (
        <GuideProvider>
            <div className={globalStyles}>
                <Modal open={open}>
                    <Fade in={open}>
                        <Box sx={boxStyles}>
                            <Typography variant='h6' align='center'>
                                遊び方を選んでください
                            </Typography>
                            <Divider />
                            <Box sx={nestedBoxStyles}>
                                <Button variant='outlined' onClick={chooseSinglePlay}>
                                    ひとりで
                                </Button>
                                <VersusPlayModal chooseVersusPlay={chooseVersusPlay} />
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
                <Header />
                <main className={mainStyles}>
                    {playStyle === 'DEMO' && <Demo />}
                    {playStyle === 'SINGLE' && <SinglePlay />}
                    {playStyle === 'VERSUS' && <VersusPlay playerStone={playerStone} />}
                </main>
            </div>
        </GuideProvider>
    );
};

type VersusPlayModalProps = {
    chooseVersusPlay: (playerStone: StoneType) => void;
};

const VersusPlayModal = ({ chooseVersusPlay }: VersusPlayModalProps): JSX.Element => {
    const [open, setOpen] = useState(false);

    const handleOpen = (): void => setOpen(true);
    const handleClose = (): void => setOpen(false);

    const chooseBlackStone = (): void => {
        setOpen(false);
        chooseVersusPlay('BLACK');
    };
    const chooseWhiteStone = (): void => {
        setOpen(false);
        chooseVersusPlay('WHITE');
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Fade in={open}>
                    <Box sx={{ ...boxStyles, width: '330px' }}>
                        <Typography variant='h6' align='center'>
                            あなたの手番を選んでください
                        </Typography>
                        <Divider />
                        <Box sx={{ ...nestedBoxStyles, marginX: '20px' }}>
                            <Button variant='outlined' onClick={chooseBlackStone}>
                                先手（黒）
                            </Button>
                            <Button variant='outlined' onClick={chooseWhiteStone}>
                                後手（白）
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Button variant='outlined' onClick={handleOpen}>
                AIと対戦
            </Button>
        </>
    );
};

export default Main;
