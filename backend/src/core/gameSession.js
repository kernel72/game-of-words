const shortId = require('shortid');
const {MainWord} = require('./word');
const {Library} = require('./library');

class InvalidWordError extends Error {}
class WordAlreadyPresentError extends Error {}

class GameSession {
    constructor(){
        this._id = shortId.generate();       
        this.wordsHistory = [];
        this.mainWord = new MainWord( Library.getRandomWord() );
    }

    applyWord(word){
        word = word && word.trim().toLowerCase();
        const [isValid, error] = this.mainWord.isValidWord(word);

        if(!isValid){
            throw new InvalidWordError(error);
        }

        if(this.wordsHistory.includes(word)){
            throw new WordAlreadyPresentError("Word is already present");
        }

        this.wordsHistory.push(word);
    }
}

module.exports = {
    GameSession,
    InvalidWordError,
    WordAlreadyPresentError
}