const fs = require('fs'); 
const path = require('path');
const readline = require('readline');

const lineReader = readline.createInterface({
    input: fs.createReadStream(path.resolve(__dirname, '../dicts/hagen-morf.txt'))
})

const words = []



lineReader.on('line', line => {
    line = line.trim();
    if(!line.length){
        return;
    }

    let [word, opts] = line.split('|');
    word = word.trim();
    let [type, _, amount, gender, cse] = opts.trim().split(' ');

    if(
        type.trim() !== 'сущ' ||
        amount && amount.trim() !== 'ед' ||
        gender && gender.trim() !== 'муж' ||
        cse && cse.trim() !== 'им'
    ){
        return;
    }

    if(word.length < 14){
        return;
    }

    const hasBadChars = word.split('').some(l => l.toUpperCase() === l.toLowerCase());

    if(hasBadChars){
        return;
    }
    
    console.log(word);
    words.push(word);

}); 

lineReader.on('close', () => {
    console.log("completed");
    fs.writeFileSync(path.resolve(__dirname, 'words-rus.txt'), words.join('\n'));
    console.log('done!');
})