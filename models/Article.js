var mogoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    title: {
        type: String,
        trim: true,
        required: true
    },
    link: {
        type: String,
        trim: true,
        required: true
    },
    summary: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        trim: true,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }

})

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;