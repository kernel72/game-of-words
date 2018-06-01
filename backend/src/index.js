const {Library} = require('./core/library');

const log4js = require('log4js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const routes = require('./routes');

const httpLogger = log4js.getLogger('http');
const logger = log4js.getLogger('app');

httpLogger.level = 'debug';
logger.level = 'debug';

app.use(log4js.connectLogger(httpLogger));
app.use(bodyParser.json())
app.use(routes);

app.use((err, req, res, next) => {
    let response = {
        code: err.status || 500,
        message: err.message,
        errors: err.errors
    };

    if(response.code === 500){
        response.stack = err.stack;
        logger.error(err);
    }

    res.status(response.code).json(response);
});

Library.loadLibraryFromFile(path.resolve(__dirname, './dicts/words-rus.txt')).then(() => {
    const listener = app.listen(8080, () => {
        logger.info(`Ready and listening at ${listener.address().address}:${listener.address().port}`);
    })
});



module.exports = app;