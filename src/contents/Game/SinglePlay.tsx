import { css } from '@linaria/core';
import Button from '@mui/material/Button';
import { useState } from 'react';

import { Reversi } from '../../Reversi';
import { BoardInfo } from '../../types/BoardInfo';
import Board from '../Reversi/Board';

const gameInfoAreaStyles = css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin: 0 auto;
    margin-top: 30px;

    width: 350px;
    height: 50px;
`;

const gameInfoStyles = css`
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 8px 22px;

    font-size: 20px;
    background-color: gray;
    border-radius: 4px;
`;

const reversi = new Reversi('SINGLE', [
    ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
    ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
    ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
    ['EMPTY', 'EMPTY', 'EMPTY', 'WHITE', 'BLACK', 'EMPTY', 'EMPTY', 'EMPTY'],
    ['EMPTY', 'EMPTY', 'EMPTY', 'BLACK', 'WHITE', 'EMPTY', 'EMPTY', 'EMPTY'],
    ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
    ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
    ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
]);

const SinglePlay = (): JSX.Element => {
    const [reversiBoard, setReversiBoard] = useState<BoardInfo[][]>(reversi.board);

    const gameInfo = reversi.getGameInfo();

    const chooseSkip = (): void => {
        reversi.skipTurn();

        // structuredClone()で配列のディープコピーを作成する
        setReversiBoard(structuredClone(reversiBoard));
    };

    const chooseRestart = (): void => {
        reversi.restart();

        // structuredClone()で配列のディープコピーを作成する
        setReversiBoard(structuredClone(reversiBoard));
    };

    return (
        <>
            <Board size='390px' canClick reversi={reversi} reversiBoard={reversiBoard} setReversiBoard={setReversiBoard} />
            <div className={gameInfoAreaStyles}>
                <div className={gameInfoStyles}>
                    {gameInfo.isGameEnd
                        ? gameInfo.blackStones === gameInfo.whiteStones
                            ? <span style={{ color: 'white' }}>引き分け ({gameInfo.blackStones}-{gameInfo.whiteStones})</span>
                            : gameInfo.blackStones < gameInfo.whiteStones
                            ? <span style={{ color: 'white' }}>白の勝ち ({gameInfo.whiteStones}-{gameInfo.blackStones})</span>
                            : <span style={{ color: 'black' }}>黒の勝ち ({gameInfo.blackStones}-{gameInfo.whiteStones})</span>
                        : reversi.isBlackTurn
                        ? <span style={{ color: 'black' }}>黒の手番です</span>
                        : <span style={{ color: 'white' }}>白の手番です</span>}
                </div>
                {gameInfo.isGameEnd
                    ? <Button variant='contained' color='success' size='large' onClick={chooseRestart}>もう一度遊ぶ</Button>
                    : gameInfo.shouldSkip
                    ? <Button variant='contained' size='large' onClick={chooseSkip}>スキップ</Button>
                    : <Button variant='contained' size='large' style={{ color: '#ffffff30' }} disabled>スキップ</Button>}
            </div>
        </>
    );
};

export default SinglePlay;
