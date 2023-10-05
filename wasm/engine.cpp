#include <emscripten.h>
#include <emscripten/bind.h>
#include <stdint.h>
#include <iostream>
#include "bit.hpp"
#include "engine.hpp"

Reversi::Reversi(bool is_black_turn, std::string black_board, std::string white_board) {
    this->_is_black_turn = is_black_turn;
    this->_black_board = std::stoull(black_board);
    this->_white_board = std::stoull(white_board);
}

Reversi::Reversi(bool is_black_turn, uint64_t black_board, uint64_t white_board) {
    this->_is_black_turn = is_black_turn;
    this->_black_board = black_board;
    this->_white_board = white_board;
}

std::string Reversi::black_board_to_string() {
    return std::to_string(this->_black_board);
}

std::string Reversi::white_board_to_string() {
    return std::to_string(this->_white_board);
}

bool Reversi::is_black_turn() {
    return this->_is_black_turn;
}

uint64_t Reversi::get_black_board() {
    return this->_black_board;
}

uint64_t Reversi::get_white_board() {
    return this->_white_board;
}

uint64_t Reversi::get_last_move() {
    return this->_last_move;
}

uint64_t Reversi::get_friendly_board() {
    return this->_is_black_turn ? this->_black_board : this->_white_board;
}

uint64_t Reversi::get_enemy_board() {
    return this->_is_black_turn ? this->_white_board : this->_black_board;
}

bool Reversi::legal(int row, int col) {
    const uint64_t move = 1ull << (63 - (row * 8 + col));
    const uint64_t legal_board = this->make_legal_board();

    if ((move & legal_board) != 0) {
        return true;
    }

    return false;
}

uint64_t Reversi::make_legal_board() {
    const uint64_t friendly_board = this->get_friendly_board();
    const uint64_t enemy_board = this->get_enemy_board();

    /**
     * 01111110
     * 01111110
     * 01111110
     * 01111110
     * 01111110
     * 01111110
     * 01111110
     * 01111110
     */
    const uint64_t horizontal_board_mask = enemy_board & 0x7E7E7E7E7E7E7E7E;

    /**
     * 00000000
     * 11111111
     * 11111111
     * 11111111
     * 11111111
     * 11111111
     * 11111111
     * 00000000
     */
    const uint64_t vertical_board_mask = enemy_board & 0xFFFFFFFFFFFF00;

    /**
     * 00000000
     * 01111110
     * 01111110
     * 01111110
     * 01111110
     * 01111110
     * 01111110
     * 00000000
     */
    const uint64_t diagonal_board_mask = enemy_board & 0x7E7E7E7E7E7E00;
    const uint64_t blank_board = ~(this->_black_board | this->_white_board);

    uint64_t temp_legal_board = 0;
    uint64_t legal_board = 0;

    // 右
    temp_legal_board = (friendly_board >> 1) & horizontal_board_mask;
    for (int i = 0; i < 5; i++) {
        temp_legal_board |= (temp_legal_board >> 1) & horizontal_board_mask;
    }
    legal_board |= (temp_legal_board >> 1) & blank_board;

    // 左
    temp_legal_board = (friendly_board << 1) & horizontal_board_mask;
    for (int i = 0; i < 5; i++) {
        temp_legal_board |= (temp_legal_board << 1) & horizontal_board_mask;
    }
    legal_board |= (temp_legal_board << 1) & blank_board;

    // 上
    temp_legal_board = (friendly_board << 8) & vertical_board_mask;
    for (int i = 0; i < 5; i++) {
        temp_legal_board |= (temp_legal_board << 8) & vertical_board_mask;
    }
    legal_board |= (temp_legal_board << 8) & blank_board;

    // 下
    temp_legal_board = (friendly_board >> 8) & vertical_board_mask;
    for (int i = 0; i < 5; i++) {
        temp_legal_board |= (temp_legal_board >> 8) & vertical_board_mask;
    }
    legal_board |= (temp_legal_board >> 8) & blank_board;

    // 右上
    temp_legal_board = (friendly_board << 7) & diagonal_board_mask;
    for (int i = 0; i < 5; i++) {
        temp_legal_board |= (temp_legal_board << 7) & diagonal_board_mask;
    }
    legal_board |= (temp_legal_board << 7) & blank_board;

    // 右下
    temp_legal_board = (friendly_board >> 9) & diagonal_board_mask;
    for (int i = 0; i < 5; i++) {
        temp_legal_board |= (temp_legal_board >> 9) & diagonal_board_mask;
    }
    legal_board |= (temp_legal_board >> 9) & blank_board;

    // 左上
    temp_legal_board = (friendly_board << 9) & diagonal_board_mask;
    for (int i = 0; i < 5; i++) {
        temp_legal_board |= (temp_legal_board << 9) & diagonal_board_mask;
    }
    legal_board |= (temp_legal_board << 9) & blank_board;

    // 左下
    temp_legal_board = (friendly_board >> 7) & diagonal_board_mask;
    for (int i = 0; i < 5; i++) {
        temp_legal_board |= (temp_legal_board >> 7) & diagonal_board_mask;
    }
    legal_board |= (temp_legal_board >> 7) & blank_board;

    return legal_board;
}

