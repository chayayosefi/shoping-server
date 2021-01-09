const { Schema, model } = require('mongoose')
const { schema } = require('./category')

const productSchema = new Schema({
    name: String,
    categoryId: { type: Schema.Types.ObjectId, ref: "category" },
    price: Number,
    imagePath: String
})

const Product = model('prouct', productSchema)
module.exports = Product