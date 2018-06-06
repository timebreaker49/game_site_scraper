var mongoosee = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new NoteSchema({
    body:  String
})

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;