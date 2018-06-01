const router = require('express').Router();
const {
    GameSessions,
    InvalidWordError,
    WordAlreadyPresentError
} = require('./core/gameSession');


router.post('/session', 
    catchUnhandled((req, res, next) => {
        const game = GameSessions.getNewGame();

        res.json({
            sessionId: game._id,
            word: game.getMainWord()
        })
    })
);

router.get('/session/:sessionId',
    getGameSessionMiddlw('sessionId'),
    catchUnhandled(async (req, res, next) => {
        const {game} = res.locals;

        res.json({
            sessionId: game._id,
            word: game.getMainWord(),
            history: game.wordsHistory
        })
    })  
);

router.post('/session/:sessionId/applyWord',
    getGameSessionMiddlw('sessionId'),
    catchUnhandled( async (req, res, next) => {
        const {game} = res.locals;
        
        if(!req.body || !req.body.word){
            const e = new Error("'word' is not specified");
            e.status = 400;
            return next(e);
        }

        const {word} = req.body;

        try{
            game.applyWord(word);
        } catch(e){
            if(e instanceof InvalidWordError || e instanceof WordAlreadyPresentError){
                e.status = 400;
            }
            return next(e)
        }

        res.json({
            history: game.wordsHistory
        });
    })
);


function getGameSessionMiddlw(reqParam){
    return (req, res, next) => {
        const game = GameSessions.getGameSession(req.params[reqParam]);
        if(!game){
            const e = new Error("Game not found");
            e.status = 404;
            return next(e);
        }
        res.locals.game = game;
        next();
    }
}


function catchUnhandled(func){
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (e){
            if(typeof e === 'undefined'){
                return next(new Error("Unhandled rejection"));
            }
            return next(e);
        }
    }
}

module.exports = router;