/* eslint-disable import/newline-after-import */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
const util = require('util');
const moreInfo = 'https://keykolor.com/support/info/%s';

const MSGS = {
    CGBL000: { code: 'CGBL000', message: 'Code %s not found.', level: 'ERROR', description: 'Code not found in lambda function.' },
    /** Errores comunes */
    EGBL000: { code: 'EGBL000', message: 'Ha ocurrido un error inesperado favor de consultar a su administrador.', level: 'ERROR', description: 'Describe un error no controlado y debe verificarse, ya puede implicar el fallo en un servidor.' },
    EGBL001: { code: 'EGBL001', message: 'Error al realizar la operaci\u00f3n de registro. Origen: %s', level: 'ERROR', description: 'Describe que una operaci\u00f3n no se fectu\u00f3 correctamente en la capa de acceso a datos' },
    EGBL002: { code: 'EGBL002', message: 'Error al realizar la operaci\u00f3n de consulta de datos. Origen: %s', level: 'ERROR', description: 'Describe que una operaci\u00f3n no se efectu\u00f3 correctamente en la capa de acceso a datos' },
    EGBL003: { code: 'EGBL003', message: 'Error al realizar la operaci\u00f3n de actualizaci\u00f3n. Origen: %s', level: 'ERROR', description: 'Describe que una operaci\u00f3n no se efectu\u00f3 correctamente en la capa de acceso a datos' },
    EGBL004: { code: 'EGBL004', message: 'Error al realizar la operaci\u00f3n de cambio de estatus. Origen: %s', level: 'ERROR', description: 'Describe que una operaci\u00f3n no se efectu\u00f3 correctamente en la capa de acceso a datos' },
    EGBL005: { code: 'EGBL005', message: 'Error al realizar la operaci\u00f3n de activaci\u00f3n. Origen: %s', level: 'ERROR', description: 'Describe que una operaci\u00f3n no se efectu\u00f3 correctamente en la capa de acceso a datos' },
    EGBL006: { code: 'EGBL006', message: 'Error al realizar la operaci\u00f3n de eliminado. Origen: %s', level: 'ERROR', description: 'Describe que una operaci\u00f3n no se fectu\u00f3 correctamente en la capa de acceso a datos' },
    EGBL007: { code: 'EGBL007', message: 'El registro que intenta consultar no existe. Origen: %s', level: 'ERROR', description: 'El registro que intenta consultar no existe.' },
    EGBL008: { code: 'EGBL008', message: 'El numero de telefono no es m\u00f3vil.', level: 'ERROR', description: 'El tipo de telefono no es movil.' },
    EGBL009: { code: 'EGBL009', message: 'No se recibi\u00f3 respuesta del servidor o existe un problema de conexi\u00f3n. Origen %s.', level: 'ERROR', description: 'Describe que una operaci\u00f3n no se fectu\u00f3 correctamente en la capa de acceso a datos' },
    /** Mensajes informativos comunes */
    IGBL000: { code: 'IGBL000', message: 'Operaci\u00f3n realizada exitosamente.', level: 'SUCCESS', description: 'Describe que una operaci\u00f3n se efectu\u00f3 correctamente' },
    IGBL001: { code: 'IGBL001', message: 'Operaci\u00f3n realizada exitosamente. Sin registros disponibles.', level: 'SUCCESS', description: 'Describe que una operaci\u00f3n se efectu\u00f3 correctamente' },
    IGBL002: { code: 'IGBL002', message: 'Se han insertado los datos exitosamente.', level: 'SUCCESS', description: 'Describe que una operaci\u00f3n se efectu\u00f3 correctamente' },
    IGBL003: { code: 'IGBL003', message: 'Se han actualizado los datos exitosamente.', level: 'SUCCESS', description: 'Describe que una operaci\u00f3n se efectu\u00f3 correctamente' },

    /** Validaciones comunes */
    VGBL000: { code: 'VGBL000', message: 'The field %s is required.', level: 'ERROR', description: 'You must enter a value in the indicated field.' },
    VGBL001: { code: 'VGBL001', message: 'Bad request, data is required.', level: 'ERROR', description: 'You must enter a value in the request.' },
    VGBL002: { code: 'VGBL002', message: 'The parameter %s is not correct', level: 'ERROR', description: 'You must enter a correct value in the indicated parameter.' },
    VGBL003: { code: 'VGBL003', message: 'Malformed JSON in request body', level: 'ERROR', description: 'You must enter a correct JSON in request body' },
    VGBL004: { code: 'VGBL004', message: 'El campo %s es obligatorio. No puede venir en blanco.', level: 'ERROR', description: 'El campo viene vac\u00edo.' },

    /** De seguridad */
    SGBL000: { code: 'SGBL000', message: 'Datos de acceso incorrectos.', level: 'ERROR', description: 'Datos de acceso incorrectos.' },
    SGBL001: { code: 'SGBL001', message: 'Failed to get User info', level: 'ERROR', description: 'User not found or not exist.', moreInfo: '' },
    SGBL002: { code: 'SGBL002', message: 'Failed to get User info', level: 'ERROR', description: 'User not found or not exist.', moreInfo: '' },
    SGBL003: { code: 'SGBL003', message: 'Access code invalid', level: 'ERROR', description: 'Access code or user id invalid', moreInfo: '' },
    SGBL004: { code: 'SGBL004', message: 'Access code expired', level: 'ERROR', description: 'Access code expired', moreInfo: '' },
    SGBL005: { code: 'SGBL005', message: 'Access code error', level: 'ERROR', description: 'There is no information for idUser and code provided', moreInfo: '' },
    SGBL006: { code: 'SGBL006', message: 'Failed to login', level: 'ERROR', description: 'The user does not have access to the system', moreInfo: '' },
    SGBL007: { code: 'SGBL007', message: 'Failed to refresh token', level: 'ERROR', description: 'Token not found', moreInfo: '' },

    /** De user-registration */
    EUSR001: { code: 'EUSR001', message: 'Los campos password y confirmPassword no coincicden.', level: 'ERROR', description: 'Campo password erroneo.' },
    EUSR002: { code: 'EUSR002', message: 'Ya existe un usuario con el email proporcionado.', level: 'ERROR', description: 'Ya existe un usuario con el email proporcionado.' },
    EUSR003: { code: 'EUSR003', message: 'No se encontr\u00f3 la pol\u00edtica de acceso para el usuario proporcionado.', level: 'ERROR', description: 'No existe la pol\u00edtica de acceso.' },
    EUSR004: { code: 'EUSR004', message: 'No se encontr\u00f3 el rol(tipo) para el usuario proporcionado.', level: 'ERROR', description: 'ROOMIE, INTERNAL, TUTOR, LANDLORD.' },
    EUSR005: { code: 'EUSR005', message: 'El usuario proporcionado no existe.', level: 'ERROR', description: 'No existe el usuario proporcionado.' },
    EUSR006: { code: 'EUSR006', message: 'No es posible realizar la operacion.', level: 'ERROR', description: 'El numero ya existe.' },
    EUSR007: { code: 'EUSR007', message: 'No se puede registrar por datos duplicados.', level: 'ERROR', description: 'Elementos duplicados.' },
};

const format = (code, ...params) => {
    const codigo = JSON.parse(JSON.stringify(code));
    if (codigo) {
        for (let i = 0; i < params.length; i++) {
            codigo.message = util.format(codigo.message, params[i]);
        }
        codigo.moreInfo = util.format(moreInfo, code);
        return codigo;
    }
    return util.format(MSGS.CGBL000, code);
};

module.exports = {
    MSGS,
    format
};
