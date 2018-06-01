const fs = require('fs'); 
const readline = require('readline');
const logger = require('log4js').getLogger('app');

class LibraryNotLoadedError extends Error {}

class Library {
    constructor(){
        this.library = [];
    }

    getRandomWord(){
        if(!this.library.length){
            throw new LibraryNotInitialized("Library is not loaded");
        }

        const randomNum = Math.floor( Math.random() * Math.floor(this.library.length));
        return this.library[randomNum];
    }

    loadLibraryFromFile(filename){
        logger.warn(`Loading library ${filename}`);
        return new Promise((resolve, reject) => {

            const lineReader = readline.createInterface({
                input: fs.createReadStream(filename)
            });

            lineReader.on('line', (line) => {
                this.library.push(line.trim());
            });

            lineReader.on('close', () => {
                resolve();
                logger.info(`Library loaded! ${this.library.length} words added`);
            });
        })
    }
}

module.exports = {
    Library: new Library(),
    LibraryNotLoadedError
}