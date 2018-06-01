const fs = require('fs'); 
const readline = require('readline');

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
        return new Promise((resolve, reject) => {

            const lineReader = readline.createInterface({
                input: fs.createReadStream(filename)
            })

            lineReader.on('line', (line) => {
                this.library.push(line.trim());
            });

            lineReader.on('close', () => {
                resolve();
            });
        })
    }
}

module.exports = {
    Library: new Library(),
    LibraryNotLoadedError
}