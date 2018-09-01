var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var usuarioSchema = new mongoose.Schema({
    username: String,
    password: String
});

usuarioSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Usuario", usuarioSchema);