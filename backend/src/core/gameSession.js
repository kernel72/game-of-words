const shortId = require('shortid');
const {MainWord} = require('./word');
const {Library} = require('./library');
const logger = require('log4js').getLogger('app');

class InvalidWordError extends Error {}
class WordAlreadyPresentError extends Error {}

class GameSession {
    constructor(){
        this._id = shortId.generate();       
        this.wordsHistory = [];
        this.mainWordInstance = new MainWord( Library.getRandomWord() );
        logger.info(`New game session started ${this._id}`);
    }

    applyWord(word){
        word = word && word.trim().toLowerCase();
        const [isValid, error] = this.mainWordInstance.isValidWord(word);

        if(!isValid){
            throw new InvalidWordError(error);
        }

        if(this.wordsHistory.includes(word)){
            throw new WordAlreadyPresentError("Word is already present");
        }

        this.wordsHistory.push(word);
    }

    getMainWord(){
        return this.mainWordInstance.mainWord;
    }
}


class GameSessions {
    constructor(){
        this.gameSessions = {};
    }

    getNewGame(){
        const game = new GameSession();
        this.gameSessions[game._id] = game;
        return game;
    }

    getGameSession(sessionId){
        return this.gameSessions[sessionId];
    }

    closeGameSession(sessionId){
        delete this.gameSessions[sessionId];
    }

}


module.exports = {
    GameSessions: new GameSessions(),
    InvalidWordError,
    WordAlreadyPresentError
}