const moment = require('moment-timezone');

const codes = require('../messages/codes');

const FORMAT_DATE = process.env.DATE_FORMAT || 'MM/DD/YYYY HH:mm:ss';
const TIME_ZONE = process.env.TIME_ZONE || 'America/Mexico_City';
const validate = (obj, properties) => {
    // console.log('Objeto a validar: ', obj);
    // console.log('Objeto a validar: ', properties);
    const validations = [];
    properties.forEach((property) => {
        const value = obj[property];
        if (!value) {
            validations.push(codes.format(codes.MSGS.VGBL000, property));
        }

        if (Array.isArray(value) && value.length <= 0) {
            validations.push(codes.format(codes.MSGS.VGBL000, property));
        }
    });
    return validations;
};

const formatDate = (date, formato) => {
    let dateFormated;
    if (formato) {
        dateFormated = moment(new Date(date).getTime()).tz(TIME_ZONE).format(formato);
    } else {
        dateFormated = moment(new Date(date).getTime()).tz(TIME_ZONE).format(FORMAT_DATE);
    }
    return dateFormated;
};
const getDateNow = (subtractMinutes = false) => {
    const momentDate = moment(new Date()).tz(TIME_ZONE);
    if (subtractMinutes) {
        momentDate.subtract(5, 'minutes');
    }
    const now = new Date(
        Date.UTC(
            momentDate.year(),
            momentDate.month(),
            momentDate.date(),
            momentDate.hours(),
            momentDate.minute(),
            momentDate.second()
        )
    );
    return now;
};
const getDateNowString = () => {
    const momentDate = moment(new Date()).tz(TIME_ZONE).format();
    return momentDate;
};

const formatDateDefault = () => {
    return moment(new Date().getTime()).tz(TIME_ZONE).format(FORMAT_DATE);
};

const getFields = (model, excluded) => {
    const fields = [];
    model.schema.eachPath((path) => {
        if (Array.isArray(excluded)) {
            if (excluded.indexOf(path) < 0) {
                fields.push(path);
            }
        } else if (!(path === excluded)) {
            fields.push(path);
        }
    });
    return fields;
};

const vaidateRequiredFields = (object, ...fields) => {
    const validations = [];
    if (!object) {
        validations.push(codes.MSGS.VGBL003);
        return validations;
    }
    fields.forEach((field) => {
        console.log('valor:', field, object, field in object, object[field]);
        if (!(field in object) || !object[field]) {
            validations.push(codes.format(codes.MSGS.VGBL000, field));
        }
    });
    return validations;
};

const validateModel = (model) => {
    console.log('Validando modelo.');
    const err = model.validateSync();
    const validations = [];
    if (err && err.errors) {
        console.log('Validaciones detectadas.');
        const fields = getFields(model, ['_id', '__v']);
        fields.forEach((field) => {
            if (err.errors[field] && err.errors[field].kind === 'required') {
                validations.push(codes.format(codes.MSGS.VGBL000, field));
            }
        });
    }
    console.log('Validaciones resultantes: ', validations.length);
    return validations;
};

const zfill = (number, width) => {
    const numberOutput = Math.abs(number); /* Valor absoluto del número */
    const length = number.toString().length; /* Largo del número */
    const cero = '0'; /* String de cero */

    if (width <= length) {
        if (number < 0) {
            return `-${numberOutput.toString()}`;
        }
        return numberOutput.toString();
    }
    if (number < 0) {
        return `-${cero.repeat(width - length)}${numberOutput.toString()}`;
    }
    return cero.repeat(width - length) + numberOutput.toString();
};

const generateRef = (idTransaction, startDate) => {
    const timeStamp = Math.floor(startDate / 1000); /* Valor absoluto del número */
    const referencia = `${timeStamp}${idTransaction.substr(idTransaction.length - 4, idTransaction.length)}`;
    return referencia;
};

/**
 *
 * @param {String} texto Texto claro
 * @param {Number} posicionesLegibles Numero caracteres para dejar visibles
 * @param {Boolean} left orientacion de caracteres visibles
 * @returns Texto con caracteres remplazados
 */
const replaceText = (texto, posicionesLegibles, left = false) => {
    const rest = texto.length - posicionesLegibles;
    if (left) {
        return texto.slice(0, posicionesLegibles) + '*'.repeat(rest);
    }
    return '*'.repeat(rest) + texto.slice(-posicionesLegibles);
};

const sortQuery = (sorts, matches) => {
    const sort = {};
    if (sorts && sorts.length) {
        sorts.forEach((orden) => {
            sort[matches[orden.field]] = orden.direction === 'desc' ? -1 : 1;
        });
    }
    return sort;
};

/**
 * Obtiene la expresion regular para un filtro
 * @param { object } filter filter to get regex filter
 */
const getRegexFilter = (filter) => {
    let value;
    value = `${filter}`;
    if (filter === 'string') {
        value = value.replace('+', '\\+').replace('.', '\\.');
    }
    value = value.replace(/[aÁá]/g, '[aÁá]');
    value = value.replace(/[eÉé]/g, '[eÉé]');
    value = value.replace(/[iÍí]/g, '[iÍí]');
    value = value.replace(/[oÓó]/g, '[oÓó]');
    value = value.replace(/[uÚú]/g, '[uÚú]');
    return new RegExp(value, 'i');
};

const getFilters = (requestFilters, matches) => {
    const andArray = [];
    if (requestFilters) {
        const filters = Object.keys(requestFilters);
        filters.forEach((field) => {
            const type = typeof requestFilters[field];
            console.log('type', type);
            const matchField = {};
            switch (type) {
                case 'string':
                    andArray.push({
                        $regexMatch: {
                            input: `$${matches[field]}`,
                            regex: getRegexFilter(requestFilters[field]),
                        },
                    });
                    break;
                case 'boolean':
                    andArray.push({
                        $eq: [`$${matches[field]}`, requestFilters[field]],
                    });
                    break;
                default:
                    matchField[matches[field]] = requestFilters[field];
                    andArray.push({
                        $eq: {
                            input: { $convert: { input: `$${matches[field]}`, to: 'string' } },
                            regex: getRegexFilter(requestFilters[field]),
                        },
                    });
            }
        });

        if (filters.length > 0) {
            return {
                $match: {
                    $expr: {
                        $and: andArray,
                    },
                },
            };
        }
    }
    return null;
};

module.exports = {
    validate,
    formatDate,
    formatDateDefault,
    getFields,
    vaidateRequiredFields,
    validateModel,
    zfill,
    generateRef,
    FORMAT_DATE,
    TIME_ZONE,
    getDateNow,
    getDateNowString,
    replaceText,
    sortQuery,
    getRegexFilter,
    getFilters
};
