const util = require('util');
const zero = require('../utils/zero');

class Logger {
    constructor(id) {
        this.id = id;
        this.messageTemplate = '[%s] [%s] %s';
    }

    hasPrint(level) {
        return (
            process.env.LEVEL_LOGS.toLowerCase() === 'debug' ||
            (process.env.LEVEL_LOGS.toLowerCase() === 'warn' && level === 'warn') ||
            (process.env.LEVEL_LOGS.toLowerCase() === 'info' && level === 'info')
        );
    }

    info(message, ...params) {
        if (this.hasPrint('info')) {
            if (params && params.length > 0) {
                console.log(
                    util.format(this.messageTemplate, zero.formatDateDefault(), this.id, message),
                    JSON.stringify(params)
                );
            } else {
                console.log(util.format(this.messageTemplate, zero.formatDateDefault(), this.id, message));
            }
        }
    }

    error(message, ...params) {
        if (params && params.length > 0) {
            console.error(util.format(this.messageTemplate, zero.formatDateDefault(), this.id, message), params);
        } else {
            console.error(util.format(this.messageTemplate, zero.formatDateDefault(), this.id, message));
        }
    }

    warn(message, ...params) {
        if (this.hasPrint('warn')) {
            if (params && params.length > 0) {
                console.warn(
                    util.format(this.messageTemplate, zero.formatDateDefault(), this.id, message),
                    JSON.stringify(params)
                );
            } else {
                console.warn(util.format(this.messageTemplate, zero.formatDateDefault(), this.id, message));
            }
        }
    }

    debug(message, ...params) {
        if (this.hasPrint('debug')) {
            if (params && params.length > 0) {
                console.debug(
                    util.format(this.messageTemplate, zero.formatDateDefault(), this.id, message),
                    JSON.stringify(params)
                );
            } else {
                console.debug(util.format(this.messageTemplate, zero.formatDateDefault(), this.id, message));
            }
        }
    }
}

module.exports = { Logger };
