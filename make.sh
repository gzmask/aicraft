java -jar ./engine_aicraft/compiler.jar --js \
	./engine_aicraft/aicraft.js\
	./engine_aicraft/core/gameobject.js\
	./engine_aicraft/gameobjects/ai.js\
	./engine_aicraft/gameobjects/player.js\
	./engine_aicraft/helpers/requestanimationframe.js\
	./engine_aicraft/core/engine.js\
	./engine_aicraft/core/clientengine.js\
	--js_output_file ./engine_aicraft/build/aicraft.js\
	--formatting PRETTY_PRINT

cp ./engine_aicraft/build/aicraft.js ./public/js/