uint64_t Reversi::try_flip(uint64_t move, int direction) {
    switch (direction) {
    // 右
    case 0:
        return (move >> 1) & 0x7F7F7F7F7F7F7F7F;
    // 左
    case 1:
        return (move << 1) & 0xFEFEFEFEFEFEFEFE;
    // 上
    case 2:
        return (move << 8) & 0xFFFFFFFFFFFFFF00;
    // 下
    case 3:
        return (move >> 8) & 0xFFFFFFFFFFFFFF;
    // 右上
    case 4:
        return (move << 7) & 0x7F7F7F7F7F7F7F00;
    // 右下
    case 5:
        return (move >> 9) & 0x7F7F7F7F7F7F7F;
    // 左上
    case 6:
        return (move << 9) & 0xFEFEFEFEFEFEFE00;
    // 左下
    case 7:
        return (move >> 7) & 0xFEFEFEFEFEFEFE;
    default:
        return 0;
    }
}

Reversi Reversi::move(int row, int col) {
    uint64_t friendly_board = this->get_friendly_board();
    uint64_t enemy_board = this->get_enemy_board();

    const uint64_t move = 1ull << (63 - (row * 8 + col));
    uint64_t moved_board = 0;

    for (int direction = 0; direction < 8; direction++) {
        uint64_t temp_moved_board = 0;
        uint64_t mask = this->try_flip(move, direction);

        while ((mask != 0) && ((mask & enemy_board) != 0)) {
            temp_moved_board |= mask;
            mask = this->try_flip(mask, direction);
        }

        if ((mask & friendly_board) != 0) {
            moved_board |= temp_moved_board;
        }
    }

    friendly_board ^= move | moved_board;
    enemy_board ^= moved_board;

    const uint64_t black_board = this->_is_black_turn ? friendly_board : enemy_board;
    const uint64_t white_board = this->_is_black_turn ? enemy_board : friendly_board;

    Reversi reversi = Reversi(!this->_is_black_turn, black_board, white_board);
    reversi._last_move = move;

    return reversi;
}

bool Reversi::is_pass() {
    Reversi enemy_reversi = Reversi(!this->_is_black_turn, this->_black_board, this->_white_board);

    const uint64_t friendly_legal_board = this->make_legal_board();
    const uint64_t enemy_legal_board = enemy_reversi.make_legal_board();

    return friendly_legal_board == 0 && enemy_legal_board != 0;
}

bool Reversi::is_finished() {
    Reversi enemy_reversi = Reversi(!this->_is_black_turn, this->_black_board, this->_white_board);

    const uint64_t friendly_legal_board = this->make_legal_board();
    const uint64_t enemy_legal_board = enemy_reversi.make_legal_board();

    return friendly_legal_board == 0 && enemy_legal_board == 0;
}

Reversi::Result Reversi::get_result() {
    Result result;
    result.black_stones = bit_count(this->_black_board);
    result.white_stones = bit_count(this->_white_board);

    return result;
}

EMSCRIPTEN_BINDINGS(reversi_class) {
    emscripten::class_<Reversi>("Reversi")
        .constructor<bool, std::string, std::string>()
        .function("getBlackBoard", &Reversi::black_board_to_string)
        .function("getWhiteBoard", &Reversi::white_board_to_string)
        .function("isBlackTurn", &Reversi::is_black_turn)
        .function("move", &Reversi::move)
        .function("legal", &Reversi::legal)
        .function("isPass", &Reversi::is_pass)
        .function("isFinished", &Reversi::is_finished)
        .function("getResult", &Reversi::get_result);

    emscripten::value_object<Reversi::Result>("Result")
        .field("blackStones", &Reversi::Result::black_stones)
        .field("whiteStones", &Reversi::Result::white_stones);
}
