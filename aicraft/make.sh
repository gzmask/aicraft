java -jar compiler.jar --js ./aicraft.js ./core/gameobject.js ./gameobjects/ai.js ./gameobjects/player.js --js_output_file ./build/aicraft.js
cp ./build/aicraft.js ../public/js/
