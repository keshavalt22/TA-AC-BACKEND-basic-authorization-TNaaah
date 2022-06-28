let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
    content: {type: String, required: true},
    likes: {type: Number, default: 0},
    articleId:{type: Schema.Types.ObjectId, ref: "Article", required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);

