#include <stdint.h>

int bit_count(uint64_t x) {
    int count = 0;

    while (0 < x) {
        count += x & 1;
        x >>= 1;
    }

    return count;
}
