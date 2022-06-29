let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {type: String, required: true},
    quantity: Number,
    price: Number,
    category: [String],
    likes: {type: Number, default: 0}
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);
