const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    'Content-Type': 'application/json'
};

const done = (body, code) => {
    return {
        body: JSON.stringify({
            ok: true,
            response: body,
            responseCode: code,
            validations: [],
        }),
        statusCode: 200,
        headers,
    };
};

const error = (code, statusCode) => {
    return {
        body: JSON.stringify({
            ok: false,
            response: null,
            responseCode: code,
            validations: [],
        }),
        statusCode: statusCode || 200,
        headers,
    };
};

const validations = (codes) => {
    return {
        body: JSON.stringify({
            ok: false,
            response: null,
            responseCode: null,
            validations: codes,
        }),
        statusCode: 200,
        headers,
    };
};

module.exports = {
    done,
    error,
    validations
};
