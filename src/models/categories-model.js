const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const uuid = require('uuid-random');

/**
 * @description modelo que guarda datos de categorias
 */

const schema = new mongoose.Schema(
    {
        // Identificador
        _id: { type: String, default: () => uuid() },
        // Categoria
        category: {
            type: String, require: true, index: true, unique: true // <--se crea el index
        },
        // Descripcoin de la categoria
        description: { type: String, require: true },
        // Activo
        active: { type: Boolean, require: true },
        // Actualizacion usuario
        updateUser: { type: String, require: true },
        // Creacion usuario
        createUser: { type: String, require: true }
    },
    {
        timestamps: true,
    }
);

schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
// El index se crea (Siempre y cuando la coleccion este vacia o sin ningun registro que incumpla con lo requerido)

const model = mongoose.model('Categories', schema, 'categories');

module.exports = model;
