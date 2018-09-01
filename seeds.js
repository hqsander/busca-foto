var mongoose = require("mongoose");
var Fotografo = require("./models/fotografo");
var Comentario = require("./models/comentario");
var Usuario = require("./models/usuario");

var data = [
    {
        name: "vvv",
        image: "vvv.jpg",
        description: "vvv"
    },
    {
        name: "xxx",
        image: "xxx.jpg",
        description: "xxx"
    },
    {
        name: "ccc",
        image: "ccc.jpg",
        description: "ccc"
    }
];

function seedDB() {
    //Remove todos os fotógrafos
    Fotografo.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Os fotógrafos foram excluídos.");
    });

    Comentario.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Os comentários foram excluídos.");
    });

    Usuario.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Os usuários foram excluídos.");
    });
}

module.exports = seedDB;
