var mongoose = require("mongoose");

var fotografoSchema = new mongoose.Schema({
    nome: String,
    imagem: String,
    bio: String,
    autor: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        },
        username: String
    },
    comentarios: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comentario"
        }
    ]
});

module.exports = mongoose.model("Fotografo", fotografoSchema);