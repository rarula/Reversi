import { css } from '@emotion/react';
import { Slider, SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import Header from './contents/Header';
import Reversi from './contents/Reversi/Reversi';
import { StoneType } from './types/StoneType';

const mainStyles = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 56px;
    z-index: 1;
`;

const infoStyles = css`
    display: flex;
    justify-content: space-between;
    margin-top: 150px;
    width: 400px;
    height: 50px;

    @media screen and (max-width: 580px) {
        width: 300px;
    }
`;

const versusModalSx: SxProps = {
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

const nestedVersusModalSx: SxProps = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    marginX: '30px',
};

const Main = (): JSX.Element => {
    const [showBoard, setShowBoard] = useState(false);
    const [playableStones, setPlayableStones] = useState<StoneType[]>([]);

    const [openVersusModal, setVersusModal] = useState(false);
    const [openVersusTurnModal, setVersusTurnModal] = useState(false);
    const [aiLevel, setAiLevel] = useState(2);

    const clickSinglePlay = (): void => {
        setShowBoard(true);
        setPlayableStones(['BLACK', 'WHITE']);
    };

    const chooseAiLevel = (): void => {
        setVersusTurnModal(true);
    };

    const chooseTurn = (turn: StoneType): void => {
        setPlayableStones([turn]);
        setShowBoard(true);
        setVersusModal(false);
        setVersusTurnModal(false);
    };

    const handleHideBoard = (): void => {
        setShowBoard(false);
    };

    const handleHideVersusModal = (): void => {
        setVersusModal(false);
    };

    const handleHideVersusTurnModal = (): void => {
        setVersusTurnModal(false);
    };

    return (
        <>
            <Modal open={openVersusTurnModal} onClose={handleHideVersusTurnModal}>
                <Fade in={openVersusTurnModal}>
                    <Box sx={versusModalSx} style={{ width: '320px' }}>
                        <Typography variant='body2' align='center'>
                            あなたの手番を選択してください
                        </Typography>
                        <Box sx={nestedVersusModalSx}>
                            <Button onClick={(): void => chooseTurn('BLACK')}>
                                先手（黒石）
                            </Button>
                            <Button onClick={(): void => chooseTurn('WHITE')}>
                                後手（白石）
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Modal open={openVersusModal} onClose={handleHideVersusModal}>
                <Fade in={openVersusModal}>
                    <Box sx={versusModalSx}>
                        <Typography variant='body2' align='center'>
                            AIのレベルを選択してください
                        </Typography>
                        <Box sx={nestedVersusModalSx}>
                            <Slider valueLabelDisplay='auto' marks defaultValue={2} step={1} min={1} max={7} onChange={(event, value): void => setAiLevel(value as number)} />
                        </Box>
                        <Box sx={nestedVersusModalSx}>
                            <Button onClick={chooseAiLevel}>
                                OK
                            </Button>
                            <Button onClick={handleHideVersusModal}>
                                キャンセル
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Header clickHome={handleHideBoard} />
            <main css={mainStyles}>
                {showBoard && <Reversi aiLevel={aiLevel} playableStones={playableStones} />}
                {!showBoard && (
                    <div css={infoStyles}>
                        <Button variant='outlined' onClick={clickSinglePlay}>
                            ひとりで
                        </Button>
                        <Button variant='outlined' onClick={(): void => setVersusModal(true)}>
                            AIと対戦
                        </Button>
                    </div>
                )}
            </main>
        </>
    );
};

export default Main;
