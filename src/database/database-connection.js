const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const promise = require('bluebird');
// const Logger = require('../messages/logger').Logger;

// const logger = new Logger('database-connection');

// Promesas para el funcionamiento de la obtención de datos y registro
mongoose.Promise = promise;

const client = new MongoClient(process.env.MONGO_URI);

let isConnected;
/**
 * @description Constante la cual ejecuta la función a mongo para después cerrarla
 * @param {*} db
 * @param {*} fn
 */
const dbExecute = (db, fn) => db.then(fn);

/**
 * @description Conecta y ejeuta las peticiones a mongo
 * @param {*} fn
 */
const connectAndExecute = (fn) => {
    if (isConnected) {
        // logger.info('=> Reutiliza la conexion', fn);
        return Promise.resolve().then(fn);
    }
    // logger.info('=> using new database',process.env.MONGO_URI, fn);
    return mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 0
        })
        .then((db) => {
            isConnected = db.connections[0].readyState;
            // logger.info('=> isConnected {}', isConnected);
        })
        .then(fn);
};

module.exports = { connectAndExecute, client, dbExecute };
