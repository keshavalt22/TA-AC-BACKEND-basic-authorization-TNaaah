let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let articleSchema = new Schema({
    title: String,
    description: String,
    likes: {type: Number, default: 0},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}, {timestamps: true});

let Article = mongoose.model("Article", articleSchema);

module.exports = Article;

