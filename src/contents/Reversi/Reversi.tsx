import { css } from '@emotion/react';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { createContext, useContext, useState } from 'react';

import { useWasm } from '../../contexts/Wasm';
import { StoneType } from '../../types/Reversi';
import { Move, ReversiEngine } from '../../types/Wasm';
import Board from './Board';

type Props = {
    aiLevel: number;
    playableStones: StoneType[];
};

type ContextReversi = {
    engine?: ReversiEngine;
    isPlayerTurn: boolean;
    isBlackTurn: boolean;
    toggleTurn: () => void;
    setBlackBoard: (board: bigint) => void;
    setWhiteBoard: (board: bigint) => void;
    lastMove: Move | null;
    setLastMove: (lastMove: Move) => void;
};

const ContextReversi = createContext<ContextReversi>({
    isPlayerTurn: true,
    isBlackTurn: true,
    toggleTurn: () => {},
    setBlackBoard: () => {},
    setWhiteBoard: () => {},
    lastMove: null,
    setLastMove: () => {},
});

export const useReversi = (): ContextReversi => {
    return useContext(ContextReversi);
};

const gameInfoStyles = css`
    margin: 40px 0;
    width: 370px;
    font-weight: bold;

    @media screen and (max-width: 580px) {
        width: 320px;
    }
`;

const detailedGameInfoStyles = css`
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    border-radius: 30px;
    border: 1px solid gray;
    box-shadow: 0px 0px 4px 1px #000000;
`;

const gamePanelStyles = css`
    margin-top: 40px;
`;

const skipModalSx: SxProps = {
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

const Reversi = ({ aiLevel, playableStones }: Props): JSX.Element => {
    const { isLoaded, Reversi, searchBestMove } = useWasm();

    if (!isLoaded || !Reversi || !searchBestMove) {
        return <span>ロード中...</span>;
    }

    // 00000000 00000000 00000000 00001000 00010000 00000000 00000000 00000000
    const [blackBoard, setBlackBoard] = useState(0x810000000n);

    // 00000000 00000000 00000000 00010000 00001000 00000000 00000000 00000000
    const [whiteBoard, setWhiteBoard] = useState(0x1008000000n);

    const [isBlackTurn, setBlackTurn] = useState(true);
    const [lastMove, setLastMove] = useState<Move | null>(null);
    const [openSkipModal, setSkipModal] = useState(false);

    const engine = new Reversi(isBlackTurn, blackBoard.toString(), whiteBoard.toString());
    const isPlayerTurn = ((isBlackTurn && playableStones.includes('BLACK')) || !isBlackTurn && playableStones.includes('WHITE'));
    const toggleTurn = (): void => {
        setBlackTurn((prev) => !prev);
    };

    const value: ContextReversi = {
        engine,
        isPlayerTurn,
        isBlackTurn,
        toggleTurn,
        setBlackBoard,
        setWhiteBoard,
        lastMove,
        setLastMove,
    };

    const clickRestart = (): void => {
        setBlackBoard(0x810000000n);
        setWhiteBoard(0x1008000000n);
        setBlackTurn(true);
        setLastMove(null);
    };

    const confirmSkip = (): void => {
        toggleTurn();
        setSkipModal(false);
    };

    const shouldFinish = engine.isFinished();
    const shouldPass = engine.isPass();

    if (!isPlayerTurn && !shouldFinish && !shouldPass) {
        setTimeout(() => {
            const move = searchBestMove(isBlackTurn, blackBoard.toString(), whiteBoard.toString(), aiLevel);

            if (move) {
                const movedReversi = engine.move(move.row, move.col);

                setBlackBoard(BigInt(movedReversi.getBlackBoard()));
                setWhiteBoard(BigInt(movedReversi.getWhiteBoard()));
                setLastMove(move);
                toggleTurn();
            }
        }, 100);
    }

    if (!openSkipModal && !isPlayerTurn && shouldPass) {
        setSkipModal(true);
    }

    const { blackStones, whiteStones } = engine.getResult();
    const totalStones = blackStones + whiteStones;

    return (
        <ContextReversi.Provider value={value}>
            <div css={gameInfoStyles}>
                {shouldFinish
                    ? blackStones === whiteStones
                        ? <div style={{ textAlign: 'center' }}>引き分け</div>
                        : blackStones < whiteStones
                        ? <div style={{ textAlign: 'center' }}>白の勝利</div>
                        : <div style={{ textAlign: 'center' }}>黒の勝利</div>
                    : isBlackTurn
                    ? <div style={{ textAlign: 'left' }}>黒の手番</div>
                    : <div style={{ textAlign: 'right' }}>白の手番</div>}
                <div
                    css={detailedGameInfoStyles}
                    style={{ background: `linear-gradient(90deg, #1c1c1c 0%, #1c1c1c calc(100% * ${blackStones / totalStones}), #f7f7f7 calc(100% * ${blackStones / totalStones}), #f7f7f7 100%)` }}
                >
                    <span style={{ color: 'white' }}>{blackStones}</span>
                    <span style={{ color: 'black' }}>{whiteStones}</span>
                </div>
            </div>
            <Board />
            <div css={gamePanelStyles}>
                {shouldFinish
                    ? <Button onClick={clickRestart} variant='contained' color='success' size='large'>もう一度遊ぶ</Button>
                    : isPlayerTurn
                    ? shouldPass && <Button onClick={toggleTurn} variant='contained' color='primary' size='large'>パス</Button>
                    : shouldPass && (
                        <Modal open={openSkipModal}>
                            <Fade in={openSkipModal}>
                                <Box sx={skipModalSx}>
                                    <Typography variant='body2' align='center'>
                                        AIの手番ですが、
                                    </Typography>
                                    <Typography variant='body2' align='center'>
                                        打てる手が無いため自動的にパスします
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                        <Button onClick={confirmSkip}>
                                            OK
                                        </Button>
                                    </Box>
                                </Box>
                            </Fade>
                        </Modal>
                    )}
            </div>
        </ContextReversi.Provider>
    );
};

export default Reversi;
