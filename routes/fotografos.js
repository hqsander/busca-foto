var express = require("express");
var router = express.Router();
var Fotografo = require("../models/fotografo");
var middleware = require("../middleware");


// INDEX RESTful
router.get("/", function (req, res) {
    //recupera todos os fotógrafos
    Fotografo.find({}, function (err, todosFotografos) {
        if (err) {
            console.log(err);
        } else {
            res.render("fotografos/index", { fotografos: todosFotografos });
        }
    });
});

// CREATE RESTful
router.post("/", middleware.isLoggedIn, function (req, res) {
    //recupera dados do form e adiciona ao array de fotógrafos
    var nome = req.body.nome;
    var imagem = req.body.imagem;
    var bio = req.body.bio;
    var autor = {
        id: req.user._id,
        username: req.user.username
    };
    var novoFotografo = { nome: nome, imagem: imagem, bio: bio, autor: autor };
    //Cria o fotógrafo e manda para o banco
    Fotografo.create(novoFotografo, function (err, recemCriado) {
        if (err) {
            console.log(err);
        } else {
            //após criar o fotógrafo, redirecionar para listagem
            //console.log(recemCriado);
            res.redirect("/fotografos");
        }
    });
});

// NEW RESTful
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("fotografos/new");
});

// SHOW RESTful
router.get("/:id", function (req, res) {
    //console.log(req.params.id);
    //procura fotografo pelo id
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Fotografo.findById(req.params.id).populate("comentarios").exec(function (err, fotografoEncontrado) {
            if (err) {
                console.log(err);
            } else {
                //console.log(fotografoEncontrado);
                //exibe o fotógrafo
                res.render("fotografos/show", { fotografo: fotografoEncontrado });
            }
        });
    }
});

// EDIT RESTful
router.get("/:id/edit", middleware.verificaAutoriaFotografo, function (req, res) {
    Fotografo.findById(req.params.id, function (err, fotografoEncontrado) {
        res.render("fotografos/edit", { fotografo: fotografoEncontrado });
    });
});

// UPDATE RESTful
router.put("/:id", middleware.verificaAutoriaFotografo, function (req, res) {
    // procura e atualiza o fotógrafo
    Fotografo.findByIdAndUpdate(req.params.id, req.body.fotografo, function (err, fotografoAtualizado) {
        if (err) {
            res.redirect("/fotografos");
        } else {
            //exibe fotógrafo atualizado
            res.redirect("/fotografos/" + fotografoAtualizado.id);
        }
    });
});

// DESTROY RESTful
router.delete("/:id", middleware.verificaAutoriaFotografo, function (req, res) {
    Fotografo.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/fotografos");
        } else {
            res.redirect("/fotografos");
        }
    });
});


module.exports = router;

