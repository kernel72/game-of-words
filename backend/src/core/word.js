
class MainWord {
    constructor(word){
        this.mainWord = word.trim().toLowerCase();
        this.lettersMap = MainWord.parseWord(this.mainWord);
    }

    isValidWord(word){

        if(!word || word.length < 3){
            return [false, "Word should be more than 2 letters."];
        }

        if(word === this.mainWord){
            return [false, "Word is the same as main word"];
        }

        const letterMap = { ...this.lettersMap};
        
        for(let i = 0; i < word.length; i++){
            const char = word[i];

            if(char.toUpperCase() === char.toLowerCase()){
                return [false, "Word contains special symbols."];
            }

            const charsAmount = letterMap[char];

            if(charsAmount === undefined){
                return [false, `No letter '${char}' in this word`]
            }
            
            if(charsAmount === 0 ){
                return [false, `Only ${this.lettersMap[char]} entries of '${char}' is acceptable.`];
            }

            letterMap[char]--;
        }

        return [true]
    }

    static parseWord(word){
        const lettersMap = {};
        for(let i = 0; i < word.length; i++){
            const letter = word[i];
            if(lettersMap[letter] === undefined){
                lettersMap[letter] = 0;
            }
            lettersMap[letter] ++;
        }
        return lettersMap;
    }
}

module.exports = {MainWord};

