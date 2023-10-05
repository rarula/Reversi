src/wasm/reversi.mjs: wasm/ai.cpp wasm/engine.cpp wasm/bit.cpp
	emcc -lembind --no-entry wasm/ai.cpp wasm/engine.cpp wasm/bit.cpp -o src/wasm/reversi.mjs \
	-s WASM=1 \
	-s SINGLE_FILE=1 \
	-s ENVIRONMENT='web' \
	-s EXPORT_NAME='createWasmModule' \
	-s USE_ES6_IMPORT_META=0 \
	-s EXPORTED_FUNCTIONS='["_malloc", "_free"]' \
	-s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
	-O3
