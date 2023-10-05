#pragma once
#include <emscripten.h>
#include <stdint.h>

class Reversi {
    private:
        bool _is_black_turn;
        uint64_t _black_board;
        uint64_t _white_board;
        uint64_t _last_move;

        uint64_t try_flip(uint64_t move, int direction);

    public:
        struct Result {
            int black_stones;
            int white_stones;
        };

        Reversi(bool is_black_turn, std::string black_board, std::string white_board);
        Reversi(bool is_black_turn, uint64_t black_board, uint64_t white_board);

        bool operator==(const Reversi& another) const {
            if (this->_is_black_turn != another._is_black_turn) {
                return false;
            }
            if (this->_black_board != another._black_board) {
                return false;
            }
            if (this->_white_board != another._white_board) {
                return false;
            }

            return true;
        }

        bool operator!=(const Reversi& another) const {
            return !(this->operator==(another));
        }

        struct hash {
            std::size_t operator()(const Reversi& reversi) const {
                std::size_t res = 17;
                res = res * 31 + std::hash<uint64_t>()( reversi._black_board );
                res = res * 31 + std::hash<uint64_t>()( reversi._white_board );
                return res;
            }
        };

        /**
         * @return 黒のビットボードを文字列として返します
         */
        std::string black_board_to_string();

        /**
         * @return 白のビットボードを文字列として返します
         */
        std::string white_board_to_string();

        /**
         * @return 黒の手番ならtrueを返し、それ以外の場合はfalseを返します
         */
        bool is_black_turn();

        /**
         * @return 黒のビットボードを返します
         */
        uint64_t get_black_board();

        /**
         * @return 白のビットボードを返します
         */
        uint64_t get_white_board();

        /**
         * @return 最後の着手場所のビットボードを返します
         */
        uint64_t get_last_move();

        /**
         * @return 現在の手番視点のビットボードを返します
         */
        uint64_t get_friendly_board();

        /**
         * @return 現在の手番に対して相手視点のビットボードを返します
         */
        uint64_t get_enemy_board();

        /**
         * @return 現在の手番にとって指定された手が合法手であるならtrueを返し、それ以外の場合はfalseを返します
         */
        bool legal(int row, int col);

        /**
         * @return 現在の手番における合法手をビットボードで返します
         */
        uint64_t make_legal_board();

        /**
         * @return 指定された手を打った後の状況を新しいインスタンスで返します
         */
        Reversi move(int row, int col);

        /**
         * @return 現在の手番がパスの状況であり、かつ次の手番がパスの状況でない場合はtrueを返し、それ以外の場合はfalseを返します
         */
        bool is_pass();

        /**
         * @return 終局している場合はtrueを返し、それ以外の場合はfalseを返します
         */
        bool is_finished();

        /**
         * @return 両手番の石の数を返します
         */
        Result get_result();
};
