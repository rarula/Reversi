#include <emscripten.h>
#include <emscripten/bind.h>
#include <stdint.h>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include <iostream>
#include "bit.hpp"
#include "engine.hpp"

#define infinity 100000000

struct Move {
    int row;
    int col;
};

struct ChildNode {
    Reversi reversi = Reversi(true, 0ull, 0ull);
    int score;

    bool operator<(const ChildNode& another) const {
        return score > another.score;
    }
};

int visited_nodes = 0;

std::unordered_map<Reversi, int, Reversi::hash> transpose_map;
std::unordered_map<Reversi, int, Reversi::hash> former_transpose_map;

/**
 * 10000001
 * 00000000
 * 00000000
 * 00000000
 * 00000000
 * 00000000
 * 00000000
 * 10000001
 */
constexpr uint64_t weight_board_30 = 0x8100000000000081;

/**
 * 00100100
 * 00000000
 * 10100101
 * 00000000
 * 00000000
 * 10100101
 * 00000000
 * 00100100
 */
// constexpr uint64_t weight_board_0 = 0x2400A50000A50024;

/**
 * 00011000
 * 00000000
 * 00011000
 * 10111101
 * 10111101
 * 00011000
 * 00000000
 * 00011000
 */
constexpr uint64_t weight_board_negative_1 = 0x180018BDBD180018;

/**
 * 00000000
 * 00111100
 * 01000010
 * 01000010
 * 01000010
 * 01000010
 * 00111100
 * 00000000
 */
constexpr uint64_t weight_board_negative_3 = 0x3C424242423C00;

/**
 * 01000010
 * 10000001
 * 00000000
 * 00000000
 * 00000000
 * 00000000
 * 10000001
 * 01000010
 */
constexpr uint64_t weight_board_negative_12 = 0x4281000000008142;

/**
 * 00000000
 * 01000010
 * 00000000
 * 00000000
 * 00000000
 * 00000000
 * 01000010
 * 00000000
 */
constexpr uint64_t weight_board_negative_15 = 0x42000000004200;

int evaluate(Reversi reversi) {
    int friendly_weight_sum = 0;
    int enemy_weight_sum = 0;
    uint64_t weighted_board = 0;

    // 30
    weighted_board = reversi.get_friendly_board() & weight_board_30;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += 30;
        }
    }
    weighted_board = reversi.get_enemy_board() & weight_board_30;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += 30;
        }
    }

    // -1
    weighted_board = reversi.get_friendly_board() & weight_board_negative_1;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += -1;
        }
    }
    weighted_board = reversi.get_enemy_board() & weight_board_negative_1;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += -1;
        }
    }

    // -3
    weighted_board = reversi.get_friendly_board() & weight_board_negative_3;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += -3;
        }
    }
    weighted_board = reversi.get_enemy_board() & weight_board_negative_3;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += -3;
        }
    }

    // -12
    weighted_board = reversi.get_friendly_board() & weight_board_negative_12;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += -12;
        }
    }
    weighted_board = reversi.get_enemy_board() & weight_board_negative_12;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += -12;
        }
    }

    // -15
    weighted_board = reversi.get_friendly_board() & weight_board_negative_15;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += -15;
        }
    }
    weighted_board = reversi.get_enemy_board() & weight_board_negative_15;
    if (weighted_board != 0) {
        const int count = bit_count(weighted_board);
        for (int i = 0; i < count; i++) {
            friendly_weight_sum += -15;
        }
    }

    return friendly_weight_sum - enemy_weight_sum;
}

int get_move_ordering_score(Reversi reversi) {
    int score = 0;

    if (former_transpose_map.find(reversi) != former_transpose_map.end()) {
        score = 1000 - former_transpose_map[reversi];
    } else {
        score = -evaluate(reversi);
    }

    return score;
}

int fast_negative_alpha(Reversi reversi, int depth, bool passed, int alpha, int beta) {
    visited_nodes++;

    if (depth == 0) {
        return evaluate(reversi);
    }

    if (transpose_map.find(reversi) != transpose_map.end()) {
        return transpose_map[reversi];
    }

    std::vector<ChildNode> child_nodes;
    const uint64_t legal_board = reversi.make_legal_board();

    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            const uint64_t move = 1ull << (63 - (i * 8 + j));

            if ((move & legal_board) != 0) {
                const Reversi child_reversi = reversi.move(i, j);

                ChildNode child_node;
                child_node.reversi = child_reversi;
                child_node.score = get_move_ordering_score(child_reversi);

                child_nodes.push_back(child_node);
            }
        }
    }

    if (child_nodes.size() == 0) {
        if (passed) {
            return evaluate(reversi);
        }

        const Reversi passed_reversi = Reversi(!reversi.is_black_turn(), reversi.get_black_board(), reversi.get_white_board());
        return -fast_negative_alpha(passed_reversi, depth, true, -beta, -alpha);
    }

    if (2 <= child_nodes.size()) {
        std::sort(child_nodes.begin(), child_nodes.end());
    }

    int score = -infinity;
    for (const ChildNode child_node : child_nodes) {
        const int value = -fast_negative_alpha(child_node.reversi, depth - 1, false, -beta, -alpha);

        if (beta <= value) {
            return value;
        }

        score = std::max(score, value);
        alpha = std::max(alpha, value);
    }

    transpose_map[reversi] = score;
    return score;
}

Move search_best_move(bool is_black_turn, std::string black_board, std::string white_board, int depth) {
    visited_nodes = 0;
    transpose_map.clear();
    former_transpose_map.clear();

    Reversi reversi = Reversi(is_black_turn, black_board, white_board);

    std::vector<ChildNode> child_nodes;
    const uint64_t legal_board = reversi.make_legal_board();

    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            const uint64_t move = 1ull << (63 - (i * 8 + j));

            if ((move & legal_board) != 0) {
                const Reversi child_reversi = reversi.move(i, j);

                ChildNode child_node;
                child_node.reversi = child_reversi;
                child_node.score = -infinity;

                child_nodes.push_back(child_node);
            }
        }
    }

    uint64_t last_move = 0;

    Move fixed_last_move;
    fixed_last_move.row = -1;
    fixed_last_move.col = -1;

    int search_depth;
    const int start_depth = std::max(1, depth - 3);

    for (search_depth = start_depth; search_depth <= depth; search_depth++) {
        int alpha = -infinity;
        const int beta = infinity;

        if (2 <= child_nodes.size()) {
            for (ChildNode& child_node : child_nodes) {
                child_node.score = get_move_ordering_score(child_node.reversi);
            }
            std::sort(child_nodes.begin(), child_nodes.end());
        }

        for (ChildNode child_node : child_nodes) {
            const int score = -fast_negative_alpha(child_node.reversi, search_depth - 1, false, -beta, -alpha);

            if (alpha < score) {
                alpha = score;
                last_move = child_node.reversi.get_last_move();
            }
        }

        std::cout << "searched depth " << search_depth << " visited nodes " << visited_nodes << std::endl;

        transpose_map.swap(former_transpose_map);
        transpose_map.clear();
    }

    if (last_move != 0) {
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                const uint64_t move = 1ull << (63 - (i * 8 + j));

                if ((move & last_move) != 0) {
                    fixed_last_move.row = i;
                    fixed_last_move.col = j;
                    return fixed_last_move;
                }
            }
        }
    }

    return fixed_last_move;
}

EMSCRIPTEN_BINDINGS(ai_functions) {
    emscripten::function("searchBestMove", &search_best_move);

    emscripten::value_object<Move>("Move")
        .field("row", &Move::row)
        .field("col", &Move::col);
}
