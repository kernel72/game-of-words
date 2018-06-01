const {Library} = require('./core/library');
const {GameSession} = require('./core/gameSession');

const path = require('path');

Library.loadLibraryFromFile(path.resolve(__dirname, './dicts/words-rus.txt'));

module.exports = GameSession;